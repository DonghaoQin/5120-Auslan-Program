// ✅ WordQuiz.jsx (with category selection that resets to intro mode + Enhanced Animations)

import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_COLORS = {
  "1A. Essential Survival Signs": { bar: "#66D6BC" },
  "1B. Greetings & Social Basics": { bar: "#F7A940" },
  "2A. Family Members": { bar: "#9895FF" },
  "2B. Feelings/Needs": { bar: "#3B82F6" },
  "3A. School/Play": { bar: "#EF4444" },
  "3B. Everyday/Actions": { bar: "#8B5CF6" },
  "4A. Basic Questions": { bar: "#10B981" },
  "4B. Interaction Clarification": { bar: "#F59E0B" },
  Other: { bar: "#6B7280" },
};
const CATEGORIES = [
  "All Terms",
  "1A. Essential Survival Signs",
  "1B. Greetings & Social Basics",
  "2A. Family Members",
  "2B. Feelings/Needs",
  "3A. School/Play",
  "3B. Everyday/Actions",
  "4A. Basic Questions",
  "4B. Interaction Clarification",
  "Other",
];

const slug = (s) => (s || "").toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
const CATEGORY_MAP = (() => {
  const map = {};
  const add = (arr, name) => arr.forEach((x) => (map[x] = name));
  add(["thank_you", "no", "stop", "help", "seat", "drink", "sleeping", "go_to", "now", "not"], "1A. Essential Survival Signs");
  add(["hello", "bye_bye", "apology", "ask", "welcome", "hi"], "1B. Greetings & Social Basics");
  add(["mum", "brother", "sister", "baby", "you", "we", "yourself", "people", "our"], "2A. Family Members");
  add(["sad", "tired", "love", "smile", "upset", "cute", "like", "bad", "pizza", "dislike", "surprised", "dont_know", "disappointment", "thinking_reflection", "annoying"], "2B. Feelings/Needs");
  add(["play", "school", "teacher", "friend", "home", "already", "finished", "big", "fun", "copy", "jump_off"], "3A. School/Play");
  add(["wash_face", "share", "wait", "come_here", "move", "climb", "wear", "spoon", "look", "bath", "back_of_body", "hairbrush"], "3B. Everyday/Actions");
  add(["what", "why", "who", "how_old"], "4A. Basic Questions");
  add(["again", "slow_down", "understand", "nothing"], "4B. Interaction Clarification");
  add(["auslan", "deaf_mute", "australia", "sign_name", "dog", "apple", "world"], "Other");
  return map;
})();
const categoryOf = (title) => CATEGORY_MAP[slug(title)] ?? "Other";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const choiceN = (arr, n) => shuffle(arr).slice(0, n);

export default function WordQuiz({ totalQuestions = 10 }) {
  const API_URL = import.meta.env.VITE_VIDEOS_API_URL || "https://auslan-backend.onrender.com/videos/";

  const [mode, setMode] = useState("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataset, setDataset] = useState([]);
  const [group, setGroup] = useState("All Terms");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [startTs, setStartTs] = useState(null);
  const liveRef = useRef(null);

  // ✅ Load data with retry option
  const loadData = async (force = false) => {
    setLoading(true);
    setError("");
    try {
      if (!force) {
        const cached = sessionStorage.getItem("WORDS_API_CACHE_V1");
        if (cached) {
          setDataset(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }
      const res = await fetch(`${API_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : [])
        .map((x, idx) => {
          const title =
            x.filename || x.title || x.name || x.word || x.text || `Item ${idx + 1}`;
          const url = typeof x.url === "string" ? x.url : null;
          return { id: x.id || `${title}-${idx}`, title, url, group: categoryOf(title) };
        })
        .filter((x) => !!x.url);
      setDataset(normalized);
      sessionStorage.setItem("WORDS_API_CACHE_V1", JSON.stringify(normalized));
      if (normalized.length === 0) setError("API returned no valid videos.");
    } catch (e) {
      setError(`Failed to load: ${e.message}`);
      sessionStorage.removeItem("WORDS_API_CACHE_V1");
      setDataset([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const pool = useMemo(
    () => (group === "All Terms" ? dataset : dataset.filter((d) => d.group === group)),
    [dataset, group]
  );
  const availableCount = pool.length;

  // ✅ Enhanced category selection handler - always goes back to intro
  const handleCategorySelect = (category) => {
    console.log(`📌 Category selected: ${category}`);
    setGroup(category);
    
    // Always reset to intro mode when changing category
    if (mode !== "intro") {
      setMode("intro");
      // Reset quiz state
      setQuestions([]);
      setIndex(0);
      setSelected(null);
      setScore(0);
      setFeedback(null);
      setStartTs(null);
    }
  };

  const generateQuestions = () => {
    const usable = Math.min(availableCount, totalQuestions);
    if (!usable) {
      alert("No available terms.");
      return;
    }
    const qs = choiceN(pool, usable).map((answer) => {
      const distractors = choiceN(dataset.filter((x) => x !== answer), 3);
      const options = shuffle([answer.title, ...distractors.map((d) => d.title)]);
      return { qid: answer.id, answer: answer.title, url: answer.url, options };
    });
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFeedback(null);
    setStartTs(Date.now());
    setMode("playing");
  };

  const handleChoose = (opt) => {
    if (!questions[index] || selected != null) return;
    const cur = questions[index];
    const isCorrect = opt === cur.answer;
    setSelected(opt);
    setScore((s) => s + (isCorrect ? 1 : 0));
    setFeedback(isCorrect ? "✅ Correct!" : `❌ Oops! The right answer is "${cur.answer}"`);
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setFeedback(null);
    } else setMode("summary");
  };

  // ✅ Back to intro handler with state reset
  const handleBackToIntro = () => {
    console.log("🔄 Returning to intro mode");
    setMode("intro");
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFeedback(null);
    setStartTs(null);
  };

  const elapsed = startTs ? Math.round((Date.now() - startTs) / 1000) : 0;
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // Enhanced styles with animations
  const wrap = { 
    maxWidth: 960, 
    margin: "100px auto", 
    padding: "28px 16px 60px", 
    fontFamily: "Inter, system-ui, sans-serif", 
    color: "#222" 
  };
  
  const card = { 
    background: "#fff", 
    borderRadius: 20, 
    boxShadow: "0 15px 35px rgba(0,0,0,.08)", 
    padding: 30,
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  };
  
  const title = { 
    fontSize: 32, 
    fontWeight: 800, 
    margin: "4px 0 12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  return (
    <div style={wrap}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        @keyframes categorySelect {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        .bounce-animation {
          animation: bounce 1s;
        }

        .shake-animation {
          animation: shake 0.5s;
        }

        .category-select-animation {
          animation: categorySelect 0.4s ease;
        }

        .quiz-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
          position: relative;
          overflow: hidden;
        }

        .quiz-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .quiz-button:hover::before {
          left: 100%;
        }

        .quiz-button:hover {
          transform: translateY(-2px);
        }

        .quiz-button:active {
          transform: translateY(0);
        }

        .option-button {
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .option-button:hover {
          transform: translateX(5px);
        }

        .correct-answer {
          animation: bounce 0.6s ease;
          background: linear-gradient(135deg, #10B981, #047857) !important;
          color: white !important;
        }

        .wrong-answer {
          animation: shake 0.5s ease;
          background: linear-gradient(135deg, #EF4444, #DC2626) !important;
          color: white !important;
        }

        .category-pill {
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-pill::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        .category-pill:hover::after {
          width: 300px;
          height: 300px;
        }

        .category-pill.selected {
          animation: categorySelect 0.4s ease;
        }
      `}</style>

      <header style={{ marginBottom: 24 }} className="fade-in-up">
        <h1 style={title}>Words Quiz 🎬</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#64748b" }}>
          Select a <strong>category</strong> (or <strong>All Terms</strong>) and start the quiz. Each question shows a video from the Auslan API.
        </p>
      </header>

      {/* ✅ Enhanced category selection with intro reset */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }} className="fade-in-up">
        {CATEGORIES.map((c, idx) => {
          const colorMap = {
            "1A. Essential Survival Signs": "#10B981",
            "1B. Greetings & Social Basics": "#F59E0B",
            "2A. Family Members": "#3B82F6",
            "2B. Feelings/Needs": "#8B5CF6",
            "3A. School/Play": "#EF4444",
            "3B. Everyday/Actions": "#A855F7",
            "4A. Basic Questions": "#22C55E",
            "4B. Interaction Clarification": "#FBBF24",
            Other: "#6B7280",
            "All Terms": "#667eea",
          };
          const color = colorMap[c] || "#999";
          const active = group === c;

          return (
            <button
              key={c}
              type="button"
              onClick={() => handleCategorySelect(c)}
              className={`category-pill ${active ? 'selected' : ''}`}
              style={{
                border: `2px solid ${color}`,
                background: active 
                  ? `linear-gradient(135deg, ${color}, ${color}dd)` 
                  : "rgba(255,255,255,0.8)",
                color: active ? "#fff" : color,
                borderRadius: 25,
                padding: "10px 18px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: active
                  ? `0 6px 20px ${color}44`
                  : "0 3px 10px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: 1,
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {c.replace(/^\d[AB]\.\s*/, "")}
            </button>
          );
        })}
      </div>

      {/* ✅ Show category change feedback */}
      {mode === "intro" && (
        <div style={{
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          padding: "12px 16px",
          borderRadius: 12,
          marginBottom: 20,
          border: "1px solid #93c5fd",
          textAlign: "center"
        }} className="fade-in-up">
          <span style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 14 }}>
            📊 Selected Category: <strong>{group}</strong>
            {availableCount > 0 && (
              <span style={{ color: "#059669", marginLeft: 8 }}>
                ({availableCount} terms available)
              </span>
            )}
          </span>
        </div>
      )}

      {mode === "intro" && (
        <section style={card} className="fade-in-up">
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            marginBottom: 16,
            color: "#1e293b"
          }}>Before You Start 🚀</h2>
          <ul style={{ 
            margin: "12px 0 20px", 
            paddingLeft: 20, 
            color: "#475569", 
            lineHeight: 1.8,
            fontSize: 15 
          }}>
            <li>Questions are randomly selected from the chosen group.</li>
            <li>Each question has 4 options with instant feedback.</li>
            <li>Summary shows score, accuracy, time, and wrong answers.</li>
          </ul>
          <div style={{ 
            color: "#64748b", 
            marginBottom: 20,
            padding: "12px 16px",
            background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
            borderRadius: 12,
            border: "1px solid #e2e8f0"
          }}>
            Available in <strong style={{ color: "#1e293b" }}>{group}</strong>: 
            <strong style={{ color: "#059669" }}> {availableCount}</strong> terms
            {loading && <span style={{ color: "#f59e0b" }}> — Loading...</span>}
            {error && <span style={{ color: "#dc2626" }}> — {error}</span>}
          </div>
          
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={generateQuestions}
              disabled={availableCount === 0 || loading}
              className="quiz-button"
              style={{
                background: availableCount > 0 && !loading
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #94a3b8, #64748b)",
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 16,
                cursor: availableCount > 0 && !loading ? "pointer" : "not-allowed",
                boxShadow: availableCount > 0 && !loading
                  ? "0 8px 25px rgba(102, 126, 234, 0.4)"
                  : "0 4px 15px rgba(148, 163, 184, 0.3)",
                opacity: availableCount > 0 && !loading ? 1 : 0.7,
              }}
            >
              {loading ? "Loading..." : "Start Quiz 🚀"}
            </button>

            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("WORDS_API_CACHE_V1");
                loadData(true);
              }}
              className="quiz-button"
              style={{
                padding: "14px 28px",
                borderRadius: 16,
                border: "2px solid #667eea",
                color: "#667eea",
                background: "rgba(255,255,255,0.9)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.2)",
              }}
            >
              Reload Videos ↻
            </button>
          </div>
          
          {availableCount === 0 && !loading && (
            <div style={{ 
              color: "#dc2626", 
              marginTop: 16,
              padding: "12px 16px",
              background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              borderRadius: 12,
              border: "1px solid #fecaca",
              fontSize: 14
            }} className="shake-animation">
              ⚠️ <strong>Tip:</strong> If this keeps showing 0, try <strong>Reload Videos</strong>. 
              If still empty, the API might not return video URLs.
            </div>
          )}
        </section>
      )}

      {mode === "playing" && questions[index] && (
        <section style={card} className="fade-in-up">
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 24 
          }}>
            <h3 style={{ 
              fontSize: 22, 
              fontWeight: 700,
              color: "#1e293b",
              margin: 0 
            }}>
              Question {index + 1} of {questions.length}
            </h3>
            <div style={{
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              color: "#0284c7",
              border: "1px solid #7dd3fc"
            }}>
              Score: {score}/{index + (selected ? 1 : 0)}
            </div>
          </div>
          
          <div style={{
            position: "relative",
            width: "100%",
            background: "linear-gradient(135deg, #1e293b, #334155)",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 24,
            aspectRatio: "16 / 9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <video
              key={questions[index].url}
              src={questions[index].url}
              controls
              preload="metadata"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 12
              }}
              onError={(e) => {
                e.currentTarget.poster = "/assets/placeholder.png";
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {questions[index].options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrect = opt === questions[index].answer;
              const isWrong = isSelected && !isCorrect;
              
              return (
                <button 
                  key={i} 
                  className={`option-button ${isSelected && isCorrect ? 'correct-answer' : ''} ${isWrong ? 'wrong-answer' : ''}`}
                  disabled={!!selected} 
                  onClick={() => handleChoose(opt)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: isSelected 
                      ? "2px solid transparent"
                      : "2px solid #e2e8f0",
                    background: isSelected && isCorrect
                      ? "linear-gradient(135deg, #10B981, #047857)"
                      : isWrong
                      ? "linear-gradient(135deg, #EF4444, #DC2626)"
                      : "linear-gradient(135deg, #ffffff, #f8fafc)",
                    color: isSelected ? "#fff" : "#374151",
                    cursor: selected ? "default" : "pointer",
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: "left",
                    boxShadow: isSelected 
                      ? "0 8px 20px rgba(0,0,0,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    opacity: selected && !isSelected ? 0.6 : 1,
                  }}
                >
                  <span style={{ marginRight: 12, opacity: 0.7 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div style={{ 
              padding: "16px 20px",
              borderRadius: 12,
              marginBottom: 20,
              background: feedback.includes("✅") 
                ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
                : "linear-gradient(135deg, #fef2f2, #fee2e2)",
              border: feedback.includes("✅") 
                ? "1px solid #a7f3d0"
                : "1px solid #fca5a5",
              color: feedback.includes("✅") ? "#065f46" : "#991b1b",
              fontWeight: 600,
              fontSize: 16
            }} className="bounce-animation">
              {feedback}
            </div>
          )}
          
          {selected && (
            <button 
              className="quiz-button bounce-animation"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
              }} 
              onClick={handleNext}
            >
              {index === questions.length - 1 ? "Finish Quiz 🎉" : "Next Question ▶"}
            </button>
          )}
        </section>
      )}

      {mode === "summary" && (
        <section style={card} className="fade-in-up">
          <h2 style={{ 
            fontSize: 28, 
            fontWeight: 800,
            marginBottom: 20,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Quiz Complete! 🎯</h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24 
          }}>
            <div style={{
              background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              padding: "16px 20px",
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #a7f3d0"
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#065f46" }}>{score}</div>
              <div style={{ color: "#059669", fontSize: 14, fontWeight: 600 }}>Correct</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              padding: "16px 20px",
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #93c5fd"
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1d4ed8" }}>{accuracy}%</div>
              <div style={{ color: "#2563eb", fontSize: 14, fontWeight: 600 }}>Accuracy</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #fefce8, #fef3c7)",
              padding: "16px 20px",
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #fde68a"
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#92400e" }}>{elapsed}s</div>
              <div style={{ color: "#d97706", fontSize: 14, fontWeight: 600 }}>Time</div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button 
              className="quiz-button pulse-animation"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              }}
              onClick={generateQuestions}
            >
              Try Again ♻
            </button>
            <button 
              className="quiz-button"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                border: "2px solid #667eea",
                color: "#667eea",
                background: "rgba(255,255,255,0.9)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.2)",
              }}
              onClick={handleBackToIntro}
            >
              Back to Settings ⚙️
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
