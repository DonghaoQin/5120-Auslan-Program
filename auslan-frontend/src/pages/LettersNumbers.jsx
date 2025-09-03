import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { letters, numbers } from "../data/letters.js";
import bgImage from "../assets/homebackground.jpg";

// ★ 统一的本地存储键
const STORAGE_KEY = "LN_LEARNED_V1";

// ★ 惰性初始化：渲染前从 localStorage 取值，避免首次渲染把“空集合”写回覆盖
export default function LettersNumbers() {
  const nav = useNavigate();

  const [selected, setSelected] = useState(null);
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  // ★ 仅负责写回；读在上面的惰性初始化里完成
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
    } catch (e) {
      console.warn("Failed to persist learned set:", e);
    }
  }, [learned]);

  const all = [...letters, ...numbers];

  const toggle = (val) => {
    setSelected(val);
    setLearned(prev => {
      const n = new Set(prev);
      n.has(val) ? n.delete(val) : n.add(val);
      return n;
    });
  };

// ……下面保持你原有 UI 代码不变即可（来自你的文件）……


  // --- styles ---
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
    padding: "40px 20px 60px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
  };

  const h1 = { textAlign: "center", margin: "0 0 8px 0", fontSize: "2.1rem", color: "black" };
  const sub = { textAlign: "center", color: "#0e0d0dff", margin: "0 0 18px 0" };
  const progress = {
    maxWidth: 960, margin: "0 auto 10px auto",
    height: 12, background: "rgba(31,29,29,.25)", borderRadius: 999, overflow: "hidden",
  };
  const fill = {
    height: "100%",
    width: `${Math.round((learned.size / all.length) * 100)}%`,
    background: "linear-gradient(90deg,#7bc4ff,#70f0c2)",
  };
  const label = { textAlign: "center", color: "#292525ff", fontSize: 12, marginBottom: 18 };

  const panelWrap = {
    maxWidth: 1000,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 20,
  };

  const panel = {
    background: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    padding: 20,
    marginBottom: 20,
    backdropFilter: "blur(8px)"
  };

  const title = { textAlign: "center", fontSize: "1.6rem", marginBottom: 16, color: "#11100aff" };

  const gridLetters = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 };
  const gridNumbers = { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 };

  const card = (on, current) => ({
    background: on ? "linear-gradient(135deg,#70f0c2,#7bc4ff)" : "rgba(255,255,255,.9)",
    color: on ? "#000" : "#333",
    borderRadius: 14,
    height: 70,
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: 22,
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: current ? "0 0 0 3px rgba(112,240,194,.9), 0 6px 16px rgba(0,0,0,.2)" : "0 6px 16px rgba(0,0,0,.2)",
    position: "relative",
  });

  const check = {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 14,
    fontWeight: 900,
    background: "rgba(255,255,255,.9)",
    borderRadius: 999,
    padding: "2px 6px",
    lineHeight: 1,
    color: "#0a0a0a",
  };

  const imageBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

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

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Letters & Numbers</h1>
      <p style={sub}>Tap to mark learned.</p>
      <div style={progress}><div style={fill} /></div>
      <div style={label}>{learned.size}/{all.length} learned</div>

      <div style={panelWrap}>
        <div>
          <div style={panel}>
            <h2 style={title}>Letters (A–Z)</h2>
            <div style={gridLetters}>
              {letters.map(L => (
                <div
                  key={L}
                  style={card(learned.has(L), selected === L)}
                  onClick={() => toggle(L)}
                  title="Click to preview and mark learned"
                >
                  {L}
                  {learned.has(L) && <div style={check}>✓</div>}
                </div>
              ))}
            </div>
          </div>

          <div style={panel}>
            <h2 style={title}>Numbers (0–9)</h2>
            <div style={gridNumbers}>
              {numbers.map(N => (
                <div
                  key={N}
                  style={card(learned.has(N), selected === N)}
                  onClick={() => toggle(N)}
                  title="Click to preview and mark learned"
                >
                  {N}
                  {learned.has(N) && <div style={check}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={panel}>
          <h2 style={title}>Auslan Sign</h2>
          <div style={imageBox}>
            {selected ? (
              <img
                src={imgMap[selected] || "/assets/placeholder.png"}
                alt={`Sign for ${selected}`}
                style={{ maxHeight: "360px", maxWidth: "100%" }}
              />
            ) : (
              <p style={{ color: "#555" }}>Select a letter or number to see the sign</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
