# Am I Overthinking This?

Describe a situation you're spiraling about. An LLM reads it and returns a
0–100 overthinking score, a category, and a funny verdict.

```
backend/    FastAPI app, prompt kept in its own file
frontend/   React (Vite) app — input screen, thinking slideshow, result card
```

## Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your real ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

- `prompts/overthinking_prompt.py` — the system prompt and JSON contract sent
  to the model. Edit this file to change tone/humor without touching app logic.
- `main.py` — `/api/analyze` calls the model, then maps the returned score to
  one of five fixed tiers (`SCORE_TIERS`) so the category label, verdict
  style, and card color are always consistent — the model only free-writes
  the situational copy (headline, verdict, evidence, reality check).
- Swap `ANTHROPIC_MODEL` in `.env` if you want a different model than the
  default.

## Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173, proxies /api to :8000
```

Run the backend first (port 8000) — the Vite dev server proxies `/api/*`
requests to it (see `vite.config.js`).

## Score tiers

| Score | Category | Card color |
|---|---|---|
| 0–20 | You're Onto Something | calm mint |
| 21–40 | Slightly Suspicious | soft yellow |
| 41–60 | Could Go Either Way | amber |
| 61–80 | You're Spiraling | primary yellow |
| 81–100 | Nuclear Overthinking | red alert |

The result card's background color shifts with the tier, so a calm verdict
*looks* calm and a nuclear one *looks* like a warning label — not every
result reads as "spiraling."

## Safety note

The prompt instructs the model to drop the comedic tone and score low
(0–15) if a situation describes real danger, abuse, or self-harm, rather
than playing it for laughs. Worth spot-checking before you ship this
publicly — it's a heuristic in a prompt, not a guarantee.
