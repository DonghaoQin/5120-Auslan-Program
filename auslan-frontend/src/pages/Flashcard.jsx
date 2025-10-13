import React, { useState, useEffect, useMemo } from "react";

const API_URL =
  import.meta.env.VITE_VIDEOS_API_URL ||
  "https://auslan-backend.onrender.com/videos/";
const STORAGE_KEY = "LN_LEARNED_V2";

const CATEGORY_COLORS = {
  "Essentials Survival Signs": "#66D6BC",
  "Greetings & Social Basics": "#F7A940",
  "Family Members": "#9895FF",
  "Feelings/Needs": "#3B82F6",
  "School/Play": "#EF4444",
  "Everyday/Actions": "#8B5CF6",
  "Basic Questions": "#10B981",
  "Interaction Clarification": "#F59E0B",
  Other: "#6B7280",
};

function transparent(hex, alpha = 0.3) {
  const c = hex.substring(1);
  const num = parseInt(c, 16);
  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  const C1A = ["thank_you", "no", "stop", "help", "seat", "drink", "sleeping", "go_to", "now", "not"];
  const C1B = ["hello", "bye_bye", "apology", "ask", "welcome", "hi"];
  const C2A = ["mum", "brother", "sister", "baby", "you", "we", "yourself", "people", "our"];
  const C2B = ["sad", "tired", "love", "smile", "upset", "cute", "like", "bad", "pizza", "dislike", "surprised", "dont_know", "disappointment", "thinking_reflection", "annoying"];
  const C3A = ["play", "school", "teacher", "friend", "home", "already", "finished", "big", "fun", "copy", "jump_off"];
  const C3B = ["wash_face", "share", "wait", "come_here", "move", "climb", "wear", "spoon", "look", "bath", "back_of_body", "hairbrush"];
  const C4A = ["what", "why", "who", "how_old"];
  const C4B = ["again", "slow_down", "understand", "nothing"];
  const OTHER = ["auslan", "deaf_mute", "australia", "sign_name", "dog", "apple", "world"];
  const m = {};
  C1A.forEach((k) => (m[k] = "Essentials Survival Signs"));
  C1B.forEach((k) => (m[k] = "Greetings & Social Basics"));
  C2A.forEach((k) => (m[k] = "Family Members"));
  C2B.forEach((k) => (m[k] = "Feelings/Needs"));
  C3A.forEach((k) => (m[k] = "School/Play"));
  C3B.forEach((k) => (m[k] = "Everyday/Actions"));
  C4A.forEach((k) => (m[k] = "Basic Questions"));
  C4B.forEach((k) => (m[k] = "Interaction Clarification"));
  OTHER.forEach((k) => (m[k] = "Other"));
  return m;
})();

const categoryOf = (title) => CATEGORY_MAP[slug(title)] ?? "Other";

const CATEGORY_ORDER = [
  "Essentials_Survival Signs",
  "Greetings & Social Basics",
  "Family Members",
  "Feelings/Needs",
  "School/Play",
  "Everyday/Actions",
  "Basic Questions",
  "Interaction Clarification",
  "Other",
];

export default function FlashCardBasicWords() {
  const [step, setStep] = useState("category");
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

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((x, idx) => ({
          id: x.id ?? idx,
          title: x.filename || x.title || `Item ${idx + 1}`,
          url: x.url || null,
        }));
        setWords(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const clearCategoryLearned = (category) => {
    if (window.confirm(`Clear learned marks for ${category}?`)) {
      const filtered = [...learned].filter(
        (title) => categoryOf(title) !== category
      );
      setLearned(new Set(filtered));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  };

  const clearAllLearned = () => {
    if (window.confirm("Clear all learned words?")) {
      setLearned(new Set());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const learnedWords = words.filter((w) => learned.has(w.title));

  if (loading)
    return (
      <div style={styles.center}>
        <p>Loading vocabulary...</p>
      </div>
    );

  // Step 1 — Scenario list
  if (step === "category") {
    return (
      <div style={styles.page}>
        <h2 style={styles.header}>Choose a Scenario</h2>
        <div style={styles.categoryScroll}>
          {CATEGORY_ORDER.filter((cat) => buckets[cat]).map((cat) => (
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

        <div style={styles.backContainer}>
          <button style={styles.learnedBtn} onClick={() => setStep("learned")}>
             View Learned Words
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Words in category
  if (step === "words" && selectedCategory) {
    const items = buckets[selectedCategory] || [];
    const catColor = CATEGORY_COLORS[selectedCategory] || "#ccc";
    return (
      <div style={styles.page}>
        <h2 style={styles.header}>{selectedCategory}</h2>

        <div style={styles.wordGrid}>
          {items.map((item) => {
            const isLearned = learned.has(item.title);
            return (
              <button
                key={item.id}
                style={{
                  ...styles.wordCard,
                  borderColor: catColor,
                  background: isLearned ? transparent(catColor, 0.3) : "#fff",
                  color: "#111",
                }}
                onClick={() => {
                  setSelectedWord(item);
                  setStep("video");
                }}
              >
                {item.title.replace("_", " ")}
              </button>
            );
          })}
        </div>

        <div style={styles.backContainer}>
          <button
            style={{
              ...styles.backBtn,
              border: `2px solid ${catColor}`,
              color: catColor,
            }}
            onClick={() => setStep("category")}
          >
            ⬅ Back to Categories
          </button>
          <button
            style={{
              ...styles.clearBtn,
              borderColor: catColor,
              color: catColor,
            }}
            onClick={() => clearCategoryLearned(selectedCategory)}
          >
              Clear Learned in This Scenario
          </button>
        </div>
      </div>
    );
  }

  //  Step 3 — Learned Words page
  if (step === "learned") {
    return (
      <div style={styles.page}>
        <h2 style={styles.header}>Learned Words</h2>
        {learnedWords.length === 0 ? (
          <p>No words marked as learned yet.</p>
        ) : (
          <div style={styles.wordGrid}>
            {learnedWords.map((w) => (
              <button
                key={w.id}
                style={{
                  ...styles.wordCard,
                  borderColor: CATEGORY_COLORS[categoryOf(w.title)],
                  background: transparent(
                    CATEGORY_COLORS[categoryOf(w.title)],
                    0.3
                  ),
                }}
                onClick={() => {
                  setSelectedWord(w);
                  setStep("video");
                }}
              >
                {w.title.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        <div style={styles.backContainer}>
          <button style={styles.backBtn} onClick={() => setStep("category")}>
            ⬅ Back to Categories
          </button>
          {/* ✅ NEW CLEAR BUTTON HERE */}
          {learnedWords.length > 0 && (
            <button style={styles.clearBtn} onClick={clearAllLearned}>
              🧹 Clear All Learned Words
            </button>
          )}
        </div>
      </div>
    );
  }

  // Step 4 — Video view
  if (step === "video" && selectedWord) {
    const cat = categoryOf(selectedWord.title);
    const color = CATEGORY_COLORS[cat] || "#999";
    const isLearned = learned.has(selectedWord.title);
    return (
      <div style={styles.page}>
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
            background: isLearned ? transparent(color, 0.5) : "#E5E7EB",
            color: "#111",
            border: `2px solid ${color}`,
          }}
          onClick={() =>
            setLearned((prev) => {
              const next = new Set(prev);
              if (next.has(selectedWord.title)) next.delete(selectedWord.title);
              else next.add(selectedWord.title);
              return next;
            })
          }
        >
          {isLearned ? "Learned " : "Mark as Learned"}
        </button>

        <div style={styles.backContainer}>
          <button
            style={{
              ...styles.backBtn,
              border: `2px solid ${color}`,
              color: color,
            }}
            onClick={() => setStep("words")}
          >
            ⬅ Back to Words
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* --- Styles --- */
const styles = {
  page: {
    background: "#F9FAFB",
    minHeight: "100vh",
    padding: "1.2rem",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  header: { fontSize: 20, marginBottom: "1rem", color: "#111827" },
  categoryScroll: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    paddingBottom: "1rem",
  },
  categoryCard: {
    width: "80%",
    background: "#fff",
    border: "2px solid #E5E7EB",
    borderRadius: "12px",
    padding: "0.8rem 1.2rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  wordGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
    gap: "10px",
  },
  wordCard: {
    border: "2px solid #D1D5DB",
    borderRadius: "10px",
    padding: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "capitalize",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    transition: "0.2s all ease",
  },
  backContainer: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  backBtn: {
    background: "white",
    borderRadius: "10px",
    padding: "0.8rem 1.2rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.2s ease",
  },
  clearBtn: {
    background: "#FFF",
    border: "2px solid #FCA5A5",
    borderRadius: "10px",
    padding: "0.8rem 1.2rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
    transition: "0.2s all ease",
  },
  learnedBtn: {
    background: "#D1FAE5",
    color: "#065F46",
    border: "2px solid #6EE7B7",
    borderRadius: "10px",
    padding: "0.8rem 1.2rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    transition: "0.2s all ease",
  },
  video: {
    maxWidth: "100%",
    borderRadius: "12px",
    marginBottom: "1rem",
  },
  learnBtn: {
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