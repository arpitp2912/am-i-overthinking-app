import { useState } from "react";
import InputScreen from "./components/InputScreen.jsx";
import ThinkingScreen from "./components/ThinkingScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import { pickError } from "./errors.js";

// Minimum time to stay on the thinking screen, so the slideshow of
// messages always gets to play even if the API responds instantly.
const MIN_THINKING_MS = 2600;

export default function App() {
  const [stage, setStage] = useState("input"); // input | thinking | result | error
  const [result, setResult] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleSubmit = async (situation) => {
    setStage("thinking");
    const startedAt = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation }),
      });

      if (!res.ok) {
        // Backend sends { detail: { type: "api" | "rateLimit" | "timeout" } }
        // for known failure modes; anything else falls back to "api".
        let type = "api";
        if (res.status === 429) type = "rateLimit";
        else if (res.status === 504) type = "timeout";
        try {
          const body = await res.json();
          if (body?.detail?.type) type = body.detail.type;
        } catch {
          /* body wasn't JSON — keep the status-based guess */
        }
        throw new Error(type);
      }

      const data = await res.json();
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_THINKING_MS - elapsed);

      setTimeout(() => {
        setResult(data);
        setStage("result");
      }, remaining);
    } catch (err) {
      // A thrown TypeError (fetch itself failing, e.g. no network) has no
      // useful message here — bucket it as a generic api error too.
      const type = ["api", "rateLimit", "timeout"].includes(err.message)
        ? err.message
        : "api";
      setErrorInfo(pickError(type));
      setStage("error");
    }
  };

  const handleRetry = () => {
    setResult(null);
    setErrorInfo(null);
    setStage("input");
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1 className="logo">AM I OVERTHINKING THIS?</h1>
      </header>

      <main className="main">
        {stage === "input" && <InputScreen onSubmit={handleSubmit} />}
        {stage === "thinking" && <ThinkingScreen />}
        {stage === "result" && result && (
          <ResultScreen result={result} onRetry={handleRetry} />
        )}
        {stage === "error" && errorInfo && (
          <ErrorScreen error={errorInfo} onRetry={handleRetry} />
        )}
      </main>

      <footer className="footer">
        <span className="logo">Am I Overthinking This?</span>
        <small>Not therapy. Not a diagnosis. Just a very confident guess.</small>
      </footer>
    </div>
  );
}
