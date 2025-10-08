// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import heroBg from "../assets/homebackground.jpg";
import homemovie from "../assets/homemovie.mp4";
import HomeLeft from "../assets/Homeleftcard.png";
import HomeMiddle from "../assets/Homemiddlecard.png";
import HomeRight from "../assets/Homerightcard.png";

export default function Home() {
  const nav = useNavigate();

  /* ---------- Page & section styles ---------- */
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
    background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 100%)",
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
    marginTop: 32,
    padding: "18px 36px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#635bff,#7c3aed)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(99,91,255,0.4)",
    transition: "all 0.3s ease",
    transform: "translateY(0)",
    display: "block",
    margin: "300px auto 0 auto",
  };

  /* ---------- Scroll-driven scene (two acts within one pinned area) ---------- */
  useEffect(() => {
    const gsapRef = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsapRef || !ST) return;

    gsapRef.registerPlugin(ST);
    ST.normalizeScroll(true);

    // Initial positions: copy1 visible at top-left; copy2 centered but hidden
    gsapRef.set(".sh-copy1", { left: "6%", top: "10%", xPercent: 0, y: 0, opacity: 1 });
    gsapRef.set(".sh-copy2", { left: "50%", top: "10%", xPercent: -50, opacity: 0 });

    // Enter animation for "Letters" section text
    gsapRef.fromTo(
      ".letters-section-text",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".letters-section-text",
          start: "top 60%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Enter animation for "Letters" section image
    gsapRef.fromTo(
      ".letters-section-img",
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".letters-section-img",
          start: "top 15%",
          end: "bottom 65%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Main timeline: pin the scene and orchestrate transitions
    const tl = gsapRef.timeline({
      scrollTrigger: {
        trigger: ".scroll-hero",
        start: "top top",
        end: "+=200%",
        scrub: 0.6,
        pin: ".scroll-hero__pin",
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: "labelsDirectional",
          duration: { min: 0.25, max: 0.6 },
          ease: "power2.out",
        },
      },
    });

    tl.addLabel("stage0", 0);

    // Lift and slightly scale the centered photo
    tl.to(".sh-photo", { yPercent: -10, scale: 1.15, duration: 1 }, 0).addLabel("stage1");

    // Expand the white frame to full-screen
    tl.to(
      ".sh-frame",
      {
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
      },
      0.1
    ).addLabel("stage2");

    // Reveal side cards
    tl.to(".sh-side", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.35).addLabel("stage3");

    // Crossfade copy: hide copy1, show copy2
    tl.to(".sh-copy1", { opacity: 0, duration: 0.5 }, 0.45)
      .to(".sh-copy2", { opacity: 1, duration: 0.8 }, 0.75)
      .addLabel("stage4");

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  /* ---------- Shared card styles and hover helpers ---------- */
  const cardStyle = (c1, c2) => ({
    cursor: "pointer",
    border: "none",
    borderRadius: 18,
    padding: "28px 24px",
    textAlign: "left",
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    boxShadow: "0 18px 40px rgba(0,0,0,.08)",
    transition: "transform .2s ease, box-shadow .2s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  });

  const titleStyle = { fontSize: 22, fontWeight: 800, marginBottom: 6 };

  const hoverOn = (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 26px 60px rgba(0,0,0,.12)";
  };
  const hoverOff = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,.08)";
  };

  return (
    <div style={pageStyle}>
      {/* 1) Top background video hero */}
      <section style={videoSection}>
        <video style={bgVideo} src={homemovie} autoPlay muted loop playsInline poster={heroBg} />
        <div style={overlay} />

        <div style={centerWrap}>
          <div>
            <h1 style={videoTitle}>Unlock your Auslan learning</h1>
            <p style={videoSub}>
              Learn letters, numbers, and everyday words together — also with story book.
            </p>
            <button
              style={ctaPrimary}
              onClick={() => nav("/learn/letters-numbers")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 16px 35px rgba(99,91,255,0.5)";
                e.currentTarget.style.background = "linear-gradient(135deg,#5a52e8,#6f2bd1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(99,91,255,0.4)";
                e.currentTarget.style.background = "linear-gradient(135deg,#635bff,#7c3aed)";
              }}
            >
              Start Learning →
            </button>
          </div>
        </div>
        <div className="scroll-down">⮟</div>
      </section>

      {/* 2) Two-act scroll scene pinned in the viewport */}
      <section className="scroll-hero" style={{ position: "relative", minHeight: "200vh" }}>
        <div className="scroll-hero__pin" style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
          {/* Act 1: full-screen brown gradient background */}
          <div
            className="sh-bg"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg,#8B5E3C 0%, #A47148 100%)",
              zIndex: 0,
            }}
          />

          {/* Act 1: copy block */}
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
              Australian Sign Language (Auslan) is the sign language of the deaf community in
              Australia. It's a rich, complete language with its own grammar, vocabulary, and
              cultural nuances.
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

          {/* Act 2: white frame that expands to full-screen */}
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

          {/* Act 2: left card */}
          <div
            className="sh-side sh-left"
            style={{
              position: "absolute",
              left: "6%",
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
              backgroundImage: `url(${HomeLeft})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                padding: "10px 12px",
                borderRadius: 12,
                width: "90%",
              }}
            >
              <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>Trends</h3>
              <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                How learning needs are evolving for DHH people
              </p>
            </div>
          </div>

          {/* Act 2: center card */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "70%",
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
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                padding: "10px 12px",
                borderRadius: 12,
                width: "90%",
              }}
            >
              <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>Challenges</h3>
              <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                Barriers in education and everyday communication
              </p>
            </div>
          </div>

          {/* Act 2: right card */}
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
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                padding: "10px 12px",
                borderRadius: 12,
                width: "90%",
              }}
            >
              <h3 style={{ color: "#111", fontSize: 20, fontWeight: 800, margin: 0 }}>Resources</h3>
              <p style={{ color: "#333", fontSize: 14, marginTop: 6 }}>
                Support tools and strategies that make a difference
              </p>
            </div>
          </div>

          {/* Act 2: copy block */}
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
              Auslan is more than signs — it’s culture, identity, and connection. Explore its
              richness and why it matters.
            </p>
            <button
              style={{
                marginTop: 32,
                padding: "18px 36px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(135deg,#635bff,#7c3aed)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "18px",
                boxShadow: "0 12px 30px rgba(99,91,255,0.4)",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                display: "block",
                margin: "32px auto 0 auto",
              }}
              onClick={() => nav("/insights")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 16px 60px rgba(99,91,255,0.5)";
                e.currentTarget.style.background = "linear-gradient(135deg,#5a52e8,#6f2bd1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(99,91,255,0.4)";
                e.currentTarget.style.background = "linear-gradient(135deg,#635bff,#7c3aed)";
              }}
            >
              Insights →
            </button>
          </div>
        </div>
      </section>

      {/* 3) Bottom activity grid (2x2) + "Pick for me" */}
      <section
        id="activities"
        style={{
          minHeight: "100vh",
          padding: "80px 20px 40px",
          textAlign: "center",
          background: "radial-gradient(1200px 600px at 50% 0%, rgba(255,255,255,0.9), #e6f7f7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(2rem,4vw,2.6rem)", marginBottom: 12 }}>
          Choose Your Activity
        </h2>
        <p style={{ opacity: 0.8, margin: "0 0 24px" }}>Pick one to continue learning Auslan.</p>

        {/* Collect refs for the four cards so "Pick for me" can highlight one */}
        {(() => {
          const refs = (window._activityRefs ||= { current: [] });

          // Random picker with easing: cycles through cards quickly then slows down to the final selection
          window.pickActivityForMe = () => {
            const refs = (window._activityRefs ||= { current: [] }).current.filter(Boolean);
            if (!refs.length) return;

            // Tunable parameters
            const duration = 1800; // total duration in ms
            const minCycles = 2; // minimum full cycles
            const extraCycles = 2; // up to N extra cycles

            const targetOffset = Math.floor(Math.random() * refs.length);
            const totalSteps =
              (minCycles + Math.floor(Math.random() * (extraCycles + 1))) * refs.length + targetOffset;

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const oldShadow = new WeakMap();

            let lastStep = -1;
            const t0 = performance.now();

            function unhighlight(el) {
              if (!el) return;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = oldShadow.get(el) ?? "";
              el.style.outline = "";
            }
            function highlight(el, strong = false) {
              if (!oldShadow.has(el)) oldShadow.set(el, el.style.boxShadow);
              el.style.transform = "translateY(-4px)";
              el.style.boxShadow = strong
                ? "0 0 0 8px rgba(80,160,255,.35), 0 26px 60px rgba(0,0,0,.16)"
                : "0 0 0 6px rgba(80,160,255,.25), 0 22px 60px rgba(0,0,0,.16)";
              el.style.outline = "3px solid rgba(0,0,0,.10)";
            }

            function frame(now) {
              const t = Math.min(1, (now - t0) / duration);
              const step = Math.floor(easeOutCubic(t) * totalSteps);

              if (step !== lastStep) {
                if (lastStep >= 0) unhighlight(refs[lastStep % refs.length]);
                const el = refs[step % refs.length];
                highlight(el);
                lastStep = step;
              }

              if (t < 1) {
                requestAnimationFrame(frame);
              } else {
                // Keep the final selection strongly highlighted for 2s
                const selected = refs[lastStep % refs.length];
                highlight(selected, true);
                setTimeout(() => {
                  refs.forEach((el) => el !== selected && unhighlight(el));
                }, 2000);
              }
            }

            requestAnimationFrame(frame);
          };

          return (
            <>
              {/* Fixed 2x2 grid (stacks to 1 column on small screens) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
                  gridAutoRows: "1fr",
                  gap: 24,
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                {/* Letters & Numbers */}
                <button
                  ref={(el) => (refs.current[0] = el)}
                  onClick={() => nav("/learn/letters-numbers")}
                  style={cardStyle("#b9f6ca", "#8fe3c0")}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  <div style={{ fontSize: 42, marginBottom: 8 }}>✏️</div>
                  <div style={titleStyle}>Letters & Numbers</div>
                  <div>A–Z and 0–9 with practice.</div>
                </button>

                {/* Basic Words */}
                <button
                  ref={(el) => (refs.current[1] = el)}
                  onClick={() => nav("/learn/words")}
                  style={cardStyle("#fff3b0", "#ffe08a")}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  <div style={{ fontSize: 42, marginBottom: 8 }}>📚</div>
                  <div style={titleStyle}>Basic Words</div>
                  <div>Home / School / Play — 50+ words.</div>
                </button>

                {/* Story Book */}
                <button
                  ref={(el) => (refs.current[2] = el)}
                  onClick={() => nav("/story-book")} // If your route is /storybook, update here
                  style={cardStyle("#b9d7ff", "#9bc6ff")}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  <div style={{ fontSize: 42, marginBottom: 8 }}>📖</div>
                  <div style={titleStyle}>Story Book</div>
                  <div>Read and learn with stories.</div>
                </button>

                {/* Mini Quiz */}
                <button
                  ref={(el) => (refs.current[3] = el)}
                  onClick={() => nav("/quiz")}
                  style={cardStyle("#e7d1ff", "#d5b8ff")}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  <div style={{ fontSize: 42, marginBottom: 8 }}>🧠</div>
                  <div style={titleStyle}>Mini Quiz</div>
                  <div>Quick 5-question check.</div>
                </button>
              </div>

              {/* Random picker CTA */}
              <div style={{ marginTop: 28 }}>
                <button
                  onClick={() => window.pickActivityForMe()}
                  style={{
                    borderRadius: 999,
                    padding: "12px 18px",
                    border: "none",
                    fontWeight: 700,
                    boxShadow: "0 10px 24px rgba(0,0,0,.12)",
                    background: "linear-gradient(135deg, rgba(130,130,255,.95), rgba(170,210,255,.95))",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <span style={{ fontSize: 18 }}>🎲 Pick an Activity for Me</span>
                </button>
              </div>
            </>
          );
        })()}
      </section>
    </div>
  );
}
