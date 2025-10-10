import { useState } from "react";
import LNQuiz from "./LNQuiz.jsx";
import WordQuiz from "./WordQuiz.jsx";
import quizBack from "../assets/QuizBack.png"; // ✅ 导入背景图

export default function MiniQuizHub() {
  const [mode, setMode] = useState(null);

  // ✅ 返回按钮
  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
        color: "#fff",
        border: "none",
        borderRadius: 20,
        padding: "8px 16px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: "0 6px 16px rgba(59,130,246,.35)",
        transition: "all .25s ease",
        margin: "40px 0 16px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      ← Back to Hub
    </button>
  );

  // ✅ 卡片样式
  const card = {
    flex: 1,
    minWidth: 280,
    minHeight: 220,
    borderRadius: 20,
    padding: 26,
    background: "#fff",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
    transition: "all .3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  // ✅ 标题
  const Title = ({ children }) => (
    <h1
      style={{
        fontSize: 34,
        fontWeight: 900,
        textAlign: "center",
        color: "#1E293B",
        textShadow: "0 2px 6px rgba(0,0,0,.06)",
        margin: "140px auto 96px",
      }}
    >
      {children} <span style={{ color: "#F97316" }}>🧩</span>
    </h1>
  );

  // ✅ 副标题
  const SubTitle = ({ children }) => (
    <p
      style={{
        color: "#6B7280",
        textAlign: "center",
        maxWidth: 680,
        margin: "140px auto 28px",
        lineHeight: 1.6,
        fontSize: 15,
      }}
    >
      {children}
    </p>
  );

  const handleBack = () => setMode(null);

  return (
    // 🌈 外层背景容器（全屏）
    <div
      style={{
        backgroundImage: `url(${quizBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        paddingBottom: "80px",
      }}
    >
      
      <div
        style={{
          maxWidth: 1024,
          width: "90%",
          margin: "0 auto",
          padding: "40px 24px 96px",
          backgroundColor: "#f8f5f3ff", 
          borderRadius: 20,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* === Hub 主页 === */}
        {mode === null && (
          <>
            <Title>Quiz Hub</Title>
            <SubTitle>
              Choose a quiz mode below to start your Auslan learning adventure!
            </SubTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                alignItems: "stretch",
                marginTop: 24,
              }}
            >
              {/* 🅰️ Letters & Numbers 卡片 */}
              <div
                style={card}
                onClick={() => setMode("ln")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 36px rgba(59,130,246,.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 28px rgba(0,0,0,.08)";
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    lineHeight: 1,
                    marginBottom: 10,
                    color: "#3B82F6",
                  }}
                >
                  🔤
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#1E3A8A",
                    margin: "2px 0 8px",
                  }}
                >
                  Letters & Numbers
                </h2>
                <p style={{ color: "#475569", fontSize: 15 }}>
                  Practice recognizing letters (A–Z) and numbers (0–9) from Auslan sign images.
                </p>
              </div>

              {/* 🎬 Basic Words 卡片 */}
              <div
                style={card}
                onClick={() => setMode("words")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 36px rgba(139,92,246,.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 28px rgba(0,0,0,.08)";
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    lineHeight: 1,
                    marginBottom: 10,
                    color: "#8B5CF6",
                  }}
                >
                  🎬
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#5B21B6",
                    margin: "2px 0 8px",
                  }}
                >
                  Basic Words
                </h2>
                <p style={{ color: "#475569", fontSize: 15 }}>
                  Watch Auslan sign videos and guess their meanings by category.
                </p>
              </div>
            </div>
          </>
        )}

        {/* === LN Quiz 模式 === */}
        {mode === "ln" && (
          <div>
            <BackButton onClick={handleBack} />
            <LNQuiz />
          </div>
        )}

        {/* === Word Quiz 模式 === */}
        {mode === "words" && (
          <div>
            <BackButton onClick={handleBack} />
            <WordQuiz />
          </div>
        )}
      </div>
    </div>
  );
}
