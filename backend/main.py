import json
import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from litellm import completion

from prompts.overthinking_prompt import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

# Use Litellm with a Mistral model by default. Can be overridden via env.
MODEL = os.getenv("LITELLM_MODEL", "mistral/mistral-medium-3-5")

app = FastAPI(title="Am I Overthinking This? API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Score -> category/verdict-style table. The backend is the source of truth
# for this mapping so the UI is always consistent, even though the model
# also free-writes headline/verdict copy per-situation.
SCORE_TIERS = [
    {
        "min": 0, "max": 20,
        "category": "You're Onto Something",
        "style": "Nope. This one is worth paying attention to.",
        "color": "#B7E4C7",
        "tone": "calm",
    },
    {
        "min": 21, "max": 40,
        "category": "Slightly Suspicious",
        "style": "Hmm. You're not imagining this, but don't write the screenplay yet.",
        "color": "#FFE066",
        "tone": "watchful",
    },
    {
        "min": 41, "max": 60,
        "category": "Could Go Either Way",
        "style": "Okay, there's something to think about—but you're filling in some blanks.",
        "color": "#FFB347",
        "tone": "uncertain",
    },
    {
        "min": 61, "max": 80,
        "category": "You're Spiraling",
        "style": "Respectfully, you've taken this a bit too far.",
        "color": "#F5FF00",
        "tone": "alarm",
    },
    {
        "min": 81, "max": 100,
        "category": "Nuclear Overthinking",
        "style": "Put the phone down. The investigation is over.",
        "color": "#FF4D4D",
        "tone": "critical",
    },
]


def tier_for_score(score: int) -> dict:
    score = max(0, min(100, score))
    for tier in SCORE_TIERS:
        if tier["min"] <= score <= tier["max"]:
            return tier
    return SCORE_TIERS[-1]


class AnalyzeRequest(BaseModel):
    situation: str = Field(..., min_length=3, max_length=2000)


class AnalyzeResponse(BaseModel):
    score: int
    category: str
    verdict_style: str
    color: str
    headline: str
    verdict: str
    reality_check: str
    evidence: list[str]


def _extract_json(raw_text: str) -> dict:
    """Claude is instructed to return raw JSON, but strip fences defensively."""
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    return json.loads(cleaned)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    # Use litellm completion API. No Anthropic client / key required here.
    # The Litellm client will use whatever authentication is configured in the
    # environment (e.g., LITELLM_API_KEY) or via the litellm config.
    # try:
    response = completion(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(payload.situation)},
        ],
        temperature=0,
        max_tokens=600,
    )
    print(f"Raw model response: {response}")
    # except Exception as exc:
    #     print(str(exc))
    #     raise HTTPException(502, {"type": "api", "message": str(exc)})

    

    parsed = _extract_json(response.choices[0].message.content)
    
    score = int(parsed.get("score", 50))
    score = max(0, min(100, score))
    tier = tier_for_score(score)
    evidence = parsed.get("evidence") or []

    return AnalyzeResponse(
        score=score,
        category=tier["category"],
        verdict_style=tier["style"],
        color=tier["color"],
        headline=parsed.get("headline", ""),
        verdict=parsed.get("verdict", ""),
        reality_check=parsed.get("reality_check", ""),
        evidence=evidence[:3],
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)