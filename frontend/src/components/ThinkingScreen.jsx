import { useEffect, useState } from "react";

const MESSAGES = [
  "Checking your 3am anxieties...",
  "Cross-referencing with your group chat...",
  "Analyzing every possible way this could go wrong...",
  "Re-reading their message for hidden meaning...",
  "Consulting a very tired therapist...",
  "Counting how many times you've reopened this chat...",
  "Googling 'is this normal'...",
  "Checking if the earth is still spinning...",
  "Simulating 47 alternate timelines...",
  "Asking if you've tried just... asking them...",
  "Weighing evidence vs. vibes...",
  "Calculating your catastrophizing coefficient...",
];

export default function ThinkingScreen() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1100);

    // Progress bar creeps toward ~92% and waits there until the real
    // response arrives and swaps the screen out from above.
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 92 ? p + (92 - p) * 0.12 + 1 : p));
    }, 250);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="screen thinking-screen">
      <h2 className="thinking-title">THINKING...</h2>
      <div className="progress-track hard-box">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="tag thinking-message" key={index}>
        &gt; {MESSAGES[index]}
      </div>
    </div>
  );
}
