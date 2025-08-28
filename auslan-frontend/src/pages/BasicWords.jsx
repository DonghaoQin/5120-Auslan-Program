import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/words.js";
import bgImage from "../assets/homebackground.jpg";

export default function BasicWords() {
  const nav = useNavigate();
  const [learned, setLearned] = useState(new Set());
  const all = categories.flatMap(c => c.words);

  const toggle = (w) => {
    const n = new Set(learned);
    n.has(w) ? n.delete(w) : n.add(w);
    setLearned(n);
  };

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

  const progress = {
    maxWidth: 960, margin: "0 auto 16px auto",
    height: 12, background: "rgba(255,255,255,.25)",
    borderRadius: 999, overflow: "hidden",
  };
  const fill = {
    height: "100%",
    width: `${Math.round((learned.size / all.length) * 100)}%`,
    background: "linear-gradient(90deg,#7bc4ff,#70f0c2)",
  };
  const label = { textAlign: "center", color: "#fff", fontSize: 12, marginBottom: 12 };

  const section = { maxWidth: 1100, margin: "0 auto 18px auto" };
  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 };

  const chip = (on) => ({
    background: on ? "rgba(112,240,194,.92)" : "rgba(255,255,255,.92)",
    border: "1px solid rgba(0,0,0,.08)",
    borderRadius: 14,
    padding: "16px 10px",
    textAlign: "center",
    textTransform: "capitalize",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 22px rgba(0,0,0,.18)",
    userSelect: "none",
  });

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Basic Words</h1>
      <p style={sub}>Tap to mark learned. You’ll attach GIF/video later.</p>

      <div style={progress}><div style={fill} /></div>
      <div style={label}>{learned.size}/{all.length} learned</div>

      {categories.map(cat => (
        <div key={cat.name} style={section}>
          <h2 style={{ color: "white", margin: "0 0 8px 0" }}>{cat.name}</h2>
          <div style={grid}>
            {cat.words.map(w => (
              <div key={w} style={chip(learned.has(w))} onClick={() => toggle(w)}>{w}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
