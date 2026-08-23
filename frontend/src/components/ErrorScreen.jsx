export default function ErrorScreen({ error, onRetry }) {
  return (
    <div className="screen error-screen">
      <div className="hard-box error-card">
        <div className="tag error-tag">⚠ ERROR</div>
        <h2 className="error-title">{error.title}</h2>
        <p className="error-subtitle">{error.subtitle}</p>
        <button className="btn btn-primary" onClick={onRetry}>
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
