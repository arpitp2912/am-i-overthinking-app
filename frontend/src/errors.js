export const errors = {
  api: [
    {
      title: "THE OVERTHINKING MACHINE IS OVERTHINKING.",
      subtitle: "Try again in a second.",
    },
    {
      title: "AN UNEXPECTED SPIRAL OCCURRED.",
      subtitle: "Ironically, the app is now overthinking itself.",
    },
    {
      title: "WE LOST THE PLOT.",
      subtitle: "Try again before your brain makes up another theory.",
    },
  ],
  rateLimit: [
    {
      title: "WHOA. EVEN WE CAN'T OVERTHINK THIS FAST.",
      subtitle: "Give the servers a second.",
    },
    {
      title: "TOO MANY THOUGHTS.",
      subtitle: "Both from you and apparently everyone else.",
    },
  ],
  timeout: [
    {
      title: "THE JUDGMENT MACHINE NEEDED A MINUTE.",
      subtitle: "Which is a little ironic. Try again.",
    },
    {
      title: "THE AI TOOK TOO LONG TO DECIDE.",
      subtitle: "Apparently, it's overthinking too.",
    },
  ],
};

// Backend sends { detail: { type: "api" | "rateLimit" | "timeout", message } }
// on failure. Fall back to "api" for anything unrecognized (network drop,
// unexpected status code, etc.) so there's always a message to show.
export function pickError(type) {
  const bucket = errors[type] || errors.api;
  return bucket[Math.floor(Math.random() * bucket.length)];
}
