import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { letters, numbers } from "../data/letters.js";
import bgImage from "../assets/homebackground.jpg";

export default function LettersNumbers() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(null);

  // --- Styles ---
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
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
    color: "white"
  };

  const panelWrap = { 
    maxWidth: 1000, 
    margin: "0 auto", 
    display: "grid", 
    gridTemplateColumns: "1.2fr 1fr",  // 左侧字母/数字，右侧图片
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

  const gridLetters = {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 10,
    marginBottom: 20
  };

  const gridNumbers = {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gap: 8,
  };

  const card = (active) => ({
    background: active ? "linear-gradient(135deg,#70f0c2,#7bc4ff)" : "rgba(255,255,255,.9)",
    color: active ? "#000" : "#333",
    borderRadius: 14,
    height: 70,
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: 22,
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 6px 16px rgba(0,0,0,.2)",
  });

  const imageBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

    // Placeholder mapping for images
  // TODO: Replace each placeholder path with the actual Auslan sign image or video
const imgMap = {
  A: "/assets/signs/A.PNG",  // TODO: replace with Auslan sign for 'A'
  B: "/assets/signs/B.PNG",  // TODO: replace with Auslan sign for 'B'
  C: "/assets/signs/C.PNG",
  D: "/assets/signs/D.PNG",
  E: "/assets/signs/E.PNG",
  F: "/assets/signs/F.PNG",
  G: "/assets/signs/G.PNG",
  H: "/assets/signs/H.PNG",
  I: "/assets/signs/I.PNG",
  J: "/assets/signs/J.PNG",
  K: "/assets/signs/K.PNG",
  L: "/assets/signs/L.PNG",
  M: "/assets/signs/M.PNG",
  N: "/assets/signs/N.PNG",
  O: "/assets/signs/O.PNG",
  P: "/assets/signs/P.PNG",
  Q: "/assets/signs/Q.PNG",
  R: "/assets/signs/R.PNG",
  S: "/assets/signs/S.PNG",
  T: "/assets/signs/T.PNG",
  U: "/assets/signs/U.PNG",
  V: "/assets/signs/V.PNG",
  W: "/assets/signs/W.PNG",
  X: "/assets/signs/X.PNG",
  Y: "/assets/signs/Y.PNG",
  Z: "/assets/signs/Z.PNG",

  // --- Numbers 0–9 ---
  0: "/assets/signs/0.PNG",  // TODO: replace with Auslan sign for '0'
  1: "/assets/signs/1.PNG",
  2: "/assets/signs/2.PNG",
  3: "/assets/signs/3.PNG",
  4: "/assets/signs/4.PNG",
  5: "/assets/signs/5.PNG",
  6: "/assets/signs/6.PNG",
  7: "/assets/signs/7.PNG",
  8: "/assets/signs/8.PNG",
  9: "/assets/signs/9.PNG", 
};




  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <div style={panelWrap}>
        {/* --- Left: Letters & Numbers --- */}
        <div>
          <div style={panel}>
            <h2 style={title}>Letters (A–Z)</h2>
            <div style={gridLetters}>
              {letters.map((L) => (
                <div
                  key={L}
                  style={card(selected === L)}
                  onClick={() => setSelected(L)}
                >
                  {L}
                </div>
              ))}
            </div>
          </div>

          <div style={panel}>
            <h2 style={title}>Numbers (0–9)</h2>
            <div style={gridNumbers}>
              {numbers.map((N) => (
                <div
                  key={N}
                  style={card(selected === N)}
                  onClick={() => setSelected(N)}
                >
                  {N}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Right: Image Display --- */}
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
