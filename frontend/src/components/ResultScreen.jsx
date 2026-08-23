export default function ResultScreen({ result, onRetry }) {
  const {
    score,
    category,
    verdict_style,
    color,
    headline,
    verdict,
    reality_check,
    evidence,
  } = result;

  const handleShare = async () => {
    const text = `${score}/100 — ${category}. ${headline} (via Am I Overthinking This?)`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied your shame to the clipboard.");
    } catch {
      alert(text);
    }
  };

  return (
    <div className="screen result-screen">
      <div
        className="hard-box result-card"
        style={{ background: color }}
      >
        <div className="score-ring-wrap">
          <div className="score-ring">
            <span className="score-number">{score}</span>
            <span className="tag score-max">/100</span>
          </div>
        </div>

        <div className="tag category-tag">{category.toUpperCase()}</div>

        <h2 className="verdict-headline">{headline}</h2>
        <p className="verdict-style">{verdict_style}</p>
        <p className="verdict-body">{verdict}</p>

        <div className="reality-check">
          <strong>Reality check:</strong> {reality_check}
        </div>

        {evidence?.length > 0 && (
          <ul className="evidence-list">
            {evidence.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        <div className="result-actions">
          <button className="btn" onClick={onRetry}>
            TRY ANOTHER CRISIS
          </button>
          <button className="btn btn-outline" onClick={handleShare}>
            ⤴ SHARE MY SHAME
          </button>
        </div>
      </div>
    </div>
  );
}
