import { useEffect, useMemo, useRef, useState } from "react";
import { letters, numbers } from "../data/letters.js";

const STORAGE_KEY = "LN_LEARNED_V2";
const imgSrc = (ch) => `/assets/signs/${ch}.PNG`;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const choiceN = (arr, n) => shuffle(arr).slice(0, n);
const categoryOf = (ch) => (/[A-Z]/.test(ch) ? "letter" : "number");

export default function LNQuiz({ totalQuestions = 10 }) {
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

  const [mode, setMode] = useState("intro");
  const [onlyLearned, setOnlyLearned] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [startTs, setStartTs] = useState(null);
  const liveRef = useRef(null);

  const availableCount = useMemo(() => {
    return onlyLearned ? allItems.filter((x) => learnedSet.has(x)).length : allItems.length;
  }, [onlyLearned, allItems, learnedSet]);

  const generateQuestions = () => {
    const source = onlyLearned ? allItems.filter((x) => learnedSet.has(x)) : allItems;
    const usable = Math.min(source.length, totalQuestions, availableCount);
    if (usable < 1) {
      alert(onlyLearned ? "No learned items found. Please study first!" : "Quiz pool is empty.");
      return;
    }

    const qs = choiceN(source, usable).map((answer) => {
      const cat = categoryOf(answer);
      const sameCat = source.filter((x) => x !== answer && categoryOf(x) === cat);
      const pool = sameCat.length >= 3 ? sameCat : source.filter((x) => x !== answer);
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

  const handleChoose = (opt) => {
    if (!questions[index] || selected != null) return;
    const cur = questions[index];
    const isCorrect = opt === cur.answer;
    setSelected(opt);
    setScore((s) => s + (isCorrect ? 1 : 0));
    setAnswers((prev) => [
      ...prev,
      { qid: cur.qid, chosen: opt, answer: cur.answer, correct: isCorrect },
    ]);
    setFeedback(isCorrect ? "✅ Correct!" : `❌ Oops! The right answer is "${cur.answer}"`);
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
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

  const elapsed = startTs ? Math.round((Date.now() - startTs) / 1000) : 0;
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // === Colors & Styles ===
  const BLUE = "#3B82F6";
  const PURPLE = "#8B5CF6";
  const GREEN = "#10B981";
  const MINT = "#34D399";

  const pillStyle = (active, main, alt) => ({
    padding: "8px 14px",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .25s ease",
    border: active ? "none" : `2px solid ${main}`,
    background: active ? `linear-gradient(90deg, ${main}, ${alt})` : "#fff",
    color: active ? "#fff" : main,
    boxShadow: active ? `0 4px 12px ${main}44` : "0 2px 6px rgba(0,0,0,.05)",
  });

  const btnGradient = {
    background: `linear-gradient(90deg, ${BLUE}, ${PURPLE})`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59,130,246,.4)",
    transition: "all 0.25s ease",
  };

  const wrap = { maxWidth: 960, margin: "100px auto", padding: "28px 16px 60px", fontFamily: "Inter, system-ui, sans-serif", color: "#222" };
  const card = { background: "#fff", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.08)", padding: 20 };
  const title = { fontSize: 28, fontWeight: 800, margin: "4px 0 6px" };

  return (
    <div style={wrap}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={title}>Letters & Numbers Quiz 🔤</h1>
        <p>Choose quiz mode and start practicing signs for letters and numbers!</p>
      </header>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button
          type="button"
          style={pillStyle(!onlyLearned, BLUE, PURPLE)}
          onClick={() => setOnlyLearned(false)}
        >
          📚 All Items
        </button>
        <button
          type="button"
          style={pillStyle(!!onlyLearned, GREEN, MINT)}
          onClick={() => setOnlyLearned(true)}
        >
          ✅ Learned Only
        </button>
      </div>

      {/* Intro */}
      {mode === "intro" && (
        <section style={card}>
          <h2 style={{ fontSize: 22 }}>Before You Start</h2>
          <ul style={{ margin: "8px 0 16px", paddingLeft: 18, color: "#444", lineHeight: 1.8 }}>
            <li>Questions are randomly selected from the chosen pool.</li>
            <li>Each question has 4 options with instant feedback.</li>
            <li>Summary shows score, accuracy, time, and wrong answers.</li>
          </ul>

          <div style={{ color: "#666", marginBottom: 12 }}>
            Available: <strong>{availableCount}</strong>
          </div>

          <button
            type="button"
            onClick={generateQuestions}
            disabled={availableCount === 0}
            style={{
              ...btnGradient,
              opacity: availableCount === 0 ? 0.6 : 1,
              cursor: availableCount === 0 ? "not-allowed" : "pointer",
            }}
          >
            Start Quiz 🚀
          </button>
        </section>
      )}

      {/* Playing */}
      {mode === "playing" && questions[index] && (
        <section style={card}>
          <h2 style={{ fontSize: 22 }}>
            Question {index + 1} of {questions.length}
          </h2>
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <img
              src={imgSrc(questions[index].answer)}
              alt={questions[index].answer}
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {questions[index].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChoose(opt)}
                disabled={selected !== null}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontWeight: 600,
                  border:
                    selected === opt
                      ? opt === questions[index].answer
                        ? "2px solid #10B981"
                        : "2px solid #EF4444"
                      : "2px solid #ccc",
                  background:
                    selected === opt
                      ? opt === questions[index].answer
                        ? "#D1FAE5"
                        : "#FEE2E2"
                      : "#fff",
                  cursor: selected ? "default" : "pointer",
                  minWidth: 100,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <p
              style={{
                marginTop: 20,
                fontWeight: 600,
                color: feedback.includes("✅") ? "#10B981" : "#EF4444",
              }}
            >
              {feedback}
            </p>
          )}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            {selected && (
              <button
                onClick={handleNext}
                style={{
                  ...btnGradient,
                  padding: "8px 14px",
                }}
              >
                {index === questions.length - 1 ? "Finish Quiz" : "Next →"}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Summary */}
      {mode === "summary" && (
        <section style={card}>
          <h2>Quiz Summary 🏁</h2>
          <p>
            You scored <strong>{score}</strong> / {questions.length} ({accuracy}%)
          </p>
          <p>Total Time: {elapsed}s</p>

          {answers.some((a) => !a.correct) && (
            <>
              <h3>Incorrect Answers:</h3>
              <ul>
                {answers
                  .filter((a) => !a.correct)
                  .map((a, i) => (
                    <li key={i}>
                      ❌ {a.qid} → You chose “{a.chosen}”, correct: “{a.answer}”
                    </li>
                  ))}
              </ul>
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={btnGradient} onClick={generateQuestions}>
              🔁 Try Again
            </button>
            <button
              onClick={handleRestart}
              style={{
                background: `linear-gradient(90deg, ${GREEN}, ${MINT})`,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
                transition: "all 0.25s ease",
              }}
            >
              ← Back to Hub
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
