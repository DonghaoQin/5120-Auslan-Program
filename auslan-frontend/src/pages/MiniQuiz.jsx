import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { letters, numbers } from "../data/letters.js";
import bgImage from "../assets/homebackground.jpg";

const STORAGE_KEY = "LN_LEARNED_V1";


const imgMap = {
  A: "/assets/signs/A.PNG", B: "/assets/signs/B.PNG", C: "/assets/signs/C.PNG",
  D: "/assets/signs/D.PNG", E: "/assets/signs/E.PNG", F: "/assets/signs/F.PNG",
  G: "/assets/signs/G.PNG", H: "/assets/signs/H.PNG", I: "/assets/signs/I.PNG",
  J: "/assets/signs/J.PNG", K: "/assets/signs/K.PNG", L: "/assets/signs/L.PNG",
  M: "/assets/signs/M.PNG", N: "/assets/signs/N.PNG", O: "/assets/signs/O.PNG",
  P: "/assets/signs/P.PNG", Q: "/assets/signs/Q.PNG", R: "/assets/signs/R.PNG",
  S: "/assets/signs/S.PNG", T: "/assets/signs/T.PNG", U: "/assets/signs/U.PNG",
  V: "/assets/signs/V.PNG", W: "/assets/signs/W.PNG", X: "/assets/signs/X.PNG",
  Y: "/assets/signs/Y.PNG", Z: "/assets/signs/Z.PNG",
  0: "/assets/signs/0.PNG", 1: "/assets/signs/1.PNG", 2: "/assets/signs/2.PNG",
  3: "/assets/signs/3.PNG", 4: "/assets/signs/4.PNG", 5: "/assets/signs/5.PNG",
  6: "/assets/signs/6.PNG", 7: "/assets/signs/7.PNG", 8: "/assets/signs/8.PNG", 9: "/assets/signs/9.PNG",
};

// helpers
const sample = (arr, n) => {
  const a = [...arr], out = [];
  while (out.length < n && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
};
const shuffle = (arr) => sample(arr, arr.length);

export default function MiniQuiz() {
  const nav = useNavigate();

  
  const [learned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  
  const [version, setVersion] = useState(0);

  const poolAll = useMemo(() => [...letters, ...numbers], []);

 
  const questions = useMemo(() => {
    const learnedList = poolAll.filter(x => learned.has(x));
    if (learnedList.length === 0) return [];
    const picked = shuffle(learnedList);
    return picked.map((item) => buildQ(item, poolAll));
  }, [poolAll, learned, version]);

  function buildQ(item, pool) {
    const candidates = pool.filter(x => x !== item);
    const distract = candidates.length >= 2 ? sample(candidates, 2) : candidates;
    const options = [...distract, item].sort();
    return {
      prompt: `Which sign is this?`,
      correct: item,
      options,
      mediaLabel: item,
    };
  }

  // ===== UI =====
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

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

  const h1 = { textAlign: "center", margin: "0 0 8px 0", fontSize: "2.3rem", color: "black" };
  const sub = { textAlign: "center", color: "#161515ff", margin: "0 0 18px 0" };

  const panel = {
    maxWidth: 800, margin: "0 auto",
    background: "rgba(255,255,255,.94)",
    border: "1px solid rgba(0,0,0,.06)",
    borderRadius: 16, padding: 18,
    boxShadow: "0 12px 30px rgba(0,0,0,.28)",
  };

  const media = {
    height: 160, display: "grid", placeItems: "center",
    background: "#0d1426", borderRadius: 12, color: "white", marginBottom: 12,
  };

  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };

  const btn = {
    background: "#1b2643", color: "white", border: "1px solid #2b3c6a",
    padding: "12px", borderRadius: 10, cursor: "pointer", width: "100%",
  };

  const hasQuestions = questions.length > 0;
  const q = questions[i];

  const choose = (opt) => {
    const ok = opt === q.correct;
    if (ok) setScore((s) => s + 1);
    if (i + 1 === questions.length) setDone(true);
    else setI((k) => k + 1);
    alert(ok ? "✅ Correct!" : `❌ Incorrect. Answer: ${q.correct}`);
  };

  const restart = () => {
    setI(0);
    setScore(0);
    setDone(false);
    setVersion((v) => v + 1); 
  };

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Mini Quiz</h1>
      <p style={sub}>
        {hasQuestions
          ? `Questions: ${questions.length} (based on your learned items)`
          : "You haven't marked any letters/numbers as learned yet. Go learn a few, then come back!"}
      </p>

      {hasQuestions && !done ? (
      
        <div style={panel}>
          <p style={{ marginTop: 0 }}>Question {i + 1} / {questions.length}</p>

          <div style={media}>
            {q && (
              <img
                src={
                  imgMap[String(q.mediaLabel).toUpperCase()] ||
                  `/assets/signs/${String(q.mediaLabel).toUpperCase()}.PNG`
                }
                alt={`Sign for ${q.mediaLabel}`}
                style={{ maxHeight: 150, maxWidth: "100%" }}
              />
            )}
          </div>

          <div style={grid}>
            {q?.options?.map((opt) => (
              <button key={opt} style={btn} onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
        </div>
      ) : hasQuestions ? (
       
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>Your Score: {score} / {questions.length}</h2>
          <button style={btn} onClick={restart}>Try Again</button>
        </div>
      ) : (
       
        <div style={panel}>
          <button style={btn} onClick={() => nav("/learn/letters-numbers")}>
            Go to Letters & Numbers
          </button>
        </div>
      )}
    </div>
  );
}
