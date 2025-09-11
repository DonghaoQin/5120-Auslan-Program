// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useMemo, useEffect } from "react";

import RibbonWave from "../components/RibbonWave";
import heroImg from "../assets/Homehero.png";
import heroBg from "../assets/homebackground.jpg";
import homemovie from "../assets/homemovie.mp4";
import HomeLeft from "../assets/Homeleftcard.png";
import HomeMiddle from "../assets/Homemiddlecard.png";
import HomeRight from "../assets/Homerightcard.png";


export default function Home() {
  const nav = useNavigate();

  /* ---------- 页面与各区样式 ---------- */
  const pageStyle = {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 60%)",
  };

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
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 100%)",
  };
  const centerWrap = {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    paddingTop: "120px",
  };
  const videoTitle = {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    lineHeight: 1.05,
    fontWeight: 800,
    margin: 0,
  };
  const videoSub = {
    marginTop: 14,
    fontSize: "1.05rem",
    maxWidth: 820,
    lineHeight: 1.7,
  };
  const ctaPrimary = {
    marginTop: 24,
    padding: "14px 24px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#635bff,#7c3aed)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 26px rgba(99,91,255,0.35)",
  };

  // 功能卡片样式
  const cardStyles = {
    letters: baseCard(),
    words: baseCard(),
    quiz: baseCard(),
    story: baseCard(),
  };
  function baseCard() {
    return {
      minWidth: 280,
      padding: 18,
      borderRadius: 16,
      background: "#ffffff",
      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "transform .25s ease, box-shadow .25s ease",
    };
  }
  const emoji = { fontSize: 28, marginBottom: 10, display: "block" };
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

  // 四个入口
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

  /* ---------- Scroll 动画：两幕在一个 pin 区 ---------- */
  // 放在 Home.jsx 组件内，完整替换你现在的 useEffect
useEffect(() => {
  const gsapRef = window.gsap;
  const ST = window.ScrollTrigger;
  if (!gsapRef || !ST) return;

  gsapRef.registerPlugin(ST);
  ST.normalizeScroll(true); // 减少设备“飞滑”动量

  // 初始：幕1文案左上，幕2文案居中隐藏
  gsapRef.set(".sh-copy1", { left: "6%", top: "10%", xPercent: 0, y: 0, opacity: 1 });
  gsapRef.set(".sh-copy2", { left: "50%", top: "10%", xPercent: -50, opacity: 0 });

  const tl = gsapRef.timeline({
    scrollTrigger: {
      trigger: ".scroll-hero",
      start: "top top",
      end: "+=200%",
      scrub: 0.6,                 // 跟随但带平滑，防“快进”
      pin: ".scroll-hero__pin",
      anticipatePin: 1,
      fastScrollEnd: true,        // 快速滚动松手时更自然
      invalidateOnRefresh: true,
      snap: {                     // 松手后自动补动到最近阶段
        snapTo: "labelsDirectional",
        duration: { min: 0.25, max: 0.6 },
        ease: "power2.out",
      },
    },
  });

  tl.addLabel("stage0", 0);

  // 人物抬升 & 微放大
  tl.to(".sh-photo", { yPercent: -10, scale: 1.15, duration: 1 }, 0)
    .addLabel("stage1");

  // 白框扩张为整屏（更快更有冲劲）
  tl.to(".sh-frame", {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    left: 0,
    top: 0,
    xPercent: 0,
    yPercent: 0,
    transform: "none",
    duration: 0.6,
    ease: "power2.out",
  }, 0.1)
    .addLabel("stage2");

  // 两侧卡片出现
  tl.to(".sh-side", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.35)
    .addLabel("stage3");

  // 文案切换
  tl.to(".sh-copy1", { opacity: 0, duration: 0.5 }, 0.45)
    .to(".sh-copy2", { opacity: 1, duration: 0.8 }, 0.75)
    .addLabel("stage4");

  return () => {
    tl.scrollTrigger && tl.scrollTrigger.kill();
    tl.kill();
  };
}, []);



  return (
    <div style={pageStyle}>
      {/* 1) 顶部视频区 */}
      <section style={videoSection}>
        <video
          style={bgVideo}
          src={homemovie}
          autoPlay
          muted
          loop
          playsInline
          poster={heroBg}
        />
        <div style={overlay} />

        <div style={centerWrap}>
          <div>
            <h1 style={videoTitle}>Unlock your Auslan learning</h1>
            <p style={videoSub}>
              Learn letters, numbers, and everyday words together — also with
              story book.
            </p>
            <button
              style={ctaPrimary}
              onClick={() => nav("/learn/letters-numbers")}
            >
              Start Learning →
            </button>
          </div>
        </div>
        <div className="scroll-down">⮟</div>
      </section>

      {/* 2) （移动后的）同一场景两幕：紧跟视频下方 */}
      <section
        className="scroll-hero"
        style={{
          position: "relative",
          minHeight: "200vh",
        }}
      >
          <div
            className="scroll-hero__pin"
            style={{ position: "relative", height: "100vh", overflow: "hidden" }}
          >
          {/* 幕一：整屏棕色背景 */}
          <div
            className="sh-bg"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg,#8B5E3C 0%, #A47148 100%)",
              zIndex: 0,
            }}
          />

          {/* 幕一：文案 */}
          <div
            className="sh-copy1"
            style={{
              position: "absolute",
              color: "#fff",
              textAlign: "left",
              maxWidth: 620,
              zIndex: 5,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              What is Auslan?
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.7, opacity: 0.95 }}>
              Australian Sign Language (Auslan) is the sign language of the deaf community in Australia. It's a rich, complete language with its own grammar, vocabulary, and cultural nuances.
            </p>
            <button
              style={{
                marginTop: 24,
                padding: "14px 24px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(135deg,#ffb86b,#ff7a45)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => nav("/insights")}
            >
              Know more →
            </button>
          </div>

          {/* 幕二：白框（初始小，后面扩张为整屏） */}
          <div
            className="sh-frame"
            style={{
              position: "absolute",
              left: "50%",
              top: "70%",
              transform: "translate(-50%, -50%) scale(0.35)",
              width: 560,
              height: 360,
              background: "#ffffffff",
              borderRadius: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,.18)",
              zIndex: 1,
            }}
          />

          {/* 幕二：左侧卡片 */}
            <div
              className="sh-side sh-left"
              style={{
                position: "absolute",
                left: "6%",
                top: "60%",
                transform: "translateY(40px)",
                width: 280, // 方块大小
                height: 360,
                padding: 16,
                opacity: 0,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 18px 50px rgba(0,0,0,.15)",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                textAlign: "center",
                backgroundImage: `url(${HomeLeft})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* 白底黑字信息框 */}
              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  width: "90%",
                }}
              >
                <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>
                  Trends
                </h3>
                <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                  Key issues faced by DHH students
                </p>
              </div>
            </div>

            {/* 幕二：中间卡片 */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "65%",
                transform: "translate(-50%, -50%)",
                width: 360,
                height: 400,
                padding: 16,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 18px 50px rgba(0,0,0,.15)",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                textAlign: "center",
                backgroundImage: `url(${HomeMiddle})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 0 4px #fff",
              }}
            >
              {/* 白底黑字信息框 */}
              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  width: "90%",
                }}
              >
                <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>
                  Challenges
                </h3>
                <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                  Key issues faced by DHH students
                </p>
              </div>
            </div>

            {/* 幕二：右侧卡片 */}
            <div
              className="sh-side sh-right"
              style={{
                position: "absolute",
                right: "6%",
                top: "60%",
                transform: "translateY(40px)",
                width: 280,
                height: 360,
                padding: 16,
                opacity: 0,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 18px 50px rgba(0,0,0,.15)",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                textAlign: "center",
                backgroundImage: `url(${HomeRight})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* 白底黑字信息框 */}
              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  width: "90%",
                }}
              >
                <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>
                  Resources
                </h3>
                <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                  Key issues faced by DHH students
                </p>
              </div>
            </div>


          {/* 幕二：文案 */}
          <div
            className="sh-copy2"
            style={{
              position: "absolute",
              color: "#111",
              textAlign: "center",
              maxWidth: 820,
              zIndex: 5,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Why people need Auslan?
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.7, opacity: 0.95, margin: "0 auto" }}>
              Auslan is more than signs — it’s culture, identity, and connection.
              Explore its richness and why it matters.
            </p>
            <button
              style={{
                marginTop: 24,
                padding: "14px 24px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(135deg,#635bff,#7c3aed)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => nav("/insights")}
            >
              Insights →
            </button>
          </div>
        </div>
      </section>

      {/* 3) 四个功能入口（每个独立区块，便于单独设计） */}

          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg,#f0fff7 0%, #e8fff3 100%)", // 纯色渐变
            }}
          >
            <div
              style={{
                minWidth: 320,
                maxWidth: 600,
                padding: 32,
                borderRadius: 24,
                background: "#fff",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => nav("/learn/letters-numbers")}
            >
              <span style={{ fontSize: 40, marginBottom: 12 }}>✏️</span>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                Letters & Numbers
              </div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                A–Z and 0–9 with practice.
              </div>
            </div>
          </section>

       
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg,#fff9ec 0%, #fff3d6 100%)",
            }}
          >
            <div
              style={{
                minWidth: 320,
                maxWidth: 600,
                padding: 32,
                borderRadius: 24,
                background: "#fff",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => nav("/learn/words")}
            >
              <span style={{ fontSize: 40, marginBottom: 12 }}>👩‍🏫</span>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                Basic Words
              </div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                Home / School / Play — 50+ words.
              </div>
            </div>
          </section>

         
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg,#faf5ff 0%, #f3e8ff 100%)",
            }}
          >
            <div
              style={{
                minWidth: 320,
                maxWidth: 600,
                padding: 32,
                borderRadius: 24,
                background: "#fff",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => nav("/quiz")}
            >
              <span style={{ fontSize: 40, marginBottom: 12 }}>👩‍💻</span>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                Mini Quiz
              </div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                Quick 5-question check.
              </div>
            </div>
          </section>

      
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg,#f0f7ff 0%, #e6f1ff 100%)",
            }}
          >
            <div
              style={{
                minWidth: 320,
                maxWidth: 600,
                padding: 32,
                borderRadius: 24,
                background: "#fff",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => nav("/storybook")}
            >
              <span style={{ fontSize: 40, marginBottom: 12 }}>📖</span>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                Storybook
              </div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                Learn words in real-life context.
              </div>
            </div>
          </section>

        );
      })}
    </div>
  );
}



