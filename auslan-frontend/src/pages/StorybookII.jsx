const { useState } = React;

// Book 2 story data
const storyData = {
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
};

// Mapping of interactive words to Auslan video URLs (sample set, replace with real ones)
const auslanVideos = {
  friend: "https://www.w3schools.com/html/mov_bbb.mp4",
  naughty: "https://www.w3schools.com/html/mov_bbb.mp4",
  nice: "https://www.w3schools.com/html/mov_bbb.mp4",
  street: "https://www.w3schools.com/html/mov_bbb.mp4",
  house: "https://www.w3schools.com/html/mov_bbb.mp4",
  run: "https://www.w3schools.com/html/mov_bbb.mp4",
  jump: "https://www.w3schools.com/html/mov_bbb.mp4",
  pavement: "https://www.w3schools.com/html/mov_bbb.mp4",
  door: "https://www.w3schools.com/html/mov_bbb.mp4",
  garden: "https://www.w3schools.com/html/mov_bbb.mp4",
  bedroom: "https://www.w3schools.com/html/mov_bbb.mp4",
  window: "https://www.w3schools.com/html/mov_bbb.mp4",
  voice: "https://www.w3schools.com/html/mov_bbb.mp4",
  problem: "https://www.w3schools.com/html/mov_bbb.mp4",
  room: "https://www.w3schools.com/html/mov_bbb.mp4",
  fast: "https://www.w3schools.com/html/mov_bbb.mp4",
  escape: "https://www.w3schools.com/html/mov_bbb.mp4",
  laugh: "https://www.w3schools.com/html/mov_bbb.mp4",
  tiger: "https://www.w3schools.com/html/mov_bbb.mp4",
  roar: "https://www.w3schools.com/html/mov_bbb.mp4",
  scared: "https://www.w3schools.com/html/mov_bbb.mp4",
  eyes: "https://www.w3schools.com/html/mov_bbb.mp4",
  special: "https://www.w3schools.com/html/mov_bbb.mp4",
  see: "https://www.w3schools.com/html/mov_bbb.mp4",
  angry: "https://www.w3schools.com/html/mov_bbb.mp4",
  roars: "https://www.w3schools.com/html/mov_bbb.mp4",
  pretty: "https://www.w3schools.com/html/mov_bbb.mp4",
  stripes: "https://www.w3schools.com/html/mov_bbb.mp4",
  happy: "https://www.w3schools.com/html/mov_bbb.mp4",
  paw: "https://www.w3schools.com/html/mov_bbb.mp4",
  hurts: "https://www.w3schools.com/html/mov_bbb.mp4",
  problem: "https://www.w3schools.com/html/mov_bbb.mp4",
  thorn: "https://www.w3schools.com/html/mov_bbb.mp4",
  help: "https://www.w3schools.com/html/mov_bbb.mp4",
  fingers: "https://www.w3schools.com/html/mov_bbb.mp4",
  better: "https://www.w3schools.com/html/mov_bbb.mp4",
  thank: "https://www.w3schools.com/html/mov_bbb.mp4",
  excited: "https://www.w3schools.com/html/mov_bbb.mp4"
};

// ⬇️ StoryBook component is the same as Book 1, no changes needed
function StoryBook() {
  const [pageIndex, setPageIndex] = useState(-1);
  const [videoSrc, setVideoSrc] = useState(null);
  const [clickedWord, setClickedWord] = useState(null);
  const [flip, setFlip] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");

  const isCover = pageIndex === -1;
  const leftPage = isCover ? { cover: true } : storyData.pages[pageIndex];
  const rightPage =
    !isCover && pageIndex + 1 < storyData.pages.length
      ? storyData.pages[pageIndex + 1]
      : null;

  const handleWordClick = (word) => {
    setClickedWord(word);
    const src = auslanVideos[word];
    if (src) setVideoSrc(src);
    setTimeout(() => setClickedWord(null), 800);
  };

  const goNext = () => {
    if (pageIndex < storyData.pages.length - 1) {
      setFlipDirection("next");
      setFlip(true);
      setTimeout(() => {
        setPageIndex(isCover ? 0 : pageIndex + 2);
        setFlip(false);
      }, 500);
    }
  };

  const goPrev = () => {
    if (pageIndex > -1) {
      setFlipDirection("prev");
      setFlip(true);
      setTimeout(() => {
        setPageIndex(pageIndex <= 1 ? -1 : pageIndex - 2);
        setFlip(false);
      }, 500);
    }
  };

  const flipStyle = flip
    ? {
        transform: flipDirection === "next" ? "rotateY(-180deg)" : "rotateY(180deg)",
        transition: "transform 0.5s ease"
      }
    : { transform: "rotateY(0deg)", transition: "transform 0.5s ease" };

  const Page = ({ page, bg }) => {
    if (!page) return <div style={{ flex: 1 }}></div>;
    if (page.cover) {
      return (
        <div style={{
          flex: 1, padding: "1rem", textAlign: "center",
          background: "#FFE0B2", borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.3)"
        }}>
          <img src={storyData.cover} alt="Cover" style={{ maxWidth: "80%" }} />
          <h2 style={{ marginTop: "1rem", color: "#333" }}>{storyData.title}</h2>
        </div>
      );
    }
    return (
      <div style={{
        flex: 1, padding: "1rem", textAlign: "center",
        background: bg, borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
      }}>
        <img src={page.image} alt="Page" style={{ maxWidth: "100%", borderRadius: "10px" }} />
        <p style={{ fontSize: "1.1rem", lineHeight: "1.5", marginTop: "0.5rem", color: "#333" }}>
          {page.text.split(" ").map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "");
            if (page.interactiveWords.includes(cleanWord)) {
              return (
                <span
                  key={i}
                  onClick={() => handleWordClick(cleanWord)}
                  className={`interactive-word ${clickedWord === cleanWord ? "clicked" : ""}`}
                >
                  {word}{" "}
                </span>
              );
            }
            return word + " ";
          })}
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Comic Sans MS', cursive", perspective: "1200px" }}>
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
          animation: glowHighlight 0.8s ease;
        }
        @keyframes glowHighlight {
          0% { text-shadow: 0 0 5px yellow, 0 0 15px orange; }
          50% { text-shadow: 0 0 15px gold, 0 0 30px orange; }
          100% { text-shadow: none; }
        }
      `}</style>

      <div style={{
        display: "flex", justifyContent: "center",
        transformStyle: "preserve-3d", ...flipStyle
      }}>
        <Page page={leftPage} bg="#E0F7FA" />
        <Page page={rightPage} bg="#FFF3E0" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between",
        marginTop: "1rem", maxWidth: "500px", margin: "0 auto" }}>
        <button onClick={goPrev} disabled={pageIndex <= -1}>Previous</button>
        <span>
          {isCover ? "Cover Page" : `Pages ${pageIndex + 1}${rightPage ? "-" + (pageIndex + 2) : ""} of ${storyData.pages.length}`}
        </span>
        <button onClick={goNext} disabled={pageIndex >= storyData.pages.length - 1}>Next</button>
      </div>

      {videoSrc && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.8)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <button onClick={() => setVideoSrc(null)} style={{
              position: "absolute", top: "-35px", right: "-35px",
              background: "red", color: "white", border: "none",
              borderRadius: "50%", width: "35px", height: "35px",
              cursor: "pointer", fontWeight: "bold", fontSize: "1.2rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}>×</button>
            <video src={videoSrc} controls autoPlay style={{
              maxWidth: "80vw", maxHeight: "80vh",
              borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
            }}/>
          </div>
        </div>
      )}
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(<StoryBook />);
