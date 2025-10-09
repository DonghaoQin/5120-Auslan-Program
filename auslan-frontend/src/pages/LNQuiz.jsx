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

        @keyframes flipIn {
          from {
            transform: perspective(400px) rotateY(-90deg);
            opacity: 0;
          }
          to {
            transform: perspective(400px) rotateY(0deg);
            opacity: 1;
          }
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

        .flip-in {
          animation: flipIn 0.6s ease-out;
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
          transform: translateY(-2px);
        }

        .correct-answer {
          animation: bounce 0.6s ease;
          background: linear-gradient(135deg, #10B981, #047857) !important;
          color: white !important;
          border-color: transparent !important;
        }

        .wrong-answer {
          animation: shake 0.5s ease;
          background: linear-gradient(135deg, #EF4444, #DC2626) !important;
          color: white !important;
          border-color: transparent !important;
        }

        .mode-pill {
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mode-pill::after {
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

        .mode-pill:hover::after {
          width: 300px;
          height: 300px;
        }

        .sign-image {
          transition: all 0.3s ease;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .sign-image:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
      `}</style>

      <header style={{ marginBottom: 24 }} className="fade-in-up">
        <h1 style={title}>Letters & Numbers Quiz 🔤</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#64748b" }}>
          Choose quiz mode and start practicing signs for <strong>letters</strong> and <strong>numbers</strong>!
        </p>
      </header>

      {/* Mode toggle with enhanced styling */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }} className="fade-in-up">
        <button
          type="button"
          className="mode-pill"
          style={{
            padding: "12px 20px",
            borderRadius: 25,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .25s ease",
            border: !onlyLearned ? "none" : `2px solid ${BLUE}`,
            background: !onlyLearned 
              ? `linear-gradient(135deg, ${BLUE}, ${PURPLE})` 
              : "rgba(255,255,255,0.9)",
            color: !onlyLearned ? "#fff" : BLUE,
            boxShadow: !onlyLearned 
              ? `0 6px 20px ${BLUE}44` 
              : "0 3px 10px rgba(0,0,0,.1)",
            position: "relative",
            zIndex: 1,
          }}
          onClick={() => setOnlyLearned(false)}
        >
          📚 All Items ({allItems.length})
        </button>
        <button
          type="button"
          className="mode-pill"
          style={{
            padding: "12px 20px",
            borderRadius: 25,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .25s ease",
            border: !!onlyLearned ? "none" : `2px solid ${GREEN}`,
            background: !!onlyLearned 
              ? `linear-gradient(135deg, ${GREEN}, ${MINT})` 
              : "rgba(255,255,255,0.9)",
            color: !!onlyLearned ? "#fff" : GREEN,
            boxShadow: !!onlyLearned 
              ? `0 6px 20px ${GREEN}44` 
              : "0 3px 10px rgba(0,0,0,.1)",
            position: "relative",
            zIndex: 1,
          }}
          onClick={() => setOnlyLearned(true)}
        >
          ✅ Learned Only ({learnedSet.size})
        </button>
      </div>

      {/* Intro */}
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
            <li>Questions are randomly selected from the chosen pool.</li>
            <li>Each question shows a sign image with 4 letter/number options.</li>
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
            Available in <strong style={{ color: "#1e293b" }}>
              {onlyLearned ? "Learned Only" : "All Items"}
            </strong>: 
            <strong style={{ color: "#059669" }}> {availableCount}</strong> items
          </div>

          <button
            type="button"
            onClick={generateQuestions}
            disabled={availableCount === 0}
            className="quiz-button"
            style={{
              background: availableCount > 0
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #94a3b8, #64748b)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "14px 28px",
              fontWeight: 700,
              fontSize: 16,
              cursor: availableCount > 0 ? "pointer" : "not-allowed",
              boxShadow: availableCount > 0
                ? "0 8px 25px rgba(102, 126, 234, 0.4)"
                : "0 4px 15px rgba(148, 163, 184, 0.3)",
              opacity: availableCount > 0 ? 1 : 0.7,
            }}
          >
            {availableCount > 0 ? "Start Quiz 🚀" : "No Items Available"}
          </button>

          {availableCount === 0 && onlyLearned && (
            <div style={{ 
              color: "#dc2626", 
              marginTop: 16,
              padding: "12px 16px",
              background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              borderRadius: 12,
              border: "1px solid #fecaca",
              fontSize: 14
            }} className="shake-animation">
              📚 <strong>Tip:</strong> Please learn some letters/numbers first in the study mode!
            </div>
          )}
        </section>
      )}

      {/* Playing */}
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
            textAlign: "center",
            marginBottom: 24,
            padding: "20px",
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            borderRadius: 16,
            border: "1px solid #e2e8f0"
          }} className="flip-in">
            <p style={{ 
              marginBottom: 16, 
              fontSize: 18, 
              fontWeight: 600, 
              color: "#374151" 
            }}>
              What letter or number is this sign?
            </p>
            <img
              src={imgSrc(questions[index].answer)}
              alt={questions[index].answer}
              className="sign-image"
              style={{ 
                width: 200, 
                height: 200, 
                objectFit: "contain",
                background: "#fff",
                padding: "12px"
              }}
              onError={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.alt = "Sign image not available";
              }}
            />
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12, 
            marginBottom: 20 
          }}>
            {questions[index].options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrect = opt === questions[index].answer;
              const isWrong = isSelected && !isCorrect;
              
              return (
                <button
                  key={opt}
                  className={`option-button ${isSelected && isCorrect ? 'correct-answer' : ''} ${isWrong ? 'wrong-answer' : ''}`}
                  onClick={() => handleChoose(opt)}
                  disabled={selected !== null}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 18,
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
                    boxShadow: isSelected 
                      ? "0 8px 20px rgba(0,0,0,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    opacity: selected && !isSelected ? 0.6 : 1,
                    minWidth: 80,
                  }}
                >
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
              fontSize: 16,
              textAlign: "center"
            }} className="bounce-animation">
              {feedback}
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            {selected && (
              <button
                onClick={handleNext}
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
              >
                {index === questions.length - 1 ? "Finish Quiz 🎉" : "Next Question ▶"}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Summary */}
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
          }}>Quiz Complete! 🏁</h2>
          
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

          {answers.some((a) => !a.correct) && (
            <div style={{
              background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
              border: "1px solid #fca5a5"
            }}>
              <h3 style={{ 
                color: "#991b1b", 
                fontSize: 18, 
                fontWeight: 700, 
                marginBottom: 12 
              }}>
                Review Incorrect Answers:
              </h3>
              <div style={{ display: "grid", gap: 8 }}>
                {answers
                  .filter((a) => !a.correct)
                  .map((a, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.7)",
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "#7f1d1d"
                    }}>
                      ❌ <strong>{a.qid}</strong> → You chose "<strong>{a.chosen}</strong>", correct: "<strong style={{color: "#059669"}}>{a.answer}</strong>"
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
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
              🔁 Try Again
            </button>
            <button
              className="quiz-button"
              onClick={handleRestart}
              style={{
                background: "linear-gradient(135deg, #10B981, #047857)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
              }}
            >
              ← Back to Settings
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
