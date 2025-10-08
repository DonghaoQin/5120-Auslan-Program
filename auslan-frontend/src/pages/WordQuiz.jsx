// ✅ WordQuiz.jsx (with Reload + clear cache + better API handling)
// This fixes the 'Start Quiz not clickable' problem by showing reload options and ensuring dataset loads correctly.

import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_COLORS = {
  "1A. Essentials_Survival Signs": { bar: "#66D6BC" },
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
  "1A. Essentials_Survival Signs",
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
  add(["thank_you", "no", "stop", "help", "seat", "drink", "sleeping", "go_to", "now", "not"], "1A. Essentials_Survival Signs");
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
  const API_URL = "https://auslan-backend.onrender.com/videos/";

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

  const elapsed = startTs ? Math.round((Date.now() - startTs) / 1000) : 0;
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const wrap = { maxWidth: 960, margin: "100px auto", padding: "28px 16px 60px", fontFamily: "Inter, system-ui, sans-serif", color: "#222" };
  const card = { background: "#fff", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.08)", padding: 20 };
  const title = { fontSize: 28, fontWeight: 800, margin: "4px 0 6px" };
  const btn = (filled = true) => ({ padding: "10px 16px", borderRadius: 10, border: "1px solid #222", background: filled ? "#222" : "#fff", color: filled ? "#fff" : "#222", cursor: "pointer", fontWeight: 600 });

  return (
    <div style={wrap}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={title}>Words Quiz 🎬</h1>
        <p>Select a <strong>category</strong> (or <strong>All Terms</strong>) and start the quiz. Each question shows a video from the Auslan API.</p>
      </header>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {CATEGORIES.map((c) => {
            const colorMap = {
            "1A. Essentials_Survival Signs": "#10B981",
            "1B. Greetings & Social Basics": "#F59E0B",
            "2A. Family Members": "#3B82F6",
            "2B. Feelings/Needs": "#8B5CF6",
            "3A. School/Play": "#EF4444",
            "3B. Everyday/Actions": "#A855F7",
            "4A. Basic Questions": "#22C55E",
            "4B. Interaction Clarification": "#FBBF24",
            Other: "#6B7280",
            "All Terms": "#3B82F6",

            
            };
            const color = colorMap[c] || "#999";
            const active = group === c;

            return (
            <button
                key={c}
                type="button"
                onClick={() => setGroup(c)}
                style={{
                border: `2px solid ${color}`,
                background: active ? color : "#fff",
                color: active ? "#fff" : color,
                borderRadius: 10,
                padding: "8px 14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: active
                    ? `0 4px 12px ${color}44`
                    : "0 2px 6px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.background = color;
                e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = color;
                }
                }}
            >
                {c}
            </button>
            );
        })}
        </div>


      {mode === "intro" && (
        <section style={card}>
          <h2 style={{ fontSize: 22 }}>Before You Start</h2>
          <ul style={{ margin: "8px 0 16px", paddingLeft: 18, color: "#444", lineHeight: 1.8 }}>
            <li>Questions are randomly selected from the chosen group.</li>
            <li>Each question has 4 options with instant feedback.</li>
            <li>Summary shows score, accuracy, time, and wrong answers.</li>
          </ul>
          <div style={{ color: "#666", marginBottom: 12 }}>
            Available in <strong>{group}</strong>: <strong>{availableCount}</strong> {loading && "— Loading..."} {error && `— ${error}`}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
                type="button"
                onClick={generateQuestions}
                disabled={availableCount === 0 || loading}
                style={{
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                    transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(59,130,246,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)")}
                >
                Start Quiz 🚀
            </button>

            <button
                type="button"
                onClick={() => {
                    sessionStorage.removeItem("WORDS_API_CACHE_V1");
                    loadData(true);
                }}
                style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    border: "2px solid #3B82F6",
                    color: "#3B82F6",
                    background: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3B82F6";
                    e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#3B82F6";
                }}
                >
                Reload Videos ↻
            </button>


          </div>
          {availableCount === 0 && !loading && (
            <p style={{ color: "#a16207", marginTop: 10 }}>Tip: If this keeps showing 0, try <strong>Reload Videos</strong>. If still empty, the API might not return video URLs.</p>
          )}
        </section>
      )}

      {mode === "playing" && questions[index] && (
        <section style={card}>
          <h3>Question {index + 1}</h3>
          
          <div
            style={{
            position: "relative",
            width: "100%",
            background: "#000",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 10,
            aspectRatio: "4 / 3", // ✅ 统一比例，可改为16/9
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            }}
            >
            <video
            key={questions[index].url}
            src={questions[index].url}
            controls
            preload="metadata"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // ✅ 不裁切视频
            }}
            onError={(e) => {
                e.currentTarget.poster = "/assets/placeholder.png";
            }}
            />
          </div>


          {questions[index].options.map((opt, i) => (
            <button key={i} style={btn(selected === opt && opt === questions[index].answer)} disabled={!!selected} onClick={() => handleChoose(opt)}>
              {opt}
            </button>
          ))}
          {feedback && <p>{feedback}</p>}
          {selected && <button style={btn(true)} onClick={handleNext}>{index === questions.length - 1 ? "Finish Quiz 🎉" : "Next ▶"}</button>}
        </section>
      )}

      {mode === "summary" && (
        <section style={card}>
          <h2>Quiz Summary 🎯</h2>
          <p>Total: {questions.length} | Correct: {score} | Accuracy: {accuracy}% | Time: {elapsed}s</p>
          <button style={btn(true)} onClick={generateQuestions}>Try Again ♻</button>
          <button style={btn(false)} onClick={() => setMode("intro")}>Back to Settings</button>
        </section>
      )}
    </div>
  );
}
