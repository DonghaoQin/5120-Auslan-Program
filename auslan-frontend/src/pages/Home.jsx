// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import bgImage from "../assets/homebackground3.jpg";

export default function Home() {
  const nav = useNavigate();

  const pageStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    padding: "20px",
  };

  // 标题 + 描述：左上角 + 紫色字体
  const headerWrap = {
    position: "absolute",
    top: "24px",
    left: "300px",
    maxWidth: "480px",
    textAlign: "left",
  };

  const header = {
    margin: 0,
    color: "#512994ff", // 紫色
    fontSize: "3rem", // 更大一些
    fontWeight: 800,
    textShadow: "0 3px 12px rgba(0,0,0,.2)",
    fontFamily: "'Bahnschrift', cursive",
  };

  const sub = {
    marginTop: "10px",
    color: "#9333ea", // 较浅紫色
    fontSize: "1.2rem",
    lineHeight: 1.5,
  };

  // ↓↓↓ 按钮整体下移到页面偏下（25vh）
  const gridWrap = {
    maxWidth: 1000,
    margin: "60vh auto 0 auto",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
    gap: 24,
  };

  const baseCard = {
    position: "relative",
    padding: "26px 22px",
    borderRadius: 20,
    textAlign: "center",
    cursor: "pointer",
    transition: "transform .2s ease, box-shadow .2s ease",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    border: "3px solid transparent",
    minHeight: 160,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#2d3748",
    userSelect: "none",
    background: "white",
  };

  const cardStyles = {
    insights: { ...baseCard, background: "linear-gradient(135deg,#a8d8ff,#7cc7ff)" },
    letters:  { ...baseCard, background: "linear-gradient(135deg,#b8f5d1,#9ae6b4)" },
    words:    { ...baseCard, background: "linear-gradient(135deg,#fef3c7,#fde68a)" },
    quiz:     { ...baseCard, background: "linear-gradient(135deg,#e9d5ff,#d8b4fe)" },
  };

  const emoji = { fontSize: "2.2rem", marginBottom: 10, display: "block" };
  const title = { fontSize: "1.25rem", fontWeight: 700, marginBottom: 6 };
  const subtitle = { fontSize: "0.95rem", opacity: 0.9 };

  // ---------- Activities (order matters for animation) ----------
  const cardsData = useMemo(
    () => [
      { key: "insights",  label: "Insights",            sub: "Simple facts & why Auslan matters.", route: "/insights",               emoji: "📊" },
      { key: "letters",   label: "Letters & Numbers",   sub: "A–Z and 0–9 with practice.",        route: "/learn/letters-numbers",  emoji: "✏️" },
      { key: "words",     label: "Basic Words",         sub: "Home / School / Play — 50+ words.", route: "/learn/words",            emoji: "👩‍🏫" },
      { key: "quiz",      label: "Mini Quiz",           sub: "Quick 5-question check.",           route: "/quiz",                    emoji: "👩‍💻" },
    ],
    []
  );

  // ---------- Random picker + highlight animation ----------
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [selectedIndex, setSelectedIndex]   = useState(null);
  const animatingRef = useRef(false);

  const onHover = (e, entering) => {
    e.currentTarget.style.transform = entering ? "translateY(-6px)" : "none";
    e.currentTarget.style.boxShadow = entering
      ? "0 18px 40px rgba(0,0,0,0.22)"
      : "0 12px 30px rgba(0,0,0,0.15)";
  };

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  const pickRandom = async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setSelectedIndex(null);

    const speeds = [80, 120, 180, 260, 360, 480];
    const total = cardsData.length;

    for (const sp of speeds) {
      for (let step = 0; step < total * 2; step++) {
        setHighlightIndex((prev) =>
          prev === null ? 0 : (prev + 1) % total
        );
        await sleep(sp);
      }
    }

    const final = Math.floor(Math.random() * total);
    setHighlightIndex(final);
    await sleep(420);
    setSelectedIndex(final);
    setHighlightIndex(null);

    animatingRef.current = false;
  };

  const isNarrow = typeof window !== "undefined" && window.innerWidth < 760;
  const gridResponsive = isNarrow
    ? { ...grid, gridTemplateColumns: "1fr", gap: 16 }
    : grid;

  const getDynamicRing = (idx) => {
    if (idx === selectedIndex) {
      return {
        boxShadow:
          "0 0 0 3px rgba(255,215,0,.9), 0 10px 34px rgba(0,0,0,.25), 0 0 24px rgba(255,215,0,.8)",
        transform: "scale(1.02)",
      };
    }
    if (idx === highlightIndex) {
      return {
        boxShadow:
          "0 0 0 3px rgba(99,102,241,.9), 0 10px 34px rgba(0,0,0,.22), 0 0 24px rgba(59,130,246,.6)",
        transform: "scale(1.03)",
      };
    }
    return {};
  };

  return (
    <div style={pageStyle}>
      {/* 左上角标题区域 */}
      <div style={headerWrap}>
        <h1 style={header}>Auslan Learning Hub</h1>
        <p style={sub}>Welcome! Try choosing an activity or get a random one by selecting “Pick an Activity for Me” and start your learning today!</p>
      </div>

      <style>{`
        .pick-btn {
          display:block;margin:18px auto 0 auto;padding:12px 28px;border:none;border-radius:999px;
          font-size:1.05rem;font-weight:700;color:white;background:linear-gradient(135deg,#8b5cf6,#7c3aed);
          box-shadow:0 8px 25px rgba(139,92,246,.35);cursor:pointer;transition:transform .2s ease, box-shadow .2s ease;
        }
        .pick-btn:hover { transform: translateY(-2px); box-shadow:0 12px 35px rgba(139,92,246,.45); }
        .pick-btn:disabled { opacity:.7; cursor:not-allowed; transform:none; }
      `}</style>

      {/* 按钮区域 */}
      <section style={gridWrap}>
        <div style={gridResponsive}>
          {cardsData.map((c, idx) => {
            const styleMap = cardStyles[c.key];
            return (
              <div
                key={c.key}
                style={{ ...styleMap, ...getDynamicRing(idx) }}
                onClick={() => nav(c.route)}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
              >
                <span style={emoji}>{c.emoji}</span>
                <div style={title}>{c.label}</div>
                <div style={subtitle}>{c.sub}</div>
              </div>
            );
          })}
        </div>

        <button className="pick-btn" onClick={pickRandom} disabled={animatingRef.current}>
          🎲 Pick an Activity for Me
        </button>
      </section>
    </div>
  );
}
