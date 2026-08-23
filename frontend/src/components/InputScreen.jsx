import { useState } from "react";

const MAX_WORDS = 200;
const PLACEHOLDER =
  "Type the situation you're currently obsessing over... (e.g., 'They ended the text with a period instead of an exclamation mark, does this mean they're mad at me?')";

export default function InputScreen({ onSubmit }) {
  const [text, setText] = useState("");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tooMany = wordCount > MAX_WORDS;
  const canSubmit = text.trim().length >= 3 && !tooMany;

  return (
    <div className="screen input-screen">
      <h1 className="hero-title">
        GET OUT OF
        <br />
        <span className="hero-highlight">YOUR HEAD</span>
      </h1>
      <p className="hero-sub">
        Dump the thought loop here. We'll tell you if you're actually onto
        something or just losing your mind.
      </p>

      <div className="hard-box textarea-box">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
        />
        <span className={`tag word-count ${tooMany ? "over" : ""}`}>
          {wordCount} / {tooMany ? "TOO MANY WORDS" : `${MAX_WORDS} WORDS`}
        </span>
      </div>

      <button
        className="btn btn-primary submit-btn"
        disabled={!canSubmit}
        onClick={() => onSubmit(text.trim())}
      >
        ANALYZE MY BRAIN ⚡
      </button>

      <div className="tag warning-tag">⚠ WARNING: BRUTAL HONESTY AHEAD</div>
    </div>
  );
}
