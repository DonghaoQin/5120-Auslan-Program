// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import RibbonWave from "../components/RibbonWave";
import heroImg from "../assets/Homehero.png";
import heroBg from "../assets/homebackground.jpg";
import homemovie from "../assets/homemovie.mp4"; // ✅ 使用你提供的视频

export default function Home() {
  const nav = useNavigate();

  const pageStyle = {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    background: "linear-gradient(180deg,#f7fbff 0%, #ffffff 60%)",
  };

  /** ---------- 首屏：全屏视频 ---------- */
  const videoSection = {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
  };
  const bgVideo = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };
  const overlay = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.45))",
  };
  const centerWrap = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start", // 顶部
  alignItems: "center",         // 水平居中
  textAlign: "center",
  color: "white",
  paddingTop: "120px",          // 距离顶部 120px
};

  const videoTitle = {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    lineHeight: 1.05,
    fontWeight: 800,
    margin: 0,
  };
  const videoSub = { marginTop: 14, fontSize: "1.05rem", maxWidth: 820, lineHeight: 1.7 };
  const ctaPrimary = {
    marginTop: 24,
    padding: "14px 24px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#635bff,#7c3aed)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 26px rgba(99,91,255,.35)",
  };

  /** ---------- Hero（被放到视频与 Letters&Numbers 之间） ---------- */
  const heroWrap = {
    position: "relative",
    minHeight: "80vh",
    overflow: "hidden",
    backgroundImage: `url(${heroBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
  };
  const heroInner = {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "80px 24px 32px",
    width: "100%",
  };
  const heroTitle = {
    fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)",
    lineHeight: 1.08,
    margin: 0,
    color: "#f2a44bff",
    fontWeight: 900,
    letterSpacing: "-0.02em",
  };
  const heroDesc = {
    marginTop: 14,
    fontSize: "1.05rem",
    lineHeight: 1.6,
    color: "rgba(215, 91, 91, 0.85)",
  };
  const heroCard = {
    display: "grid",
    gridTemplateColumns: "minmax(320px,1fr) minmax(320px,520px)",
    gap: 28,
    background: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    boxShadow: "0 18px 50px rgba(20,25,40,.28)",
    padding: 28,
    border: "1px solid rgba(255,255,255,.2)",
  };
  const cta = {
    marginTop: 18,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 18px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#635bff,#7c3aed)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 26px rgba(99,91,255,.35)",
  };
  const heroImage = {
    width: "100%",
    height: 300,
    borderRadius: 12,
    objectFit: "cover",
    boxShadow: "inset 0 0 0 2px rgba(10,37,64,.06)",
  };

  /** ---------- 四个入口按钮 ---------- */
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
    color: "#010203ff",
    userSelect: "none",
    background: "white",
    width: 360,
    maxWidth: "85vw",
  };
  const cardStyles = {
    letters: { ...baseCard, background: "linear-gradient(135deg,#b8f5d1,#9ae6b4)" },
    words: { ...baseCard, background: "linear-gradient(135deg,#fef3c7,#fde68a)" },
    quiz: { ...baseCard, background: "linear-gradient(135deg,#e9d5ff,#d8b4fe)" },
    story: { ...baseCard, background: "linear-gradient(135deg,#a8d8ff,#7cc7ff)" },
  };
  const emoji = { fontSize: "2.2rem", marginBottom: 10, display: "block" };
  const title = { fontSize: "1.25rem", fontWeight: 700, marginBottom: 6 };
  const subtitle = { fontSize: "0.95rem", opacity: 0.9 };
  const sectionWrap = (bg) => ({
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    background: bg,
    position: "relative",
    overflow: "hidden",
  });

  const sections = useMemo(
    () => [
      {
        key: "letters",
        label: "Letters & Numbers",
        sub: "A–Z and 0–9 with practice.",
        route: "/learn/letters-numbers",
        emoji: "✏️",
        bg: "linear-gradient(180deg,#f0fff7 0%, #e8fff3 100%)",
      },
      {
        key: "words",
        label: "Basic Words",
        sub: "Home / School / Play — 50+ words.",
        route: "/learn/words",
        emoji: "👩‍🏫",
        bg: "linear-gradient(180deg,#fff9ec 0%, #fff3d6 100%)",
      },
      {
        key: "quiz",
        label: "Mini Quiz",
        sub: "Quick 5-question check.",
        route: "/quiz",
        emoji: "👩‍💻",
        bg: "linear-gradient(180deg,#faf5ff 0%, #f3e8ff 100%)",
      },
      {
        key: "story",
        label: "Storybook",
        sub: "Learn words in real-life context.",
        route: "/storybook",
        emoji: "📖",
        bg: "linear-gradient(180deg,#f0f7ff 0%, #e6f1ff 100%)",
      },
    ],
    []
  );

  return (
    <div style={pageStyle}>
      {/* 1) 视频区 */}
      <section style={videoSection}>
        <video
          style={bgVideo}
          src={homemovie}
          autoPlay
          muted
          loop
          playsInline
          poster={heroBg} // 加载前显示背景
        />
        <div style={overlay} />
        
        <div style={centerWrap}>
          <div>
            <h1 style={videoTitle}>Unlock your Auslan learning</h1>
            <p style={videoSub}>
              Learn letters, numbers, and everyday words together —also with story book.
            </p>
            <button style={ctaPrimary} onClick={() => nav("/learn/letters-numbers")}>
              Start Learning →
            </button>
          </div>
        </div>
        <div className="scroll-down">⮟</div>

      </section>

      {/* 2) Hero（放在视频和 Letters&Numbers 之间） */}
      <section style={heroWrap}>
        <div style={heroInner}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={heroTitle}>Discover Auslan</h1>
            <p style={{ ...heroDesc, maxWidth: 820 }}>
              Australian Sign Language (Auslan) is the sign language of the deaf community in Australia. It's a
              rich, complete language with its own grammar, vocabulary, and cultural nuances.
            </p>
          </div>
          <div style={heroCard}>
            <div>
              <h2 style={{ margin: 0, fontSize: "2rem", color: "#113457ff" }}>What is Auslan?</h2>
              <p style={{ ...heroDesc, color: "#333" }}>
                Auslan is more than signs — it’s culture, identity, and connection. Explore its richness and why it matters.
              </p>
              <button style={cta} onClick={() => nav("/insights")}>
                Know more →
              </button>
            </div>
            <img src={heroImg} alt="Learning Auslan at home" style={heroImage} />
          </div>
        </div>
      </section>

      {/* 3) 四个功能区（Letters & Numbers 开始） */}
      {sections.map((s) => {
        const styleMap = cardStyles[s.key];
        const withWave = s.key === "letters";
        return (
          <section key={s.key} style={sectionWrap(s.bg)}>
            {withWave && (
              <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <RibbonWave />
              </div>
            )}
            <div
              style={{ ...styleMap, position: "relative", zIndex: 1 }}
              onClick={() => nav(s.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
              }}
            >
              <span style={emoji}>{s.emoji}</span>
              <div style={title}>{s.label}</div>
              <div style={subtitle}>{s.sub}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
