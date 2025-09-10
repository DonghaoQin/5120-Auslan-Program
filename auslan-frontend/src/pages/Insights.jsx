import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/homebackground.jpg";
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
import YearBarChart from "../components/YearBarChart";
import "./Insights.css"; // 翻转卡片样式

export default function Insights() {
  const nav = useNavigate();
  const [tab, setTab] = useState(null); // 初始为空 -> 只显示卡片

  const page = {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "0 20px 40px",
    paddingTop: "env(safe-area-inset-top, 0px)",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const tabsBar = {
    maxWidth: 1100,
    margin: "0 auto 20px auto",
    display: "flex",
    gap: 20,
    justifyContent: "center",
    flexWrap: "wrap",
  };

  // 卡片整体：flex布局，高度固定，内容可滚动
  const panelWrap = { maxWidth: 1000, margin: "0 auto" };
  const card = {
    background: "rgba(255,255,255,.95)",
    color: "#111",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.28)",
    border: "1px solid rgba(0,0,0,.06)",
    height: "clamp(480px, 72vh, 860px)",
    display: "flex",
    flexDirection: "column",
  };
  const head = {
    padding: "24px 28px",
    borderBottom: "1px solid rgba(0,0,0,.1)",
    flexShrink: 0,
  };
  const body = {
    padding: 30,
    fontSize: 18,
    lineHeight: 1.8,
    overflowY: "auto",
    flex: 1,
  };
  const meta = {
    display: "flex",
    gap: 12,
    padding: "0 28px 28px",
    flexWrap: "wrap",
    flexShrink: 0,
  };
  const badge = {
    background: "rgba(0,0,0,.06)",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 14,
  };

  // sections 数据
  const sections = {
  Challenges: {
    title: "Challenges",
    content: [
      "Over 95% of Deaf children in Australia are born to hearing parents who do not know Auslan, leaving families struggling to communicate at home and children at risk of isolation.",
      "39% of Deaf students experience mental health issues compared to just 14% of their hearing peers, highlighting the emotional toll of communication barriers.",
      "72% of students with disability report being excluded from school activities such as sports, assemblies, or excursions, creating a sense of isolation.",
      "Shortage of Auslan-certified interpreters across Australia, especially in regional areas, further limits access to inclusive education and community participation.",
    ],
    source: "Australian Bureau of Statistics, Deaf Australia, National surveys",
  },

  "Population Analysis": {
    title: "Population Analysis",
    desc: "Explore the demographic breakdown of Auslan users in Australia.",
    facts: [],
    source: "https://www.abs.gov.au/",
  },

  Resources: {
    title: "Auslan & Deaf Resources",
    desc: "Explore Auslan and Deaf community resources for learning, support, and connection.",
    facts: [
      {
        name: "Deaf Australia",
        url: "https://deafaustralia.org.au/",
        description: "National advocacy body providing resources, campaigns, and policy support for Deaf Australians.",
        source: "Deaf Australia",
      },
      {
        name: "NDIS (National Disability Insurance Scheme)",
        url: "https://www.ndis.gov.au/",
        description: "Funding and services for Australians with disability, including Auslan support.",
        source: "NDIS",
      },
      {
        name: "Signbank",
        url: "https://www.auslan.org.au/",
        description: "An online dictionary of Auslan signs with videos, definitions, and related resources.",
        source: "Auslan Signbank",
      },
      {
        name: "Emmanuel Centre – Deaf Mental Health Study",
        url: "https://www.emmanuelcentre.com.au/",
        description: "Research and support programs for Deaf Australians focusing on mental health and wellbeing.",
        source: "Emmanuel Centre",
      },
    ],
    source: "Curated Auslan & Deaf Community Resources",
  },
};


  const current = tab ? sections[tab] : null;

  return (
    <div style={page}>
      {/* 翻转卡片按钮区 */}
      <div style={tabsBar}>
        {Object.keys(sections).map((key) => (
          <div
            key={key}
            className="flip-card"
            onClick={() => setTab(key)}
            style={{ cursor: "pointer" }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3 className="title">{key}</h3>
                <p>Click Me</p>
              </div>
              <div className="flip-card-back">
                <h3 className="title">{key}</h3>
                <p>Show Content</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 点击后显示内容 */}
      {current && (
        <div style={panelWrap}>
          <div style={card}>
            <div style={head}>
              <h2 style={{ margin: 0, fontSize: 24 }}>{current.title}</h2>
            </div>

            <div style={body}>
              {Array.isArray(current.content) && current.content.length > 0 ? (
                <div style={{ display: "grid", gap: 14 }}>
                  {current.content.map((para, i) => (
                    <p key={i} style={{ margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  {current.desc && <p style={{ marginTop: 0 }}>{current.desc}</p>}
                  {Array.isArray(current.facts) && current.facts.length > 0 && (
                    <div style={{ display: "grid", gap: 20 }}>
                      {current.facts.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            background: "rgba(255,255,255,.9)",
                            padding: "18px 20px",
                            borderRadius: 16,
                            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
                            border: "1px solid rgba(0,0,0,.08)",
                          }}
                        >
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontWeight: 700,
                              fontSize: 18,
                              color: "#0077cc",
                              textDecoration: "none",
                            }}
                          >
                            {f.name}
                          </a>
                          <p
                            style={{
                              margin: "8px 0 6px 0",
                              fontSize: 15,
                              lineHeight: 1.5,
                              color: "#333",
                            }}
                          >
                            {f.description}
                          </p>
                          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                            Source: {f.source}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 只有 Population Analysis 显示图表 */}
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
      )}
    </div>
  );
}
