import React, { useEffect, useMemo, useState } from "react";

/* ----------------------------------------------------------------
   BOOK LIST (DATA)
   TEAM NOTE:
   - Add new books by pushing objects into the `books` array below.
   - Each book requires: id (string), title (string), cover (URL),
     and pages (array). Each page needs: image (URL), text (string),
     and optional interactiveWords (array of keywords to trigger Auslan videos).
   - Keep covers hosted reliably; if a cover fails to load, a placeholder appears.
------------------------------------------------------------------*/
const API_URLS = {
  frog: import.meta.env.VITE_BOOK1_API_URL || "https://auslan-backend.onrender.com/book1/",
  puppy: import.meta.env.VITE_BOOK2_API_URL || "https://auslan-backend.onrender.com/book2/",
  tree: null  // No API endpoint for this book yet
};

const books = [
  // Book 1: Existing "I Found a Frog."
  {
    id: "frog",
    title: "I Found a Frog.",
    cover: "https://i.imgur.com/lSLaM0x.png",
    pages: [
      { image: "https://i.imgur.com/fEtytpr.png",
        text:
          "Even though I have grandchildren of my own, it seems like it was only yesterday when I returned home from school to find a frog in my bedroom.",
        interactiveWords: ["frog", "school", "bedroom"], },
      { image: "https://i.imgur.com/RPSGWGD.png",
        text:
          'My mother just chuckled when I yelled out, "I found a frog on my bed." Now, she knew that I would eventually find one but she let me discover a wonder of Nature that many people miss.',
        interactiveWords: ["frog", "mother", "nature"], },
      { image: "https://i.imgur.com/rWx1mrm.png",
        text:
          "You see, a little earlier that spring, when I was 6 years old; I saw some little, black fish in a pond. Since I didn't have any pets I went home and asked my mother if I could have one.",
        interactiveWords: ["fish", "pond", "mother"], },
      { image: "https://i.imgur.com/Y40D3nf.png",
        text:
          "After we talked about my catching some of the fish I saw, and the responsibility of having a pet, she agreed.",
        interactiveWords: ["fish", "pet", "responsibility"], },
      { image: "https://i.imgur.com/P5s9Jnx.png",
        text:
          "She gave me a bowl, told me to go catch a few, and said that while I was out she would prepare their new home. Off I went.",
        interactiveWords: ["bowl", "few", "home"], },
      { image: "https://i.imgur.com/SnBUcf5.png",
        text:
          "There were so many that they were easy to catch. I filled the bowl and ran home.",
        interactiveWords: ["many", "easy", "ran"], },
      { image: "https://i.imgur.com/TQJYDOc.png",
        text:
          'When I got home, my mother had an old fish bowl filled with water sitting on the corner of my desk. She asked to see the fish, looked, and with a big smile said, "Tadpoles. – Wow! You are in for a surprise."',
        interactiveWords: ["home", "mother", "fish", "smile", "surprise"], },
      { image: "https://i.imgur.com/TQJYDOc.png",
        text:
          "I asked what she meant and she just said that I would have to wait and see, but to watch my fish carefully.",
        interactiveWords: ["see", "fish"], },
      { image: "https://i.imgur.com/vfROXNN.png",
        text:
          'After a few weeks, I noticed some were changing. "Mom," I yelled with excitement. "Come here, my fish are growing legs." She came into my room, looked, smiled, and told me to keep watching.',
        interactiveWords: ["few", "weeks", "mom", "here", "fish", "legs", "looked", "smiled"], },
      { image: "https://i.imgur.com/YSEyB8a.png",
        text:
          'After several more weeks, there were more changes. "Mom," I yelled with excitement. "Come here, my fish are growing front legs and their tail is going away."',
        interactiveWords: ["weeks", "mom", "come"], },
      { image: "https://i.imgur.com/BNF9d86.png",
        text:
          "A week or so later when I got up, I was amazed. There were more changes. My fish didn't have tails, their legs were bigger, and they didn't look like the little black fish I had caught earlier in the Spring.",
        interactiveWords: ["week", "fish", "legs", "little"], },
      { image: "https://i.imgur.com/akDqrhB.png",
        text:
          'That day, when I returned home from school, is when I yelled out, "I found a frog on my bed."',
        interactiveWords: ["school", "bed", "frog"], },
      { image: "https://i.imgur.com/akDqrhB.png",
        text:
          '"Surprise," yelled mom. "You watched a miracle right before your eyes. A fish changed into a frog."',
        interactiveWords: ["mom", "eyes", "fish", "frog"], },
      { image: "https://i.imgur.com/v3hnEYs.png",
        text: "Off I went.",
        interactiveWords: [], },
    ],
  },

  // Book 2: Sample placeholder (replace with real content/cover)
  {
  title: "Baba the Monkey and Lexa the Tiger",
  cover: "https://i.imgur.com/ZjL7ucN.png",
  pages: [
    {
      image: "https://i.imgur.com/dIoYLpc.png",
      text: "Sophie and Ashley have a new friend. His name is Baba, the Monkey. Sometimes he can be very naughty. But he is really a very nice monkey. Today, he meets two new friends.",
      interactiveWords: ["friend", "Monkey", "nice", "two"]
    },
    {
      image: "https://i.imgur.com/ss8jDSJ.png",
      text: "Sophie walks with Baba down the street towards Josh’s house. Well, Sophie is walking. But Baba does not walk. He likes to run and jump and do cartwheels down the pavement.",
      interactiveWords: ["street", "house", "jump"]
    },
    {
      image: "https://i.imgur.com/JJrMulb.png",
      text: "Sophie knocks on Josh’s front door. Hmmm! No answer. “I wonder if Josh is in the garden behind his house.” says Sophie. Baba is still doing cartwheels on the pavement.",
      interactiveWords: ["knock", "garden", "house"]
    },
    {
      image: "https://i.imgur.com/pHpXMu5.png",
      text: "“Come on, Baba.” says Sophie. She and Baba walk around to the garden behind Josh’s house. Hmmm! No Josh. But Sophie hears Josh’s voice. She looks up; his bedroom window is open.",
      interactiveWords: ["garden", "voice", "bedroom", "open"]
    },
    {
      image: "https://i.imgur.com/gKM0KYX.png",
      text: "“Josh!” shouts Sophie. “Josh!” For once Baba stops running and jumping and doing cartwheels. He stands still and looks up at the window. The voice from Josh’s bedroom stops.",
      interactiveWords: ["bedroom", "voice", "shouts", "stops"]
    },
    {
      image: "https://i.imgur.com/zeS7vLc.png",
      text: "There he is! Josh pops his head out of his bedroom window. “Hi Sophie,” says Josh. “Who is your new friend?” “This is Baba.” answers Sophie. “Do you want to come out and play?”",
      interactiveWords: ["bedroom", "window", "friend"]
    },
    {
      image: "https://i.imgur.com/4KMQjqF.png",
      text: "“I can’t,” says Josh. “I have a problem in my bedroom.” “What is it?” asks Sophie. She and Baba both look up at Josh. “I have an invisible tiger in my room!”",
      interactiveWords: ["problem", "bedroom", "room"]
    },
    {
      image: "https://i.imgur.com/pK87BL5.png",
      text: "“What!” say Sophie and Baba at the same time. “It’s true,” says Josh. “Come on up. The back door is open.” So Sophie and Baba go through the back door of Josh’s house. They go upstairs to his bedroom.",
      interactiveWords: ["time", "house", "bedroom", "open"]
    },
    {
      image: "https://i.imgur.com/ewwlvWi.png",
      text: "Sophie knocks on Josh’s bedroom door. He opens the door and says, “Quick! Come in fast!” Sophie and Baba go into Josh’s bedroom and he closes the door quickly.",
      interactiveWords: ["knocks", "bedroom", "fast", "Quick"]
    },
    {
      image: "https://i.imgur.com/Mr9UtOo.png",
      text: "Sophie says, “Josh - this is Baba. Baba - this is Josh.” Then she asks, “Why do we have to come in quickly?” “I don’t want the tiger to escape,” answers Josh.",
      interactiveWords: ["Why"]
    },
    {
      image: "https://i.imgur.com/6kV1jaW.png",
      text: "Sophie and Baba look at each other. Then they start to laugh. “Josh,” says Sophie. “Are you sure you’re okay? There’s no tiger in here.” Suddenly they hear a roar!",
      interactiveWords: ["laugh", "look", "laugh"]
    },
    {
      image: "https://i.imgur.com/YsciMt8.png",
      text: "“I am Lexa, the Tiger.” says a voice. Sophie and Baba are scared. They jump back. Their mouths and their eyes are wide open. “See,” says Josh. “There is a tiger in my bedroom.”",
      interactiveWords: ["voice", "scared", "jump", "See", "bedroom"]
    },
    {
      image: "https://i.imgur.com/0RVkOfM.png",
      text: "“And not just any tiger,” says Lexa. “I am a special tiger.” “Why are you special?” asks Baba. “And how do we know you’re a tiger?” says Sophie. “We can’t even see you.”",
      interactiveWords: ["Why", "see"]
    },
    {
      image: "https://i.imgur.com/F6tSoIv.png",
      text: "“Don’t make her angry!” says Josh. “She is already in a bad mood.” Lexa roars again. Josh and Sophie and Baba all take a step backwards. They are scared.",
      interactiveWords: ["angry", "roars", "scared"]
    },
    {
      image: "https://i.imgur.com/aE9J4ki.png",
      text: "“So you want to see me?” asks Lexa. “Watch this!” And suddenly, there she is, standing in Josh’s bedroom; a very pretty tiger with beautiful stripes.",
      interactiveWords: ["see", "beautiful", "bedroom", "stripes"]
    },
    {
      image: "https://i.imgur.com/Ik9rhVu.png",
      text: "Sophie and Baba and Josh all say, “Wow!” Lexa is pretty, but she is not happy. “Why are you in a bad mood?” asks Sophie. “Because my paw hurts,” answers Lexa.",
      interactiveWords: ["asks", "and"]
    },
    {
      image: "https://i.imgur.com/KB9DXFs.png",
      text: "“Let me see,” says Sophie. Lexa puts out her paw and Sophie holds it. Sophie looks very closely at Lexa’s paw. “I think I see the problem,” says Sophie. “It’s a thorn.",
      interactiveWords: ["see", "holds", "problem"]
    },
    {
      image: "https://i.imgur.com/hBzAbpV.png",
      text: "“A thorn?” asks Lexa. “I can help you,” says Sophie. She has small fingers so she can easily pull out the thorn. “Is that better now?” asks Sophie. “Yes,” answers Lexa. “Thank you so much!”",
      interactiveWords: ["help", "fingers", "better", "Thank"]
    },
    {
      image: "https://i.imgur.com/B7JCHEs.png",
      text: "So now there is a new friend on the street. Sophie and Josh are so excited. They want to show their new friend Lexa to their other friend, Tom. They hope Lexa does not become invisible again!",
      interactiveWords: ["friend", "new", "now"]
    }
  ]
},

  // Book 3: Sample placeholder
  {
    id: "tree",
    title: "The Magic Tree",
    cover: "https://i.imgur.com/qV7B0bL.png",
    pages: [
      { image: "https://i.imgur.com/6v9YvQq.png", text: "There was a tree that whispered in the wind.", interactiveWords: ["tree", "wind"] },
      { image: "https://i.imgur.com/6v9YvQq.png", text: "Every whisper taught a new word in Auslan.", interactiveWords: ["auslan", "word"] },
      { image: "https://i.imgur.com/6v9YvQq.png", text: "Kids gathered to learn and play happily.", interactiveWords: ["learn", "play"] },
    ],
  },
];

export default function StoryBook() {
  /* ----------------------- VIDEO DATA FROM BACKEND ------------------------ */
  const [auslanVideos, setAuslanVideos] = useState({});
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState("");

  // Fetch videos from backend API on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideosLoading(true);
        setVideosError("");
        
        const videoMapping = {};
        
        // Fetch videos for all books with API endpoints
        for (const [bookId, apiUrl] of Object.entries(API_URLS)) {
          if (!apiUrl) continue;
          
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch videos for ${bookId}`);
          }
          
          const videos = await response.json();
          
          // Create a mapping from filename (without extension) to video URL
          videos.forEach(video => {
          if (video.filename && video.url) {
            // Extract filename without extension and convert to lowercase
            const key = video.filename
              .replace(/\.[^/.]+$/, "") // Remove file extension
              .toLowerCase()
              .replace(/[^a-z0-9]/g, ""); // Remove special characters, keep only alphanumeric
            
            videoMapping[key] = video.url;
          }
        });
        
        setAuslanVideos(videoMapping);
        console.log("Loaded video mapping:", videoMapping);
        
      } }catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideosError(error.message);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /* ----------------------- BOOKSHELF / READER TOGGLE -----------------------
     - selectedBookIndex === null → show bookshelf
     - selectedBookIndex !== null → show reader for that book
  --------------------------------------------------------------------------*/
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const currentBook = selectedBookIndex == null ? null : books[selectedBookIndex];

  /* --------------------------- READER STATE -------------------------------
     - pageIndex: -1 means cover page
     - videoSrc: current Auslan video (if any)
     - flip/flipDirection: small page flip animation
  --------------------------------------------------------------------------*/
  const [pageIndex, setPageIndex] = useState(-1);
  const [videoSrc, setVideoSrc] = useState(null);
  const [clickedWord, setClickedWord] = useState(null);
  const [flip, setFlip] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");

  // When switching books, reset reading state
  useEffect(() => {
    setPageIndex(-1);
    setVideoSrc(null);
    setClickedWord(null);
  }, [selectedBookIndex]);

  const isCover = pageIndex === -1;

  // Compute left and right pages for the two-page layout
  const leftPage = useMemo(
    () => (!currentBook ? null : isCover ? { cover: true } : currentBook.pages[pageIndex]),
    [currentBook, isCover, pageIndex]
  );
  const rightPage = useMemo(() => {
    if (!currentBook || isCover) return null;
    const nextIdx = pageIndex + 1;
    return nextIdx < currentBook.pages.length ? currentBook.pages[nextIdx] : null;
  }, [currentBook, isCover, pageIndex]);

  // Handle interactive word clicks → open Auslan video if mapped
  const handleWordClick = (raw) => {
    if (videosLoading) {
      console.log("Videos still loading, please wait...");
      return;
    }

    const clean = String(raw).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    setClickedWord(raw);
    
    // Look for video URL in the fetched data
    const videoUrl = auslanVideos[clean];
    
    if (videoUrl) {
      console.log(`Found video for "${clean}":`, videoUrl);
      setVideoSrc(videoUrl);
    } else {
      console.log(`No video found for "${clean}". Available videos:`, Object.keys(auslanVideos));
    }
    
    setTimeout(() => setClickedWord(null), 800);
  };

  // Next / Previous page with bounds and small flip animation
  const goNext = () => {
    if (!currentBook) return;
    const total = currentBook.pages.length;
    setFlipDirection("next");
    setFlip(true);
    setTimeout(() => {
      if (isCover) {
        setPageIndex(0);
      } else if (pageIndex + 2 < total) {
        setPageIndex(pageIndex + 2);
      }
      setFlip(false);
    }, 300);
  };

  const goPrev = () => {
    if (!currentBook) return;
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

  const canGoNext = currentBook ? (isCover ? currentBook.pages.length > 0 : pageIndex + 2 < currentBook.pages.length) : false;
  const canGoPrev = currentBook ? !isCover : false;

  // Keyboard shortcuts (← → to navigate, Esc to close video)
  useEffect(() => {
    const onKey = (e) => {
      if (!currentBook) return;
      if (videoSrc) {
        if (e.key === "Escape") setVideoSrc(null);
        return;
      }
      if (e.key === "ArrowRight") canGoNext && goNext();
      if (e.key === "ArrowLeft") canGoPrev && goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentBook, canGoNext, canGoPrev, videoSrc, pageIndex, isCover]);

  // Flip style for the two-page container
  const flipStyle = flip
    ? {
        transform: flipDirection === "next" ? "rotateY(-180deg)" : "rotateY(180deg)",
        transition: "transform 0.3s ease",
      }
    : { transform: "rotateY(0deg)", transition: "transform 0.3s ease" };

  /* ---------------------------- PAGE COMPONENT ---------------------------- */
  const Page = ({ page, bg }) => {
    if (!page) return <div style={{ flex: 1 }} />;
    if (page.cover) {
  return (
    <div
      style={{
        flex: 1,
        padding: "1rem",
        textAlign: "center",
        background: bg,           
        borderRadius: "16px",
        boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
        minHeight: 420,
      }}
    >
      <img 
        src={currentBook.cover} 
        alt="Cover" 
        style={{ maxWidth: "100%", borderRadius: "12px" }} 
      />
      <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "0.6rem", color: "#333" }}>
        <strong>{currentBook.title}</strong><br />
        Click “Next” or press → to start your story!
      </p>
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
          borderRadius: "16px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
          minHeight: 420,
        }}
      >
        <img src={page.image} alt="Page" style={{ maxWidth: "100%", borderRadius: "12px" }} />
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "0.6rem", color: "#333" }}>
          {page.text.split(" ").map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "");
            const lower = cleanWord.toLowerCase();
            if (interactiveSet.has(lower)) {
              const isClicked = clickedWord === cleanWord;
              const hasVideo = auslanVideos[cleanWord.toLowerCase().replace(/[^a-z0-9]/g, "")];
              
              return (
                <span
                  key={i}
                  onClick={() => hasVideo ? handleWordClick(cleanWord) : null}
                  style={{
                    color: hasVideo ? "#00796B" : "#333",
                    cursor: hasVideo ? (videosLoading ? "wait" : "pointer") : "default",
                    marginRight: "0.2rem",
                    fontWeight: hasVideo ? 700 : "normal",
                    transition: hasVideo ? "all .2s" : "none",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (hasVideo && !videosLoading) {
                      e.currentTarget.style.color = "#004D40";
                      e.currentTarget.style.transform = "scale(1.1) rotate(-2deg)";
                      e.currentTarget.style.textShadow = "0 0 8px #80CBC4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hasVideo) {
                      e.currentTarget.style.color = "#00796B";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.textShadow = "none";
                    }
                  }}
                  title={hasVideo ? (videosLoading ? "Loading videos..." : "Click to watch Auslan video") : undefined}
                  className={hasVideo && isClicked ? "clicked" : ""}
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

  /* ----------------------- COVER IMAGE WITH FALLBACK ---------------------- */
  const CoverImage = ({ src, alt }) => {
    const [error, setError] = useState(false);
    if (error || !src) {
      return (
        <div
          style={{
            height: 300,
            borderRadius: 12,
            background: "repeating-linear-gradient(45deg,#fff6e9,#fff6e9 10px,#ffe9cc 10px,#ffe9cc 20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d6e63",
            fontWeight: 700,
          }}
        >
          Cover unavailable
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12 }}
      />
    );
  };

  /* ------------------------------ BOOKSHELF ------------------------------- */
  const BookShelf = () => {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #fffdf6 0%, #fff3e0 100%)",
          minHeight: "100vh",
          padding: "2.5rem 1rem 3.5rem",
          fontFamily: "'Comic Sans MS', cursive",
        }}
      >
        {/* Top description card */}
        <div
          style={{
            background: "linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%)",
            borderRadius: "22px",
            padding: "2rem 1.2rem",
            margin: "0 auto 2rem",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            maxWidth: 900,
          }}
        >
          <h1 style={{ color: "#4e2a0b", marginBottom: "0.6rem", letterSpacing: ".5px" }}>
            🐸 Story Time with Auslan!
          </h1>
          <p style={{ color: "#5d4037", fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
            Explore our interactive storybooks to learn Auslan words while reading fun tales.
            Click a story below to begin your journey. 💬✨
          </p>
          
          {/* Video loading status */}
          {videosLoading && (
            <div style={{ marginTop: "1rem", color: "#8d6e63", fontSize: "0.9rem" }}>
              📼 Loading Auslan videos...
            </div>
          )}
          {videosError && (
            <div style={{ marginTop: "1rem", color: "#d32f2f", fontSize: "0.9rem" }}>
              ⚠️ Error loading videos: {videosError}
            </div>
          )}
          {!videosLoading && !videosError && (
            <div style={{ marginTop: "1rem", color: "#388e3c", fontSize: "0.9rem" }}>
              ✅ {Object.keys(auslanVideos).length} Auslan videos loaded
            </div>
          )}
        </div>

        {/* Responsive grid of book cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {books.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setSelectedBookIndex(idx)}
              disabled={videosLoading}
              style={{
                border: "none",
                background: videosLoading 
                  ? "linear-gradient(180deg,#f5f5f5,#e0e0e0)" 
                  : "linear-gradient(180deg,#fff8e1,#ffe0b2)",
                borderRadius: 20,
                boxShadow: "0 10px 24px rgba(0,0,0,.12)",
                cursor: videosLoading ? "wait" : "pointer",
                overflow: "hidden",
                padding: 14,
                transition: "transform .22s ease, box-shadow .22s ease",
                textAlign: "center",
                opacity: videosLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!videosLoading) {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 16px 34px rgba(0,0,0,.16)";
                }
              }}
              onMouseLeave={(e) => {
                if (!videosLoading) {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,.12)";
                }
              }}
            >
              <CoverImage src={b.cover} alt={b.title} />
              <div style={{ marginTop: 10, fontWeight: 800, color: "#6b4e16", fontSize: "1.05rem" }}>
                {b.title}
              </div>
              <div style={{ fontSize: 12, color: "#8d6e63" }}>
                {b.pages.length} pages
                {videosLoading && " • Loading videos..."}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ------------------------------ RENDER --------------------------------- */
  if (currentBook == null) {
    return <BookShelf />;
  }

  // Reader view
  return (
  <div 
    style={{ 
      padding: "2rem", 
      fontFamily: "'Comic Sans MS', cursive", 
      perspective: "1200px",
      transform: "scale(0.85)",        // 👈 整体缩小
      transformOrigin: "top center",   // 👈 缩放中心设在上方中间
      transition: "transform 0.3s ease"// 👈 平滑缩放
    }}
  >
    {/* Two-page book area */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        transformStyle: "preserve-3d",
        gap: 14,
        marginTop: "4rem",
        ...flipStyle,
      }}
    >
      <Page page={leftPage} bg="#E0F7FA" />
      <Page page={rightPage} bg="#FFF3E0" />
    </div>


      {/* Navigation bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
          maxWidth: 820,
          marginInline: "auto",
          gap: 12,
          padding: "16px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.92) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 14px 34px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Back to bookshelf */}
        <button
          onClick={() => setSelectedBookIndex(null)}
          style={{
            padding: "10px 16px",
            borderRadius: 20,
            border: "none",
            background: "linear-gradient(135deg,#ffd3a5,#fd6585)",
            color: "#4e2a0b",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ⬅ Back to Bookshelf
        </button>

        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          style={{
            padding: "12px 20px",
            borderRadius: "25px",
            border: "none",
            background: canGoPrev
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
            color: canGoPrev ? "white" : "#999",
            fontWeight: "700",
            fontSize: "14px",
            cursor: canGoPrev ? "pointer" : "not-allowed",
            boxShadow: canGoPrev
              ? "0 8px 20px rgba(102, 126, 234, 0.3)"
              : "0 4px 10px rgba(0, 0, 0, 0.1)",
            minWidth: 110,
          }}
        >
          ← Previous
        </button>

        <span
          style={{
            color: "#555",
            fontWeight: "700",
            fontSize: "14px",
            padding: "8px 14px",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          {isCover
            ? `📖 ${currentBook.title} — Cover`
            : `📄 Page ${pageIndex + 1}${rightPage ? "-" + (pageIndex + 2) : ""} / ${currentBook.pages.length}`}
        </span>

        <button
          onClick={goNext}
          disabled={!canGoNext}
          style={{
            padding: "12px 20px",
            borderRadius: "25px",
            border: "none",
            background: canGoNext
              ? "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
              : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
            color: canGoNext ? "#8b4513" : "#999",
            fontWeight: "700",
            fontSize: "14px",
            cursor: canGoNext ? "pointer" : "not-allowed",
            boxShadow: canGoNext
              ? "0 8px 20px rgba(252, 182, 159, 0.3)"
              : "0 4px 10px rgba(0, 0, 0, 0.1)",
            minWidth: 110,
          }}
        >
          Next →
        </button>
      </div>

      {/* Video modal */}
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
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", textAlign: "center" }}>
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
