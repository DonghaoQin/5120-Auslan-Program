import { useState, useEffect } from "react";

const API_URL = "https://auslan-backend.onrender.com/videos/";
const STORAGE_KEY = "FLASHCARD_LEARNED_V1";

export default function FlashCardMobile() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [learned, setLearned] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((x, i) => ({
          id: x.id ?? i,
          title: x.filename ?? x.title ?? `Item ${i + 1}`,
          url: x.url ?? "",
        }));
        setWords(normalized);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learned]));
  }, [learned]);

  const current = words[index] || null;
  const total = words.length;

  const handleNext = () => setIndex((i) => (i + 1) % total);
  const handlePrev = () => setIndex((i) => (i - 1 + total) % total);
  const toggleLearned = () => {
    if (!current) return;
    setLearned((prev) => {
      const next = new Set(prev);
      if (next.has(current.title)) next.delete(current.title);
      else next.add(current.title);
      return next;
    });
  };

  if (!current) {
    return (
      <div style={styles.center}>
        <h3>Loading videos...</h3>
      </div>
    );
  }

  const learnedCount = learned.size;
  const progress = total ? Math.round((learnedCount / total) * 100) : 0;
  const isLearned = learned.has(current.title);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>{current.title}</h2>
        <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
          {index + 1} / {total} | Learned: {learnedCount} ({progress}%)
        </p>
      </div>

      <div style={styles.videoContainer}>
        {current.url ? (
          <video
            key={current.url}
            src={current.url}
            controls
            playsInline
            style={styles.video}
          />
        ) : (
          <p>No video available</p>
        )}
      </div>

      <div style={styles.controls}>
        <button style={styles.navBtn} onClick={handlePrev}>
          ⬅ Prev
        </button>
        <button
          style={{
            ...styles.learnBtn,
            backgroundColor: isLearned ? "#10B981" : "#F59E0B",
          }}
          onClick={toggleLearned}
        >
          {isLearned ? "Learned ✅" : "Mark Learned"}
        </button>
        <button style={styles.navBtn} onClick={handleNext}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

/* --- Inline mobile-first styles --- */
const styles = {
  page: {
    background: "#F6F7FB",
    minHeight: "100vh",
    padding: "1rem",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  center: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    color: "#666",
  },
  header: {
    marginBottom: "1rem",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
    marginBottom: "1rem",
  },
  video: {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: "12px",
  },
  controls: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: "0.5rem",
  },
  navBtn: {
    padding: "0.8rem 1.2rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#3B82F6",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  learnBtn: {
    padding: "0.8rem 1.2rem",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    flex: 2,
  },
};