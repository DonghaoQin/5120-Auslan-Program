import React, { useState, useEffect, useMemo } from "react";

const API_URL = "https://auslan-backend.onrender.com/videos/";
const STORAGE_KEY = "LN_LEARNED_V2";

const CATEGORY_COLORS = {
  "1A. Essentials_Survival Signs": "#66D6BC",
  "1B. Greetings & Social Basics": "#F7A940",
  "2A. Family Members": "#9895FF",
  "2B. Feelings/Needs": "#3B82F6",
  "3A. School/Play": "#EF4444",
  "3B. Everyday/Actions": "#8B5CF6",
  "4A. Basic Questions": "#10B981",
  "4B. Interaction Clarification": "#F59E0B",
  Other: "#6B7280",
};

// --- utility functions ---
const slug = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

const CATEGORY_MAP = (() => {
  const C1A = [
    "thank_you",
    "no",
    "stop",
    "help",
    "seat",
    "drink",
    "sleeping",
    "go_to",
    "now",
    "not",
  ];
  const C1B = ["hello", "bye_bye", "apology", "ask", "welcome", "hi"];
  const C2A = [
    "mum",
    "brother",
    "sister",
    "baby",
    "you",
    "we",
    "yourself",
    "people",
    "our",
  ];
  const C2B = [
    "sad",
    "tired",
    "love",
    "smile",
    "upset",
    "cute",
    "like",
    "bad",
    "pizza",
    "dislike",
    "surprised",
    "dont_know",
    "disappointment",
    "thinking_reflection",
    "annoying",
  ];
  const C3A = [
    "play",
    "school",
    "teacher",
    "friend",
    "home",
    "already",
    "finished",
    "big",
    "fun",
    "copy",
    "jump_off",
  ];
  const C3B = [
    "wash_face",
    "share",
    "wait",
    "come_here",
    "move",
    "climb",
    "wear",
    "spoon",
    "look",
    "bath",
    "back_of_body",
    "hairbrush",
  ];
  const C4A = ["what", "why", "who", "how_old"];
  const C4B = ["again", "slow_down", "understand", "nothing"];
  const OTHER = [
    "auslan",
    "deaf_mute",
    "australia",
    "sign_name",
    "dog",
    "apple",
    "world",
  ];

  const m = {};
  C1A.forEach((k) => (m[k] = "1A. Essentials_Survival Signs"));
  C1B.forEach((k) => (m[k] = "1B. Greetings & Social Basics"));
  C2A.forEach((k) => (m[k] = "2A. Family Members"));
  C2B.forEach((k) => (m[k] = "2B. Feelings/Needs"));
  C3A.forEach((k) => (m[k] = "3A. School/Play"));
  C3B.forEach((k) => (m[k] = "3B. Everyday/Actions"));
  C4A.forEach((k) => (m[k] = "4A. Basic Questions"));
  C4B.forEach((k) => (m[k] = "4B. Interaction Clarification"));
  OTHER.forEach((k) => (m[k] = "Other"));
  return m;
})();

const categoryOf = (title) => CATEGORY_MAP[slug(title)] ?? "Other";

// --- main component ---
export default function FlashCardBasicWords() {
  const [step, setStep] = useState("category"); // "category" | "words" | "video"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 disable back navigation (keep mobile app isolated)
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  // fetch video list
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((x, idx) => {
          const title =
            x.filename?.toString() ||
            x.title?.toString() ||
            x.name?.toString() ||
            x.word?.toString() ||
            x.text?.toString() ||
            `Item ${idx + 1}`;
          const url = typeof x.url === "string" ? x.url : null;
          return { id: x.id ?? idx, title, url };
        });
        setWords(normalized);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // persist learned words
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learned]));
  }, [learned]);

  const buckets = useMemo(() => {
    const b = {};
    words.forEach((item) => {
      const cat = categoryOf(item.title);
      if (!b[cat]) b[cat] = [];
      b[cat].push(item);
    });
    return b;
  }, [words]);

  if (loading)
    return (
      <div style={styles.center}>
        <p>Loading vocabulary...</p>
      </div>
    );

  // Step 1 — choose category
  if (step === "category") {
    return (
      <div style={styles.page}>
        <h2 style={styles.header}>Choose a Scenario</h2>
        <div style={styles.grid}>
          {Object.keys(buckets).map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.categoryCard,
                borderColor: CATEGORY_COLORS[cat] || "#ccc",
              }}
              onClick={() => {
                setSelectedCategory(cat);
                setStep("words");
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2 — choose word
  if (step === "words" && selectedCategory) {
    const items = buckets[selectedCategory] || [];
    return (
      <div style={styles.page}>
        <button style={styles.backBtn} onClick={() => setStep("category")}>
          ⬅ Back
        </button>
        <h2 style={styles.header}>{selectedCategory}</h2>
        <div style={styles.wordGrid}>
          {items.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.wordCard,
                borderColor: CATEGORY_COLORS[selectedCategory],
                background: learned.has(item.title) ? "#E6F7F2" : "#fff",
              }}
              onClick={() => {
                setSelectedWord(item);
                setStep("video");
              }}
            >
              {item.title.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3 — view video
  if (step === "video" && selectedWord) {
    const isLearned = learned.has(selectedWord.title);
    return (
      <div style={styles.page}>
        <button style={styles.backBtn} onClick={() => setStep("words")}>
          ⬅ Back
        </button>
        <h2 style={styles.header}>{selectedWord.title.replace("_", " ")}</h2>
        {selectedWord.url ? (
          <video
            key={selectedWord.url}
            src={selectedWord.url}
            controls
            playsInline
            style={styles.video}
          />
        ) : (
          <p>No video available</p>
        )}

        <button
          style={{
            ...styles.learnBtn,
            background: isLearned ? "#10B981" : "#F59E0B",
          }}
          onClick={() =>
            setLearned((prev) => {
              const next = new Set(prev);
              if (next.has(selectedWord.title))
                next.delete(selectedWord.title);
              else next.add(selectedWord.title);
              return next;
            })
          }
        >
          {isLearned ? "Learned ✅" : "Mark as Learned"}
        </button>
      </div>
    );
  }

  return null;
}

/* --- Mobile-first styles --- */
const styles = {
  page: {
    background: "#F9FAFB",
    minHeight: "100vh",
    padding: "1.2rem",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  header: {
    fontSize: 20,
    marginBottom: "1rem",
    color: "#111827",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "12px",
  },
  categoryCard: {
    background: "#fff",
    border: "2px solid #E5E7EB",
    borderRadius: "12px",
    padding: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },
  wordGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
  },
  wordCard: {
    background: "#fff",
    border: "2px solid #D1D5DB",
    borderRadius: "10px",
    padding: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "capitalize",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#3B82F6",
    fontWeight: 600,
    fontSize: 16,
    marginBottom: "0.5rem",
    cursor: "pointer",
  },
  video: {
    maxWidth: "100%",
    borderRadius: "12px",
    marginBottom: "1rem",
  },
  learnBtn: {
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem 1.2rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "80%",
  },
  center: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
  },
};