// StoryBook.jsx
import React, { useEffect, useMemo, useState } from "react";

/** ---------- Story data (14 pages) ---------- */
const storyData = {
  title: "I Found a Frog.",
  cover: "https://i.imgur.com/lSLaM0x.png",
  pages: [
    {
      image: "https://i.imgur.com/fEtytpr.png",
      text:
        "Even though I have grandchildren of my own, it seems like it was only yesterday when I returned home from school to find a frog in my bedroom.",
      interactiveWords: ["frog", "school", "bedroom"],
    },
    {
      image: "https://i.imgur.com/RPSGWGD.png",
      text:
        'My mother just chuckled when I yelled out, “I found a frog on my bed.” Now, she knew that I would eventually find one but she let me discover a wonder of Nature that many people miss.',
      interactiveWords: ["frog", "mother", "Nature"],
    },
    {
      image: "https://i.imgur.com/rWx1mrm.png",
      text:
        "You see, a little earlier that spring, when I was 6 years old; I saw some little, black fish in a pond. Since I didn’t have any pets I went home and asked my mother if I could have one.",
      interactiveWords: ["fish", "pond", "mother"],
    },
    {
      image: "https://i.imgur.com/Y40D3nf.png",
      text:
        "After we talked about my catching some of the fish I saw, and the responsibility of having a pet, she agreed.",
      interactiveWords: ["fish", "pet", "responsibility"],
    },
    {
      image: "https://i.imgur.com/P5s9Jnx.png",
      text:
        "She gave me a bowl, told me to go catch a few, and said that while I was out she would prepare their new home. Off I went.",
      interactiveWords: ["bowl", "few", "home"],
    },
    {
      image: "https://i.imgur.com/SnBUcf5.png",
      text:
        "There were so many that they were easy to catch. I filled the bowl and ran home.",
      interactiveWords: ["many", "easy", "ran"],
    },
    {
      image: "https://i.imgur.com/TQJYDOc.png",
      text:
        'When I got home, my mother had an old fish bowl filled with water sitting on the corner of my desk. She asked to see the fish, looked, and with a big smile said, “Tadpoles. – Wow! You are in for a surprise.”',
      interactiveWords: ["home", "mother", "fish", "smile", "surprise"],
    },
    {
      image: "https://i.imgur.com/TQJYDOc.png",
      text:
        "I asked what she meant and she just said that I would have to wait and see, but to watch my fish carefully.",
      interactiveWords: ["see", "fish"],
    },
    {
      image: "https://i.imgur.com/vfROXNN.png",
      text:
        'After a few weeks, I noticed some were changing. “Mom,” I yelled with excitement. “Come here, my fish are growing legs.” She came into my room, looked, smiled, and told me to keep watching.',
      interactiveWords: ["few", "weeks", "Mom", "here", "fish", "legs", "looked", "smiled"],
    },
    {
      image: "https://i.imgur.com/YSEyB8a.png",
      text:
        'After several more weeks, there were more changes. “Mom,” I yelled with excitement. “Come here, my fish are growing front legs and their tail is going away.”',
      interactiveWords: ["weeks", "Mom", "Come"],
    },
    {
      image: "https://i.imgur.com/BNF9d86.png",
      text:
        "A week or so later when I got up, I was amazed. There were more changes. My fish didn’t have tails, their legs were bigger, and they didn’t look like the little black fish I had caught earlier in the Spring.",
      interactiveWords: ["week", "fish", "legs", "little"],
    },
    {
      image: "https://i.imgur.com/akDqrhB.png",
      text:
        'That day, when I returned home from school, is when I yelled out, “I found a frog on my bed.”',
      interactiveWords: ["school", "bed", "frog"],
    },
    {
      image: "https://i.imgur.com/akDqrhB.png",
      text:
        '“Surprise,” yelled mom. “You watched a miracle right before your eyes. A fish changed into a frog.”',
      interactiveWords: ["mom", "eyes", "fish", "frog"],
    },
    {
      image: "https://i.imgur.com/v3hnEYs.png",
      text: "Off I went.",
      interactiveWords: [],
    },
  ],
};

/** ---------- Auslan video mapping ---------- */
const auslanVideos = {
  frog:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/32/32980.mp4",
  school:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/31/31820.mp4",
  bedroom: "https://www.w3schools.com/html/mov_bbb.mp4",
  mother:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/23/23491_1.mp4",
  nature: "https://www.w3schools.com/html/mov_bbb.mp4",
  fish:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/34/34710.mp4",
  pond: "https://www.w3schools.com/html/mov_bbb.mp4",
  pet:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/45/45810_1.mp4",
  responsibility:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/41/41871_1.mp4",
  bowl:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/46/46290_1.mp4",
  few:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/63/63630_1.mp4",
  home:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/33/33390_1.mp4",
  many:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/30/30260_1.mp4",
  easy:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/59/5960.mp4",
  ran:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/59/59080_1.mp4",
  smile:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/63/63590_1.mp4",
  surprise:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/29/29560_1.mp4",
  see:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/55/5510.mp4",
  weeks:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/26/26280_1.mp4",
  here:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/79/7940_1.mp4",
  legs:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/35/35060.mp4",
  looked:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/15/15460_1.mp4",
  mom:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/23/23491_1.mp4",
  come:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/70/7040_1.mp4",
  week:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/26/26280_1.mp4",
  little:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/63/63640_1.mp4",
  eyes:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/52/5210.mp4",
};

/** ---------- Component ---------- */
export default function StoryBook() {
  const [pageIndex, setPageIndex] = useState(-1); // -1 = cover
  const [videoSrc, setVideoSrc] = useState(null);
  const [clickedWord, setClickedWord] = useState(null);
  const [flip, setFlip] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");

  const isCover = pageIndex === -1;

  const leftPage = useMemo(
    () => (isCover ? { cover: true } : storyData.pages[pageIndex]),
    [isCover, pageIndex]
  );
  const rightPage = useMemo(() => {
    if (isCover) return null;
    const nextIdx = pageIndex + 1;
    return nextIdx < storyData.pages.length ? storyData.pages[nextIdx] : null;
  }, [isCover, pageIndex]);

  // 交互词点击（大小写不敏感）
  const handleWordClick = (raw) => {
    const clean = String(raw).replace(/[^a-zA-Z]/g, "");
    const key = clean.toLowerCase();
    setClickedWord(clean);
    const src = auslanVideos[key] || auslanVideos[clean] || null;
    if (src) setVideoSrc(src);
    setTimeout(() => setClickedWord(null), 800);
  };

  // 翻页（修正边界）
  const goNext = () => {
    const total = storyData.pages.length;
    setFlipDirection("next");
    setFlip(true);
    setTimeout(() => {
      if (isCover) {
        setPageIndex(0);
      } else if (pageIndex + 2 < total) {
        setPageIndex(pageIndex + 2);
      } // 否则已是最后一对/最后一页
      setFlip(false);
    }, 300);
  };

  const goPrev = () => {
    setFlipDirection("prev");
    setFlip(true);
    setTimeout(() => {
      if (isCover) {
        setFlip(false);
        return;
      }
      if (pageIndex <= 0) setPageIndex(-1);
      else setPageIndex(pageIndex - 2);
      setFlip(false);
    }, 300);
  };

  const canGoNext = isCover ? storyData.pages.length > 0 : pageIndex + 2 < storyData.pages.length;
  const canGoPrev = !isCover;

  // 键盘快捷键
  useEffect(() => {
    const onKey = (e) => {
      if (videoSrc) {
        if (e.key === "Escape") setVideoSrc(null);
        return;
      }
      if (e.key === "ArrowRight") canGoNext && goNext();
      if (e.key === "ArrowLeft") canGoPrev && goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGoNext, canGoPrev, videoSrc, pageIndex, isCover]);

  const flipStyle = flip
    ? {
        transform: flipDirection === "next" ? "rotateY(-180deg)" : "rotateY(180deg)",
        transition: "transform 0.3s ease",
      }
    : { transform: "rotateY(0deg)", transition: "transform 0.3s ease" };

  // 子页面
  const Page = ({ page, bg }) => {
    if (!page) return <div style={{ flex: 1 }} />;
    if (page.cover) {
      return (
        <div
          style={{
            flex: 1,
            padding: "1rem",
            textAlign: "center",
            background: "#FFE0B2",
            borderRadius: "10px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
            minHeight: 420,
          }}
        >
          <img src={storyData.cover} alt="Cover" style={{ maxWidth: "80%", borderRadius: 8 }} />
          <h2 style={{ marginTop: "1rem", color: "#333" }}>{storyData.title}</h2>
          <p style={{ color: "#6b4e16" }}>Click “Next” or press → to start</p>
        </div>
      );
    }

    const interactiveSet = new Set((page.interactiveWords || []).map((w) => String(w).toLowerCase()));

    return (
      <div
        style={{
          flex: 1,
          padding: "1rem",
          textAlign: "center",
          background: bg,
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          minHeight: 420,
        }}
      >
        <img src={page.image} alt="Page" style={{ maxWidth: "100%", borderRadius: "10px" }} />
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "0.6rem", color: "#333" }}>
          {page.text.split(" ").map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "");
            const lower = cleanWord.toLowerCase();
            if (interactiveSet.has(lower)) {
              const isClicked = clickedWord === cleanWord;
              return (
                <span
                  key={i}
                  onClick={() => handleWordClick(cleanWord)}
                  className={`interactive-word ${isClicked ? "clicked" : ""}`}
                  style={{
                    color: "#00796B",
                    cursor: "pointer",
                    marginRight: "0.2rem",
                    fontWeight: 700,
                    transition: "all .2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#004D40";
                    e.currentTarget.style.transform = "scale(1.2) rotate(-2deg)";
                    e.currentTarget.style.textShadow = "0 0 8px #80CBC4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#00796B";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.textShadow = "none";
                  }}
                >
                  {word}{" "}
                </span>
              );
            }
            return <span key={i}>{word} </span>;
          })}
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Comic Sans MS', cursive", perspective: "1200px" }}>
      {/* 书本 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          gap: 12,
          marginTop: "4rem",
          ...flipStyle,
        }}
      >
        <Page page={leftPage} bg="#E0F7FA" />
        <Page page={rightPage} bg="#FFF3E0" />
      </div>

      {/* 导航 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
          maxWidth: 600,
          marginInline: "auto",
          gap: 20,
          padding: "20px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button 
          onClick={goPrev} 
          disabled={!canGoPrev}
          style={{
            padding: "12px 24px",
            borderRadius: "25px",
            border: "none",
            background: canGoPrev 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
            color: canGoPrev ? "white" : "#999",
            fontWeight: "600",
            fontSize: "14px",
            cursor: canGoPrev ? "pointer" : "not-allowed",
            boxShadow: canGoPrev 
              ? "0 8px 20px rgba(102, 126, 234, 0.3)" 
              : "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
            fontFamily: "'Inter', sans-serif",
            minWidth: "90px",
          }}
          onMouseEnter={(e) => {
            if (canGoPrev) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(102, 126, 234, 0.4)";
              e.currentTarget.style.background = "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (canGoPrev) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            }
          }}
        >
          ← Previous
        </button>
        <span 
          style={{ 
            color: "#555", 
            fontWeight: "500",
            fontSize: "14px",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          {isCover
            ? "📖 Cover Page"
            : `📄 Page ${pageIndex + 1}${rightPage ? "-" + (pageIndex + 2) : ""} of ${
                storyData.pages.length
              }`}
        </span>
        <button 
          onClick={goNext} 
          disabled={!canGoNext}
          style={{
            padding: "12px 24px",
            borderRadius: "25px",
            border: "none",
            background: canGoNext 
              ? "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" 
              : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
            color: canGoNext ? "#8b4513" : "#999",
            fontWeight: "600",
            fontSize: "14px",
            cursor: canGoNext ? "pointer" : "not-allowed",
            boxShadow: canGoNext 
              ? "0 8px 20px rgba(252, 182, 159, 0.3)" 
              : "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
            fontFamily: "'Inter', sans-serif",
            minWidth: "90px",
          }}
          onMouseEnter={(e) => {
            if (canGoNext) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(252, 182, 159, 0.4)";
              e.currentTarget.style.background = "linear-gradient(135deg, #fde2c0 0%, #fa9d8d 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (canGoNext) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(252, 182, 159, 0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
            }
          }}
        >
          Next →
        </button>
      </div>

      {/* 视频弹窗 */}
      {videoSrc && (
        <div
          onClick={() => setVideoSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", textAlign: "center" }}
          >
            <button
              onClick={() => setVideoSrc(null)}
              aria-label="Close video"
              style={{
                position: "absolute",
                top: "-45px",
                right: "-45px",
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "18px",
                boxShadow: "0 6px 20px rgba(238, 90, 36, 0.3)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1) rotate(90deg)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(238, 90, 36, 0.5)";
                e.currentTarget.style.background = "linear-gradient(135deg, #ff5252 0%, #d63031 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(238, 90, 36, 0.3)";
                e.currentTarget.style.background = "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)";
              }}
            >
              ✕
            </button>
            <video
              src={videoSrc}
              controls
              autoPlay
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                background: "#000",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
