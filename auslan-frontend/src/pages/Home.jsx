import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg"; // 放一张背景图到 src/assets/

export default function Home() {
  const nav = useNavigate();

  const pageStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "0 20px 40px",
    paddingTop: "env(safe-area-inset-top, 0px)",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const header = {
    textAlign: "center",
    margin: "0",
    paddingTop: 24,
    color: "white",
    textShadow: "0 3px 18px rgba(0,0,0,.4)",
    fontSize: "2.6rem",
    fontWeight: 800,
  };

  const sub = {
    textAlign: "center",
    color: "#f3f4f6",
    margin: "8px 0 28px 0",
    fontSize: "1.1rem",
  };

  const grid = {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  };

  const card = {
    background: "rgba(255,255,255,0.9)",
    color: "#111",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 30px rgba(0,0,0,.25)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    border: "1px solid rgba(0,0,0,.08)",
  };

  const title = { margin: 0, fontSize: 18, fontWeight: 700 };
  const desc = { margin: 0, opacity: .8, fontSize: 14 };

  return (
    <div style={pageStyle}>
      <h1 style={header}>Auslan Learning Hub</h1>
      <p style={sub}>Start with letters & numbers → learn basic words → try a mini quiz.</p>

      <div style={grid}>
        <div style={card} onClick={() => nav("/insights")}>
          <h3 style={title}>Insights</h3>
          <p style={desc}>Simple facts & why Auslan matters for families.</p>
        </div>
        <div style={card} onClick={() => nav("/learn/letters-numbers")}>
          <h3 style={title}>Letters & Numbers</h3>
          <p style={desc}>A–Z and 0–9 with easy practice and progress.</p>
        </div>
        <div style={card} onClick={() => nav("/learn/words")}>
          <h3 style={title}>Basic Words</h3>
          <p style={desc}>Home / School / Play — ≥50 starter words.</p>
        </div>
        <div style={card} onClick={() => nav("/quiz")}>
          <h3 style={title}>Mini Quiz</h3>
          <p style={desc}>Quick 5-question check with instant feedback.</p>
        </div>
      </div>
    </div>
  );
}
