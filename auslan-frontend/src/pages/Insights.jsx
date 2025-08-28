import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg";

export default function Insights() {
  const nav = useNavigate();

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
  const p1 = { textAlign: "center", color: "#5e5c5cff", margin: "0 0 28px 0", fontSize: "1.05rem" };

  const grid = {
    maxWidth: 1100, margin: "0 auto",
    display: "grid", gridTemplateColumns: "1fr", gap: 20,
  };

  const card = {
    background: "rgba(255,255,255,.92)", color: "#111",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.28)",
    border: "1px solid rgba(0,0,0,.06)",
  };

  const head = { padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.1)", color: "#111" };
  const body = { padding: 20, fontSize: 15, lineHeight: 1.6 };
  const meta = { display: "flex", gap: 12, padding: "0 20px 20px" };
  const badge = { background: "rgba(0,0,0,.06)", padding: "4px 10px", borderRadius: 999, fontSize: 12 };

  const sections = [
    {
      title: "Challenges",
      desc: "DHH children face home–school communication gaps. Parents new to Auslan don’t know where to start.",
      facts: ["39% of Deaf students report mental health issues vs 14% (study highlights)."],
      source: "Deaf Australia / Govt reports",
    },
    {
      title: "Trends",
      desc: "More schools are offering Auslan. Families want beginner-friendly, learn-together pathways.",
      facts: ["NSW plans Auslan elective in schools from 2026."],
      source: "Education news",
    },
    {
      title: "Solutions",
      desc: "Start small: letters → numbers → daily words → stories in context; repeat often in home routines.",
      facts: ["Short, contextual practice improves retention for beginners."],
      source: "Learning science",
    },
  ];

  return (
    <div style={page}>
      <div style={back} onClick={() => nav("/")}>←</div>

      <h1 style={h1}>Why Auslan at Home Matters</h1>
      <p style={p1}>Clear, parent-friendly notes to motivate and guide your first steps.</p>

      <div style={grid}>
        {sections.map(s => (
          <div key={s.title} style={card}>
            <div style={head}><h2 style={{ margin: 0, fontSize: 20 }}>{s.title}</h2></div>
            <div style={body}>
              <p style={{ marginTop: 0 }}>{s.desc}</p>
              <ul style={{ margin: "0 0 8px 18px" }}>{s.facts.map(f => <li key={f}>{f}</li>)}</ul>
            </div>
            <div style={meta}><span style={badge}>Source: {s.source}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
