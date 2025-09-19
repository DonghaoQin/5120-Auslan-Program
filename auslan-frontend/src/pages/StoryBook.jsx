// src/pages/StoryBook.jsx
import { useState } from "react";

// ---------------- Story data ----------------
const storyData = {
  title: "I Found a Frog",
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
        "My mother just chuckled when I yelled out, “I found a frog on my bed.” Now, she knew that I would eventually find one but she let me discover a wonder of Nature that many people miss.",
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
  ],
};

// -------------- Word -> video mapping --------------
const auslanVideos = {
  frog:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/32/32980.mp4",
  school:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/31/31820.mp4",
  bedroom: "https://www.w3schools.com/html/mov_bbb.mp4",
  mother:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/mp4video/23/23491_1.mp4",
  Nature: "https://www.w3schools.com/html/mov_bbb.mp4",
  fish:
    "https://object-store.rc.nectar.org.au/v1/AUTH_92e2f9b70316412697cddc6f3ac0ee4e/staticauslanorgau/auslan/34/34710.mp4",
  pond: "https://www.w3schools.com/html/mov_bbb.mp4",
  pet: "https://www.w3schools.com/html/mov_bbb.mp4",
  responsibility: "https://www.w3schools.com/html/mov_bbb.mp4",
};

function StoryBook() {
  const [pageIndex, setPageIndex] = useState(-1); // -1 = cover page
  const [videoSrc, setVideoSrc] = useState(null);
  const [flip, setFlip] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const [clickedWord, setClickedWord] = useState(null);

  const isCover = pageIndex === -1;

  const handleWordClick = (word) => {
    setClickedWord(word);
    const src = auslanVideos[word];
    if (src) setVideoSrc(src);
    setTimeout(() => setClickedWord(null), 600);
  };

  const goNext = () => {
    if (pageIndex < storyData.pages.length - 1) {
      setFlipDirection("next");
      setFlip(true);
      setTimeout(() => {
        setPageIndex(isCover ? 0 : pageIndex + 2);
        setFlip(false);
      }, 400);
    }
  };

  const goPrev = () => {
    if (pageIndex > -1) {
      setFlipDirection("prev");
      setFlip(true);
      setTimeout(() => {
        setPageIndex(pageIndex <= 1 ? -1 : pageIndex - 2);
        setFlip(false);
      }, 400);
    }
  };

  const leftPage = isCover ? { cover: true } : storyData.pages[pageIndex];
  const rightPage =
    !isCover && pageIndex + 1 < storyData.pages.length
      ? storyData.pages[pageIndex + 1]
      : null;

  const flipStyle = flip
    ? {
        transform:
          flipDirection === "next" ? "rotateY(-180deg)" : "rotateY(180deg)",
        transition: "transform 0.4s ease",
      }
    : { transform: "rotateY(0deg)", transition: "transform 0.4s ease" };

  const Page = ({ page }) => {
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
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src={storyData.cover}
            alt="Cover"
            style={{ maxWidth: "80%", height: "auto" }}
          />
          <h2 style={{ marginTop: "1rem", color: "#333" }}>
            {storyData.title}
          </h2>
        </div>
      );
    }

    return (
      <div
        style={{
          flex: 1,
          padding: "1rem",
          textAlign: "center",
          background: "#E0F7FA",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          marginRight: "0.5rem",
        }}
      >
        <img
          src={page.image}
          alt="Page"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
        />
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.5",
            marginTop: "0.5rem",
            color: "#333",
          }}
        >
          {page.text.split(" ").map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "");
            if (page.interactiveWords.includes(cleanWord)) {
              return (
                <span
                  key={`${cleanWord}-${i}`}
                  onClick={() => handleWordClick(cleanWord)}
                  className={`interactive-word ${
                    clickedWord === cleanWord ? "clicked" : ""
                  }`}
                >
                  {word}{" "}
                </span>
              );
            }
            return `${word} `;
          })}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        perspective: "1200px",
      }}
    >
      {/* Styles */}
      <style>{`
        .interactive-word {
          color: #00796B;
          cursor: pointer;
          margin-right: 0.2rem;
          font-weight: bold;
          transition: all 0.2s;
          display: inline-block;
        }
        .interactive-word:hover {
          color: #004D40;
          transform: scale(1.2) rotate(-2deg);
          text-shadow: 0 0 8px #80CBC4;
        }
        .interactive-word.clicked {
          animation: flashHighlight 0.6s ease;
        }
        @keyframes flashHighlight {
          0% { background-color: yellow; }
          50% { background-color: orange; }
          100% { background-color: transparent; }
        }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Book container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          ...flipStyle,
        }}
      >
        <Page page={leftPage} />
        <Page page={rightPage} />
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
          maxWidth: "450px",
          marginInline: "auto",
        }}
      >
        <button onClick={goPrev} disabled={pageIndex <= -1}>
          Previous
        </button>
        <span>
          {isCover
            ? "Cover Page"
            : `Pages ${pageIndex + 1}${
                rightPage ? "-" + (pageIndex + 2) : ""
              } of ${storyData.pages.length}`}
        </span>
        <button
          onClick={goNext}
          disabled={pageIndex >= storyData.pages.length - 1}
        >
          Next
        </button>
      </div>

      {/* Video modal */}
      {videoSrc && (
        <div
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
          <div style={{ position: "relative", textAlign: "center" }}>
            <button
              onClick={() => setVideoSrc(null)}
              style={{
                position: "absolute",
                top: "-35px",
                right: "-35px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              }}
              aria-label="Close video"
              title="Close"
            >
              ×
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
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryBook;
