// src/pages/Insights.jsx
import PyramidAnimated from "../components/PyramidAnimated";
import AusStateMap from "../components/AusStateMap";
import YearBarChart from "../components/YearBarChart";
import "./Insights.css";

// 顶部大图（请确保文件存在：src/assets/Insight_picture.png）
import heroImg from "../assets/Insight_picture.png";

/* 资源卡片图片（请在 src/assets/ 放入以下文件名，或改为你的文件名）*/
import imgDeafAustralia from "../assets/Deaf_Australia.png";
import imgNDIS from "../assets/ndis.png";
import imgSignbank from "../assets/signbank.png";
import imgEmmanuel from "../assets/TEC.png";

export default function Insights() {
  const sections = {
    Challenges: {
      title: "Challenges",
      content: [
        "Over 95% of Deaf children in Australia are born to hearing parents who do not know Auslan. Most families start without a ready-made sign-language environment at home, so everyday needs like mealtime, bath time, and bedtime can feel slow and frustrating. Parents often ask “where do I begin?” while juggling work, siblings, and appointments.",
        "Building a language routine from scratch is possible, but it requires small, consistent steps—agreeing on a few core signs, using them across the day, and celebrating progress together. When the whole family participates, children receive more consistent input and confidence grows.",
        { type: "tip", title: "For parents", text: "You are not alone. Many families share this starting point, and every small step you take to learn signs can reduce your child’s sense of isolation." },

        "Around 72% of students with disability report being excluded from school activities such as sports days, excursions, assemblies, or clubs. For many Deaf children, being a “minority within a minority” means classmates and staff may not automatically know how to include them.",
        "This is rarely about intent—it is usually about preparation. Clear plans for communication support, visual instructions, and peer awareness can turn “maybe next time” into “yes, you can join us today”.",
        { type: "tip", title: "For parents", text: "Advocate early with your child’s teacher about accessible activities. Community events and family-led activities can also help your child feel included." },

        "Only a few hundred Auslan-certified interpreters are available nationwide, with shortages especially in regional areas. As a result, families sometimes hear “no interpreter available” for parent-teacher meetings, medical appointments, or government services.",
        "Gaps can be reduced by planning ahead, asking about remote/online interpreting, and preparing key information visually (keywords, images, short videos). When everyone shares the same plan B, important conversations are less likely to be postponed.",
        { type: "tip", title: "For parents", text: "Plan ahead for key appointments and consider remote/online interpreting as a backup so important conversations are not delayed." },

        "Policies are improving — for example, NSW will roll out an Auslan K–10 syllabus by 2026 — but rollout speeds differ across states, and schools need time for teacher training and classroom resources. That means families may still experience uneven support in the short term.",
        "While systems catch up, home routines matter: daily practice of a few high-frequency signs, pairing signs with pictures or objects, and inviting siblings to sign can create meaningful change now. These habits make later school support more effective, because your child already has a foundation to build on.",
        { type: "tip", title: "For parents", text: "While policy changes unfold, start building a daily habit at home: learn 3–5 useful signs together (e.g., eat, drink, toilet, help, finish) and use them in real situations." },
      ],
      source: "Australian Bureau of Statistics, Deaf Australia, National surveys",
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
          img: imgDeafAustralia,
          description:
            "National advocacy body providing resources, campaigns, and policy support for Deaf Australians.",
          tags: ["Advocacy", "Community"],
          source: "Deaf Australia",
        },
        {
          name: "NDIS (National Disability Insurance Scheme)",
          url: "https://www.ndis.gov.au/",
          img: imgNDIS,
          description:
            "Government funding and services for Australians with disability, including Auslan-related supports.",
          tags: ["Funding", "Services"],
          source: "NDIS",
        },
        {
          name: "Signbank",
          url: "https://www.auslan.org.au/",
          img: imgSignbank,
          description:
            "Online Auslan dictionary with videos and definitions—great for daily practice at home.",
          tags: ["Learning", "Dictionary"],
          source: "Auslan Signbank",
        },
        {
          name: "Emmanuel Centre – Deaf Mental Health Study",
          url: "https://www.emmanuelcentre.com.au/",
          img: imgEmmanuel,
          description:
            "Research and support programs focusing on mental health and wellbeing for Deaf Australians.",
          tags: ["Wellbeing", "Research"],
          source: "Emmanuel Centre",
        },
      ],
      source: "Curated Auslan & Deaf Community Resources",
    },
  };

  return (
    <>
      {/* 顶部：总标题 + 16:9 图片 */}
      <header className="insights-hero" aria-labelledby="insights-hero-title">
        <h1 id="insights-hero-title">
          From Insight to Action: Supporting Your Auslan Journey
        </h1>
        <div className="insights-hero-media">
          <img
            src={heroImg}
            alt="A parent and child practising Auslan together in a warm, friendly cartoon style"
            loading="eager"
          />
        </div>
      </header>

      {/* 主体：保留原有目录与内容 */}
      <div className="insights-page">
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

        <main className="insights-content">
          {Object.entries(sections).map(([key, sec]) => (
            <section id={key} key={key} className="insights-section">
              <h2>{sec.title}</h2>

              {sec.content &&
                sec.content.map((p, i) => {
                  if (typeof p === "string") return <p key={i}>{p}</p>;
                  if (p && p.type === "tip") {
                    return (
                      <div className="tip" key={i}>
                        <div className="tip-title">
                          <span role="img" aria-label="lightbulb">💡</span>
                          {p.title}
                        </div>
                        <p>{p.text}</p>
                      </div>
                    );
                  }
                  return null;
                })}

              {!sec.facts && sec.desc && <p>{sec.desc}</p>}

              {key === "Population Analysis" && (
                <>
                  <h4>How old are people who use Auslan?</h4>
                  <PyramidAnimated height={520} />
                  <p>
                    This age pyramid shows that Auslan users span every life stage—from early
                    childhood to older adults. A strong base in school-age years means your child
                    can find peers and role models, while the broad upper layers indicate long-term
                    community continuity.
                  </p>
                  <div className="tip">
                    <div className="tip-title">
                      <span role="img" aria-label="lightbulb">💡</span>Tip
                    </div>
                    <p>
                      Ask your local Deaf society or school about age-matched playgroups or youth
                      events. Practising with same-age peers often boosts motivation.
                    </p>
                  </div>

                  <h4>Where do people who use Auslan live?</h4>
                  <AusStateMap />
                  <p>
                    Victoria and Queensland have large Auslan communities, and every state and
                    territory shows a visible presence. If you live outside major hubs, online
                    communities and remote services can help bridge the distance.
                  </p>
                  <div className="tip">
                    <div className="tip-title">
                      <span role="img" aria-label="lightbulb">💡</span>Tip
                    </div>
                    <p>
                      Search for state-based Deaf associations and parent groups, and ask schools or
                      clinics about regional meetups to build your local network.
                    </p>
                  </div>

                  <h4>Auslan population growth over the years</h4>
                  <YearBarChart />
                  <p>
                    The number of people using Auslan at home has grown from 8,406 (2011) to 16,242
                    (2021). Growth brings more classes, interpreters, and peer networks—making it a
                    good time to start or to deepen your family’s Auslan journey.
                  </p>
                  <div className="tip">
                    <div className="tip-title">
                      <span role="img" aria-label="lightbulb">💡</span>Tip
                    </div>
                    <p>
                      Set a weekly family goal (e.g., learn 10 new signs) and review progress
                      together. Consistency compounds as the ecosystem expands.
                    </p>
                  </div>
                </>
              )}

              {/* 新的资源卡片网格 */}
              {sec.facts && (
                <>
                  <p className="resources-intro">{sec.desc}</p>
                  <div className="resources-grid">
                    {sec.facts.map((f, i) => (
                      <a
                        className="resource-card"
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${f.name} — open in new tab`}
                      >
                        <div className="resource-media">
                          <img src={f.img} alt={`${f.name} preview`} />
                        </div>
                        <div className="resource-body">
                          <h5 className="resource-title">{f.name}</h5>
                          <p className="resource-desc">{f.description}</p>
                          {Array.isArray(f.tags) && (
                            <div className="resource-tags">
                              {f.tags.map((t, ti) => (
                                <span className="resource-tag" key={ti}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                  {sec.source && (
                    <div className="section-source">Source: {sec.source}</div>
                  )}
                </>
              )}

              {/* 如果是非资源区块，正常显示来源 */}
              {!sec.facts && sec.source && (
                <div className="section-source">Source: {sec.source}</div>
              )}
            </section>
          ))}
        </main>
      </div>
    </>
  );
}
