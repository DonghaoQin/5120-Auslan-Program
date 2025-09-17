// src/pages/Insights.jsx
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
import YearBarChart from "../components/YearBarChart";
import "./Insights.css";

export default function Insights() {
  // 以文章顺序渲染
  const sections = {
    Challenges: {
      title: "Challenges",
      content: [
        "Over 95% of Deaf children in Australia are born to hearing parents who do not know Auslan, leaving families struggling to communicate at home and children at risk of isolation.",
        "39% of Deaf students experience mental health issues compared to just 14% of their hearing peers, highlighting the emotional toll of communication barriers.",
        "72% of students with disability report being excluded from school activities such as sports, assemblies, or excursions, creating a sense of isolation.",
        "Shortage of Auslan-certified interpreters across Australia, especially in regional areas, further limits access to inclusive education and community participation.",
      ],
      source:
        "Australian Bureau of Statistics, Deaf Australia, National surveys",
    },

    "Population Analysis": {
      title: "Population Analysis",
      desc: "Explore the demographic breakdown of Auslan users in Australia.",
      source: "https://www.abs.gov.au/",
    },

    Resources: {
      title: "Auslan & Deaf Resources",
      desc: "Explore Auslan and Deaf community resources for learning, support, and connection.",
      facts: [
        {
          name: "Deaf Australia",
          url: "https://deafaustralia.org.au/",
          description:
            "National advocacy body providing resources, campaigns, and policy support for Deaf Australians.",
          source: "Deaf Australia",
        },
        {
          name: "NDIS (National Disability Insurance Scheme)",
          url: "https://www.ndis.gov.au/",
          description:
            "Funding and services for Australians with disability, including Auslan support.",
          source: "NDIS",
        },
        {
          name: "Signbank",
          url: "https://www.auslan.org.au/",
          description:
            "An online dictionary of Auslan signs with videos, definitions, and related resources.",
          source: "Auslan Signbank",
        },
        {
          name: "Emmanuel Centre – Deaf Mental Health Study",
          url: "https://www.emmanuelcentre.com.au/",
          description:
            "Research and support programs for Deaf Australians focusing on mental health and wellbeing.",
          source: "Emmanuel Centre",
        },
      ],
      source: "Curated Auslan & Deaf Community Resources",
    },
  };

  return (
    <div className="insights-page">{/* 纯白背景由 CSS 控制 */ }
      {/* 左侧目录（与正文处于同一大平面） */}
      <aside className="insights-nav" aria-label="Table of contents">
        <h3>Insights</h3>
        <ul>
          {Object.keys(sections).map((key) => (
            <li key={key}>
              <a href={`#${key}`}>{sections[key].title}</a>
            </li>
          ))}
        </ul>
      </aside>

      {/* 右侧长文正文 */}
      <main className="insights-content">
        {Object.entries(sections).map(([key, sec]) => (
          <section id={key} key={key} className="insights-section">
            <h2>{sec.title}</h2>

            {sec.content && sec.content.map((p, i) => <p key={i}>{p}</p>)}
            {sec.desc && <p>{sec.desc}</p>}

            {key === "Population Analysis" && (
              <>
                <h4>How old are people who use Auslan?</h4>
                <PyramidAnimated height={520} />

                <h4>Where do people who use Auslan live?</h4>
                <AusStateMap />

                <h4>Auslan population growth over the years</h4>
                <YearBarChart />
              </>
            )}

            {sec.facts && (
              <div className="resource-list">
                {sec.facts.map((f, i) => (
                  <article className="resource-card" key={i}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer">
                      {f.name}
                    </a>
                    <p>{f.description}</p>
                    <small>Source: {f.source}</small>
                  </article>
                ))}
              </div>
            )}

            {sec.source && (
              <div className="section-source">Source: {sec.source}</div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
