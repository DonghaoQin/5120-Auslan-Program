import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg";
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
import YearBarChart from "../components/YearBarChart";

export default function Insights() {
  const nav = useNavigate();
  const [tab, setTab] = useState("Challenges"); // default tab

  // Styles for various elements (inline styles used for quick theming)
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

  // 🔄 Updated sections object
  // Removed the old simple Resources
  // Kept only one "Resources" section with cards
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

    Resources: {
      title: "Auslan & Deaf Resources", // 🆕 clearer tab name
      desc: "Explore Auslan and Deaf community resources for learning, support, and connection.",
      facts: [
        {
          name: "Aussie Deaf Kids Auslan Resources",
          url: "https://www.aussiedeafkids.org.au/about-communication/australian-sign-language/auslan-resources/",
          description: "Provides a range of links and guides to Auslan resources for families of deaf and hard of hearing children. Helpful for parents learning to communicate in Auslan with their kids.",
          source: "Aussie Deaf Kids (non-profit supporting families)",
        },
        {
          name: "Auslan Resources",
          url: "https://www.auslanresources.com.au/",
          description: "Offers Auslan learning materials, games, posters, and teaching aids. Useful for both beginners and educators.",
          source: "Auslan Resources (educational provider)",
        },
        {
          name: "Deaf Australia",
          url: "https://deafaustralia.org.au/",
          description: "National peak organisation representing Deaf people in Australia. Provides advocacy, resources, and information about Deaf culture and Auslan.",
          source: "Deaf Australia (advocacy body)",
        },
        {
          name: "Deaf Connect Auslan Resource Library",
          url: "https://deafconnect.org.au/auslan-resource-library",
          description: "A library of Auslan resources including videos, guides, and support for learners at all levels.",
          source: "Deaf Connect (largest provider of Deaf services in Australia)",
        },
        {
          name: "Auslan Hub",
          url: "https://auslanhub.com.au/",
          description: "Central hub with videos, resources, and materials to support Auslan learners and teachers. Great for structured learning and practice.",
          source: "Auslan Hub (educational initiative)",
        },
      ],
      source: "Curated Auslan & Deaf Community Resources",
    },
  };

  const current = sections[tab]; // current tab data

  return (
    <div style={page}>
      {/* Back button (top right) */}
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
          {/* Card header */}
          <div style={head}><h2 style={{ margin: 0, fontSize: 24 }}>{current.title}</h2></div>

          {/* Card body */}
          <div style={body}>
            {/* If section has "content" (array of paragraphs) */}
            {Array.isArray(current.content) && current.content.length > 0 ? (
              <div style={{ display: "grid", gap: 14 }}>
                {current.content.map((para, i) => (
                  <p key={i} style={{ margin: 0 }}>{para}</p>
                ))}
              </div>
            ) : (
              <>
                {/* Otherwise, fallback to desc + facts */}
                {current.desc && <p style={{ marginTop: 0 }}>{current.desc}</p>}

                {/* 🔄 Updated facts rendering: supports both strings and objects */}
                {Array.isArray(current.facts) && current.facts.length > 0 && (
                  <div style={{ display: "grid", gap: 20 }}>
                    {current.facts.map((f, i) =>
                      typeof f === "string" ? (
                        <div key={i} style={{
                          background: "rgba(0,0,0,.04)",
                          padding: "12px 16px",
                          borderRadius: 12,
                          fontSize: 16,
                        }}>
                          {f}
                        </div>
                      ) : (
                        <div key={i} style={{
                          background: "rgba(255,255,255,.9)",
                          padding: "18px 20px",
                          borderRadius: 16,
                          boxShadow: "0 4px 12px rgba(0,0,0,.12)",
                          border: "1px solid rgba(0,0,0,.08)",
                        }}>
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontWeight: 700, fontSize: 18, color: "#0077cc", textDecoration: "none" }}
                          >
                            {f.name}
                          </a>
                          <p style={{ margin: "8px 0 6px 0", fontSize: 15, lineHeight: 1.5, color: "#333" }}>
                            {f.description}
                          </p>
                          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                            Source: {f.source}
                          </p>
                        </div>
                      )
                    )}
                  </div>
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

          {/* Footer source badge */}
          <div style={meta}>
            {current.source && <span style={badge}>Source: {current.source}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
