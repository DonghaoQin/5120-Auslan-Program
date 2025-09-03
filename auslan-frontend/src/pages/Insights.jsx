import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg";
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
export default function Insights() {
  const nav = useNavigate();
  const [tab, setTab] = useState("Challenges"); // current selected tab

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
    padding: "0 20px 40px",
    paddingTop: "env(safe-area-inset-top, 0px)",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const h1 = { textAlign: "center", margin: "0 0 8px 0", fontSize: "2.3rem", color: "white" };
  const p1 = { textAlign: "center", color: "#5e5c5cff", margin: "0 0 20px 0", fontSize: "1.05rem" };

  // top buttons
  const tabsBar = {
    maxWidth: 1100, margin: "0 auto 20px auto",
    display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
  };
  const tabBtn = (active) => ({
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,.1)",
    background: active ? "rgba(112,240,194,.95)" : "rgba(255,255,255,.92)",
    color: "#111",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: active ? "0 8px 18px rgba(0,0,0,.18)" : "0 4px 12px rgba(0,0,0,.12)",
  });

  // enlarged content panel
  const panelWrap = { maxWidth: 1000, margin: "0 auto" }; // enlarged ~4× width
  const card = {
    background: "rgba(255,255,255,.95)", color: "#111",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.28)",
    border: "1px solid rgba(0,0,0,.06)",
    minHeight: "500px", // enlarge vertical size
  };
  const head = { padding: "24px 28px", borderBottom: "1px solid rgba(0,0,0,.1)" };
  const body = { padding: 30, fontSize: 18, lineHeight: 1.8 }; // bigger text spacing
  const meta = { display: "flex", gap: 12, padding: "0 28px 28px" };
  const badge = { background: "rgba(0,0,0,.06)", padding: "6px 12px", borderRadius: 999, fontSize: 14 };

  // --- placeholder data ---
  const sections = {
    Challenges: {
      title: "Challenges",
      // TODO: Replace this description with backend-provided text
      desc: "DHH children face homeschool communication gaps. Parents new to Auslan dont know where to start.",
      // TODO: Replace this list with backend-provided facts or statistics
      facts: ["39% of Deaf students report mental health issues vs 14% (study highlights)."],
      // TODO: Replace this source with backend-provided link or media URL
      source: "Deaf Australia / Govt reports",
    },
    Trends: {
      title: "Trends",
      // TODO: Replace with backend text
      desc: "",
      // TODO: Replace with backend data
      facts: [],
      source: "https://www.abs.gov.au/",
    },
    Solutions: {
      title: "Solutions",
      // TODO: Replace with backend text
      desc: "Start small: letters  numbers  daily words stories in context; repeat often in home routines.",
      // TODO: Replace with backend data
      facts: ["Short, contextual practice improves retention for beginners."],
      source: "Learning science",
    },
  };

  const current = sections[tab];

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}></div>

      <h1 style={h1}>Why Auslan at Home Matters</h1>
      <p style={p1}>Clear, parent-friendly notes to motivate and guide your first steps.</p>

      {/* top buttons */}
      <div style={tabsBar}>
        {Object.keys(sections).map(key => (
          <button key={key} style={tabBtn(tab === key)} onClick={() => setTab(key)}>
            {key}
          </button>
        ))}
      </div>

      {/* main enlarged content */}
      <div style={panelWrap}>
        <div style={card}>
          <div style={head}><h2 style={{ margin: 0, fontSize: 24 }}>{current.title}</h2></div>
          <div style={body}>
            {/* TODO: Replace this <p> with backend content, or embed an image/graph */}
            <p style={{ marginTop: 0 }}>{current.desc}</p>
            <ul style={{ margin: "0 0 12px 24px" }}>
              {current.facts.map(f => <li key={f}>{f}</li>)}
              <p style={{ marginTop: 0 }}>{current.desc}</p>
              <ul style={{ margin: "0 0 12px 24px" }}>
                {current.facts.map(f => <li key={f}>{f}</li>)}
              </ul>
              {tab === "Trends" && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Auslan Community Age Distribution (2021)
                  </div>

                  {/* Your existing violin/pyramid chart */}
                  <PyramidAnimated height={520} />

                  {/* A little spacing */}
                  <div style={{ height: 24 }} />

                  {/* New: Australia state heat map (2021) */}
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Auslan population by state (2021)
                  </div>
                  <AusStateMap />

                  {/* If you still want to list facts, keep a single <ul> below */}
                  {current.facts.length > 0 && (
                    <>
                      <div style={{ height: 16 }} />
                      <ul style={{ margin: "0 0 12px 24px" }}>
                        {current.facts.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </ul>
            {/* TODO: Optionally insert iframe, chart, or image here */}
          </div>
          <div style={meta}>
            {/* TODO: Replace with backend-provided source reference or link */}
            <span style={badge}>Source: {current.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
