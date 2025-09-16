// src/pages/MiniQuiz.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { letters, numbers } from "../data/letters.js";

const STORAGE_KEY = "LN_LEARNED_V2";
const imgSrc = (ch) => `/assets/signs/${ch}.PNG`;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const choiceN = (arr, n) => shuffle(arr).slice(0, n);
const categoryOf = (ch) => (/[A-Z]/.test(ch) ? "letter" : "number");

export default function MiniQuiz({ totalQuestions = 10 }) {
  // pool & learned state
  const allItems = useMemo(() => [...letters, ...numbers], []);
  const learnedSet = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }, []);

  // ui state
  const [mode, setMode] = useState("intro");   // intro | playing | summary
  const [onlyLearned, setOnlyLearned] = useState(false);
  const [questions, setQuestions] = useState([]); // [{qid, answer, options}]
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [startTs, setStartTs] = useState(null);
  const liveRef = useRef(null);

  // derived: current available count for the chosen pool
  const availableCount = useMemo(() => {
    return onlyLearned ? allItems.filter(x => learnedSet.has(x)).length : allItems.length;
  }, [onlyLearned, allItems, learnedSet]);

  // build questions = min(available, totalQuestions) BUT without selector:
  const generateQuestions = () => {
    const source = onlyLearned ? allItems.filter(x => learnedSet.has(x)) : allItems;
    const usable = Math.min(source.length, totalQuestions, availableCount);

    if (usable < 1) {
      alert(
        onlyLearned
          ? "No learned items found. Please study first!"
          : "Quiz pool is empty."
      );
      return;
    }

    const qs = choiceN(source, usable).map((answer) => {
      const cat = categoryOf(answer);
      const sameCat = source.filter(x => x !== answer && categoryOf(x) === cat);
      const pool = sameCat.length >= 3 ? sameCat : source.filter(x => x !== answer);
      const options = shuffle([answer, ...choiceN(pool, 3)]);
      return { qid: answer, answer, options };
    });

    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setFeedback(null);
    setStartTs(Date.now());
    setMode("playing");
  };

  // a11y live text
  useEffect(() => { if (feedback && liveRef.current) liveRef.current.textContent = feedback; }, [feedback]);

  // keyboard 1–4
  useEffect(() => {
    const onKey = (e) => {
      if (mode !== "playing" || !questions[index] || selected != null) return;
      const map = { "1": 0, "2": 1, "3": 2, "4": 3 };
      if (map[e.key] != null) handleChoose(questions[index].options[map[e.key]]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, questions, index, selected]);

  const handleChoose = (opt) => {
    if (!questions[index] || selected != null) return;
    const cur = questions[index];
    const isCorrect = opt === cur.answer;
    setSelected(opt);
    setScore(s => s + (isCorrect ? 1 : 0));
    setAnswers(prev => [...prev, { qid: cur.qid, chosen: opt, answer: cur.answer, correct: isCorrect }]);
    setFeedback(isCorrect ? "✅ Correct!" : `❌ Oops! The right answer is "${cur.answer}"`);
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex(i => i + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      setMode("summary");
    }
  };

  const handleRestart = () => {
    setMode("intro");
    setSelected(null);
    setFeedback(null);
  };

  // stats
  const elapsed = startTs ? Math.round((Date.now() - startTs) / 1000) : 0;
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const wrongList = answers.filter(a => !a.correct);

  // styles
  const wrap = { maxWidth: 960, margin: "100px auto", padding: "28px 16px 60px", fontFamily: "Inter, system-ui, sans-serif", color: "#222" };
  const card = { background: "#fff", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.08)", padding: 20 };
  const title = { fontSize: 28, fontWeight: 800, margin: "4px 0 6px" };
  const sub = { color: "#555", lineHeight: 1.6, marginTop: 8 };
  const btn = (filled = true) => ({
    padding: "10px 16px", borderRadius: 10, border: "1px solid #222",
    background: filled ? "#222" : "#fff", color: filled ? "#fff" : "#222", cursor: "pointer", fontWeight: 600,
  });
  const tabBtn = (active) => ({
    padding: "8px 12px", borderRadius: 10, border: "1px solid #ccc",
    background: active ? "#111" : "#f6f7f8", color: active ? "#fff" : "#222", cursor: "pointer", fontWeight: 600,
  });
  const optionBtn = (isChosen, isCorrect, locked) => ({
    display: "block", width: "100%", textAlign: "left",
    padding: "12px 14px", borderRadius: 12,
    border: `2px solid ${locked ? (isCorrect ? "#22c55e" : isChosen ? "#ef4444" : "#e5e7eb") : "#e5e7eb"}`,
    background: locked ? (isCorrect ? "#ecfdf5" : isChosen ? "#fef2f2" : "#fff") : "#fff",
    cursor: locked ? "default" : "pointer", fontWeight: 600,
  });

  const progressOuter = { width: "100%", height: 10, background: "#f0f2f5", borderRadius: 6, overflow: "hidden" };
  const progressInner = {
    width: `${questions.length ? ((index + (selected ? 1 : 0)) / questions.length) * 100 : 0}%`,
    height: "100%", background: "linear-gradient(90deg,#34d399,#10b981)", transition: "width .25s ease",
  };

  return (
    <div style={wrap}>
      {/* Header */}
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <h1 style={title}>Mini Quiz</h1>
        </div>
        <p style={sub}>
          Pick <strong>All Items</strong> or <strong>Learned Only</strong>. The quiz will automatically include all available items in the chosen pool.
        </p>
      </header>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button type="button" style={tabBtn(!onlyLearned)} onClick={() => setOnlyLearned(false)}>📚 All Items</button>
        <button type="button" style={tabBtn(!!onlyLearned)} onClick={() => setOnlyLearned(true)}>✅ Learned Only</button>
      </div>

      {/* Intro */}
      {mode === "intro" && (
        <section style={card}>
          <h2 style={{ ...title, fontSize: 22 }}>Before You Start</h2>
          <ul style={{ margin: "8px 0 16px", paddingLeft: 18, color: "#444", lineHeight: 1.8 }}>
            <li>Questions are randomly selected from the chosen pool.</li>
            <li>Each question has 4 options with instant feedback.</li>
            <li>Summary shows score, accuracy, time, and wrong answers.</li>
          </ul>

          {/* No quantity selector; just show Available */}
          <div style={{ color: "#666", marginBottom: 12 }}>
            Available: <strong>{availableCount}</strong>
            {availableCount === 0 && " — please learn some items first."}
          </div>

          <button type="button" style={btn(true)} onClick={generateQuestions} disabled={availableCount === 0}>
            Start Quiz 🚀
          </button>
        </section>
      )}

      {/* Playing */}
      {mode === "playing" && questions[index] && (
        <section style={{ ...card, overflow: "hidden" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={progressOuter}><div style={progressInner} /></div>
            <div style={{ marginTop: 8, color: "#555", display: "flex", justifyContent: "space-between" }}>
              <span>Question <strong>{index + 1}</strong> / {questions.length}</span>
              <span>Score: <strong>{score}</strong></span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "center" }}>
            <div>
              <div style={{ border: "1px solid #eee", borderRadius: 16, overflow: "hidden", background: "#f7f8fa" }}>
                <img
                  src={imgSrc(questions[index].answer)}
                  alt={`Identify: ${questions[index].answer}`}
                  style={{ width: "100%", display: "block", objectFit: "contain", maxHeight: 260 }}
                  onError={(ev) => { ev.currentTarget.src = "/assets/placeholder.png"; }}
                />
              </div>
              <p style={{ color: "#666", marginTop: 8 }}>What is this?</p>
            </div>

            <div>
              <div style={{ display: "grid", gap: 10 }}>
                {questions[index].options.map((opt, i) => {
                  const locked = selected != null;
                  const isChosen = selected === opt;
                  const isCorrect = opt === questions[index].answer;
                  return (
                    <button
                      key={opt}
                      type="button"
                      style={optionBtn(isChosen, isCorrect, locked)}
                      disabled={locked}
                      onClick={() => handleChoose(opt)}
                    >
                      <span style={{ opacity: 0.7, marginRight: 8 }}>{i + 1}.</span>
                      {opt}
                      {locked && isCorrect && <span style={{ marginLeft: 8 }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  type="button"
                  style={{ ...btn(true), opacity: selected == null ? 0.6 : 1 }}
                  disabled={selected == null}
                  onClick={handleNext}
                >
                  {index === questions.length - 1 ? "Finish Quiz 🎉" : "Next ▶"}
                </button>
                <span aria-live="polite" ref={liveRef} style={{ color: "#444" }}>
                  {feedback ? feedback : "Please select an option"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      {mode === "summary" && (
        <section style={card}>
          <h2 style={{ ...title, fontSize: 22 }}>Quiz Summary 🎯</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "10px 0 14px" }}>
            <Stat label="Total" value={questions.length} />
            <Stat label="Correct" value={score} />
            <Stat label="Accuracy" value={`${accuracy}%`} />
          </div>
          <p style={{ color: "#666", marginTop: -4 }}>Time: {elapsed} sec</p>

          {wrongList.length === 0 ? (
            <div style={{ marginTop: 16, padding: 16, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, color: "#065f46" }}>
              Perfect Score! 🎉
            </div>
          ) : (
            <>
              <h3 style={{ marginTop: 18, marginBottom: 8 }}>Review Wrong Answers</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444", lineHeight: 1.8 }}>
                {wrongList.map((w, idx) => (
                  <li key={idx}>You chose <strong>{w.chosen}</strong>, correct is <strong>{w.answer}</strong></li>
                ))}
              </ul>
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" style={btn(true)} onClick={generateQuestions}>Try Again ♻</button>
            <button type="button" style={btn(false)} onClick={handleRestart}>Back to Settings</button>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "12px 12px", background: "#fafafa" }}>
      <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 22 }}>{value}</div>
    </div>
  );
}
