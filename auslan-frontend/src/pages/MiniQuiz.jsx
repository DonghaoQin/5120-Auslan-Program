import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/words.js";
import bgImage from "../assets/homebackground.jpg";

const sample = (arr, n) => {
  const a = [...arr], out = [];
  while (out.length < n && a.length) out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);
  return out;
};

export default function MiniQuiz() {
  const nav = useNavigate();
  const pool = categories.flatMap(c => c.words);
  const questions = useMemo(
    () => sample(pool, Math.min(5, pool.length)).map(word => ({
      prompt: `Which word matches this sign? (placeholder: ${word})`,
      correct: word,
      options: sample(pool.filter(w=>w!==word), 2).concat([word]).sort()
    })), []
  );

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const back = {
    position: "absolute", top: 12, right: 20, fontSize: "2rem",
    color: "white", background: "rgba(0,0,0,.3)", borderRadius: "50%",
    width: 40, height: 40, display: "flex", justifyContent: "center",
    alignItems: "center", cursor: "pointer", zIndex: 10,
  };

  const page = {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "0 20px 40px",
    paddingTop: "env(safe-area-inset-top, 0px)",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const h1 = { textAlign: "center", margin: "0 0 8px 0", fontSize: "2.3rem", color: "white" };
  const sub = { textAlign: "center", color: "#f3e7e7", margin: "0 0 18px 0" };

  const panel = {
    maxWidth: 800, margin: "0 auto",
    background: "rgba(255,255,255,.94)",
    border: "1px solid rgba(0,0,0,.06)",
    borderRadius: 16, padding: 18,
    boxShadow: "0 12px 30px rgba(0,0,0,.28)",
  };

  const media = {
    height: 160, display: "grid", placeItems: "center",
    background: "#0d1426", borderRadius: 12, color: "white", marginBottom: 12,
  };

  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };

  const btn = {
    background: "#1b2643", color: "white", border: "1px solid #2b3c6a",
    padding: "12px", borderRadius: 10, cursor: "pointer", width: "100%",
  };

  const choose = (opt) => {
    const q = questions[i];
    const ok = opt === q.correct;
    if (ok) setScore(s => s + 1);
    if (i + 1 === questions.length) setDone(true);
    else setI(k => k + 1);
    alert(ok ? "✅ Correct!" : `❌ Incorrect. Answer: ${q.correct}`);
  };

  const restart = () => window.location.reload();

  const q = questions[i];

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Mini Quiz</h1>
      <p style={sub}>5 quick questions. Placeholder shows the sign’s label; replace with GIF/video later.</p>

      {!done ? (
        <div style={panel}>
          <p style={{ marginTop: 0 }}>Question {i + 1} / {questions.length}</p>
          <div style={media}>[SIGN for: {q.correct}]</div>
          <div style={grid}>
            {q.options.map(opt => (
              <button key={opt} style={btn} onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
        </div>
      ) : (
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Your Score: {score} / {questions.length}</h2>
          <button style={btn} onClick={restart}>Try Again</button>
        </div>
      )}
    </div>
  );
}
