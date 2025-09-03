import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg";
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
import YearBarChart from "../components/YearBarChart";

export default function Insights() {
  const nav = useNavigate();
  const [tab, setTab] = useState("Challenges");

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

  const panelWrap = { maxWidth: 1000, margin: "0 auto" };
  const card = {
    background: "rgba(255,255,255,.95)", color: "#111",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.28)",
    border: "1px solid rgba(0,0,0,.06)",
    minHeight: "500px",
  };
  const head = { padding: "24px 28px", borderBottom: "1px solid rgba(0,0,0,.1)" };
  const body = { padding: 30, fontSize: 18, lineHeight: 1.8 };
  const meta = { display: "flex", gap: 12, padding: "0 28px 28px", flexWrap: "wrap" };
  const badge = { background: "rgba(0,0,0,.06)", padding: "6px 12px", borderRadius: 999, fontSize: 14 };

  // NEW: allow sections to use either {desc + facts} OR a richer {content: [para,...]}
  const sections = {
    Challenges: {
      title: "Challenges",
      content: [
        "In Australia, studies and agencies commonly note that around 90–95% of Deaf and hard-of-hearing children are born to hearing parents. Without a ready-made sign-language environment and clear entry pathways, parents often struggle to quickly establish a sustainable sign-language communication environment for their children. At the same time, official data show that the majority of students with disability (about 89%) attend mainstream schools, which means many DHH students may be ‘a minority within a minority’ in their classes; both home and school often lack stable, synchronised Auslan support, gradually creating a dual home–school communication gap.",
        "This gap is further magnified in day-to-day school life. National surveys of students and parents indicate that about 72% of students with disability have been excluded from school activities or events (e.g., sports days, excursions, assemblies, or clubs). Uneven inclusion and support systems directly erode DHH students’ sense of participation and belonging, while adding extra pressure on their social and emotional development outside the classroom.",
        "On the supply side, Auslan-certified interpreters have long been in short supply: only a few hundred certified interpreters are registered nationally, serving people who use Auslan at home (approximately 16,000 according to the 2021 Census) as well as growing demand across public settings. Shortages are particularly acute in regional and remote areas, directly affecting the accessibility and continuity of key communication points such as classroom instruction, parent–teacher meetings, and medical or government services. As a result, even schools and families that wish to use sign language often struggle to secure stable support because ‘no interpreter is available’ or gaps arise at short notice.",
        "At the policy level, progress is underway: NSW has released the Auslan K–10 syllabus, with implementation set for 2026 and encouragement for familiarisation and preparation in 2024–2025. This provides a clear timetable for the systematic introduction of Auslan, but roll-out speeds differ across states, and many jurisdictions still need time to fill gaps in curriculum resources, teacher training, and in-school supports. Until the new curriculum is fully implemented, imbalances in home–school resources and professional services will likely persist, making it difficult to close the above communication and service gaps in the short term.",
      ],
      source: "National surveys; 2021 Census; NSW Education Department",
    },
    "Population Analysis": {
      title: "Population Analysis",
      desc: "",
      facts: [],
      source: "https://www.abs.gov.au/",
    },
    Solutions: {
      title: "Solutions",
      desc: "Start small: letters, numbers, daily words, and stories in context; repeat often in home routines.",
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

      {/* Top tab buttons */}
      <div style={tabsBar}>
        {Object.keys(sections).map((key) => (
          <button key={key} style={tabBtn(tab === key)} onClick={() => setTab(key)}>
            {key}
          </button>
        ))}
      </div>

      {/* Main content panel */}
      <div style={panelWrap}>
        <div style={card}>
          <div style={head}><h2 style={{ margin: 0, fontSize: 24 }}>{current.title}</h2></div>
          <div style={body}>
            {/* NEW: rich multi-paragraph rendering if `content` exists */}
            {Array.isArray(current.content) && current.content.length > 0 ? (
              <div style={{ display: "grid", gap: 14 }}>
                {current.content.map((para, i) => (
                  <p key={i} style={{ margin: 0 }}>{para}</p>
                ))}
              </div>
            ) : (
              <>
                {/* fallback to legacy desc + facts layout */}
                {current.desc && <p style={{ marginTop: 0 }}>{current.desc}</p>}
                {Array.isArray(current.facts) && current.facts.length > 0 && (
                  <ul style={{ margin: "0 0 12px 24px" }}>
                    {current.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* Visualizations only for "Population Analysis" tab */}
            {tab === "Population Analysis" && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  How old are people who use Auslan?
                </div>
                <PyramidAnimated height={520} />

                <div style={{ height: 24 }} />

                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Where do people who use Auslan live?
                </div>
                <AusStateMap />

                <div style={{ height: 24 }} />

                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Auslan population growth over the years
                </div>
                <YearBarChart />
              </div>
            )}
          </div>

          <div style={meta}>
            {current.source && <span style={badge}>Source: {current.source}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
