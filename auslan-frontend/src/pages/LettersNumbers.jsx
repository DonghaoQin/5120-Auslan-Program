import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { letters, numbers } from "../data/letters.js";
import bgImage from "../assets/homebackground.jpg";

export default function LettersNumbers() {
  const nav = useNavigate();
  const [done, setDone] = useState(new Set());

  const toggle = (k) => {
    const n = new Set(done);
    n.has(k) ? n.delete(k) : n.add(k);
    setDone(n);
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
    width: `${Math.round((done.size / (letters.length + numbers.length)) * 100)}%`,
    background: "linear-gradient(90deg,#7bc4ff,#70f0c2)",
  };
  const label = { textAlign: "center", color: "#fff", fontSize: 12, marginBottom: 12 };

  const section = { maxWidth: 1100, margin: "0 auto 18px auto" };
  const grid6 = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 };
  const grid10 = { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 };

  const card = (active) => ({
    background: active ? "rgba(112,240,194,.9)" : "rgba(255,255,255,.92)",
    border: "1px solid rgba(0,0,0,.08)",
    borderRadius: 14,
    height: 74,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: 24,
    cursor: "pointer",
    userSelect: "none",
    boxShadow: "0 8px 22px rgba(0,0,0,.18)",
  });

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Letters & Numbers</h1>
      <p style={sub}>Tap to mark as learned. (Later you can replace with GIF/video modals.)</p>

      <div style={progress}><div style={fill} /></div>
      <div style={label}>{done.size}/{letters.length + numbers.length} learned</div>

      <div style={section}>
        <h2 style={{ color: "white", margin: "0 0 8px 0" }}>A–Z</h2>
        <div style={grid6}>
          {letters.map(L => (
            <div key={L} style={card(done.has(L))} onClick={() => toggle(L)}>{L}</div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h2 style={{ color: "white", margin: "8px 0" }}>0–9</h2>
        <div style={grid10}>
          {numbers.map(N => (
            <div key={N} style={card(done.has(N))} onClick={() => toggle(N)}>{N}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
