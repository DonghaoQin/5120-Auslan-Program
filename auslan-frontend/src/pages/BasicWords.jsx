import { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
// import { QRCodeCanvas } from "qrcode.react";

const STORAGE_KEY = "LN_LEARNED_V2";

// 顶部避让 & 搜索区高度（用于 sticky/右侧面板）
const TOP_GAP = 96;
const SEARCH_BLOCK_H = 128;

// 布局尺寸
const MAX_W = 1200;  // 容器最大宽度
const RIGHT_W = 600; // 右侧固定栏宽度
const GAP = 24;      // 右侧面板与主列间距

// ✅ 后端接口
const API_URL = "https://auslan-backend.onrender.com/videos/";

/* ------------ Category 配置 ------------- */
const CATEGORY_COLORS = {
  "1A. Essentials_Survival Signs": { bg: "#E6F7F2", bar: "#86E3CB", border: "#66D6BC" },
  "1B. Greetings & Social Basics": { bg: "#FFF4E0", bar: "#FFC36E", border: "#F7A940" },
  "2A. Family Members": { bg: "#ECEAFF", bar: "#B7B4FF", border: "#9895FF" },
  "2B. Feelings/Needs": { bg: "#F0F4FF", bar: "#93C5FD", border: "#3B82F6" },
  "3A. School/Play": { bg: "#FEF2F2", bar: "#FCA5A5", border: "#EF4444" },
  "3B. Everyday/Actions": { bg: "#F5F3FF", bar: "#C4B5FD", border: "#8B5CF6" },
  "4A. Basic Questions": { bg: "#ECFDF5", bar: "#6EE7B7", border: "#10B981" },
  "4B. Interaction Clarification": { bg: "#FFFBEB", bar: "#FDE68A", border: "#F59E0B" },
  "Other": { bg: "#F3F4F6", bar: "#D1D5DB", border: "#6B7280" },
};

const slug = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

const CATEGORY_MAP = (() => {
  const C1A = ["thank_you","no","stop","help","seat","drink","sleeping","go_to","now","not"];
  const C1B = ["hello","bye_bye","apology","ask","welcome","hi"];
  const C2A = ["mum","brother","sister","baby","you","we","yourself","people","our"];
  const C2B = ["sad","tired","love","smile","upset","cute","like","bad","pizza","dislike","surprised","dont_know","disappointment","thinking_reflection","annoying"];
  const C3A = ["play","school","teacher","friend","home","already","finished","big","fun","copy","jump_off"];
  const C3B = ["wash_face","share","wait","come_here","move","climb","wear","spoon","look","bath","back_of_body","hairbrush"];
  const C4A = ["what","why","who","how_old"];
  const C4B = ["again","slow_down","understand","nothing"];
  const OTHER = ["auslan","deaf_mute","australia","sign_name","dog","apple","world"];

  const m = {};
  C1A.forEach(k => m[k] = "1A. Essentials_Survival Signs");
  C1B.forEach(k => m[k] = "1B. Greetings & Social Basics");
  C2A.forEach(k => m[k] = "2A. Family Members");
  C2B.forEach(k => m[k] = "2B. Feelings/Needs");
  C3A.forEach(k => m[k] = "3A. School/Play");
  C3B.forEach(k => m[k] = "3B. Everyday/Actions");
  C4A.forEach(k => m[k] = "4A. Basic Questions");
  C4B.forEach(k => m[k] = "4B. Interaction Clarification");
  OTHER.forEach(k => m[k] = "Other");
  return m;
})();
const categoryOf = (title) => CATEGORY_MAP[slug(title)] ?? "Other";

export default function BasicWords() {
  const [current, setCurrent] = useState(null);
  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
  });
  const [search, setSearch] = useState("");

  // 折叠状态：每个分组独立
  const [collapsed, setCollapsed] = useState({});

  // 🔄 拉取词表
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [words, setWords] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((x, idx) => {
          const title =
            x.filename?.toString() ||
            x.title?.toString() ||
            x.name?.toString() ||
            x.word?.toString() ||
            x.text?.toString() ||
            `Item ${idx + 1}`;

          const url = (typeof x.url === "string" ? x.url : null);

          return { id: x.id ?? x._id ?? `${title}-${idx}`, title, url, raw: x };
        });

        if (alive) setWords(normalized);
      } catch (e) {
        if (alive) setError(`加载失败：${e.message}`);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
  }, [learned]);

  // 基础排序：按字母
  const all = useMemo(() => {
    return [...words].sort((a, b) => a.title.localeCompare(b.title));
  }, [words]);

  // 搜索过滤
  const sanitizedSearch = useMemo(() => DOMPurify.sanitize(search), [search]);
  const filtered = useMemo(
    () =>
      sanitizedSearch
        ? all.filter((x) =>
            x.title.toLowerCase().includes(sanitizedSearch.toLowerCase())
          )
        : all,
    [all, sanitizedSearch]
  );

  // 是否在搜索状态
  const isSearching = sanitizedSearch.trim().length > 0;

  // 全局进度
  const learnedCount = useMemo(() => {
    const keys = new Set([...learned]);
    return all.reduce((acc, x) => acc + (keys.has(x.title) ? 1 : 0), 0);
  }, [all, learned]);

  // 分桶 + 组内排序
  const buckets = useMemo(() => {
    const b = {};
    filtered.forEach((item) => {
      const cat = categoryOf(item.title);
      if (!b[cat]) b[cat] = [];
      b[cat].push(item);
    });
    Object.keys(b).forEach((k) => {
      b[k].sort((a, b) => a.title.localeCompare(b.title));
    });
    return b;
  }, [filtered, learned]);

  const categories = [
    "1A. Essentials_Survival Signs",
    "1B. Greetings & Social Basics",
    "2A. Family Members",
    "2B. Feelings/Needs",
    "3A. School/Play",
    "3B. Everyday/Actions",
    "4A. Basic Questions",
    "4B. Interaction Clarification",
    "Other",
  ];

  // 右侧详情交互（地鼠切换）
  const handleSelect = (item) => {
    if (!current) { setCurrent(item); setOpen(true); return; }
    if (item?.id === current?.id) return;
    setPending(item); setOpen(false);
  };
  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName && e.propertyName !== "transform") return;
    if (!open && pending) {
      setCurrent(pending); setPending(null);
      requestAnimationFrame(() => setOpen(true));
    }
  };

  /* ------------------------- 样式 ------------------------- */
  const page = {
    minHeight: "100vh",
    background: "#F6F7FB",
    padding: "24px",
    paddingTop: TOP_GAP + 24,
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    color: "#222",
  };

  return (
    <div style={page}>
      <style>{`
        .ln-card { background: #fff; border-radius: 16px; padding: 10px 6px; text-align: center; cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,.06); border: 1px solid #EEF0F2; user-select: none; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
        .ln-card:hover { transform: translateY(-2px); border-color: #CFD4DC; box-shadow: 0 10px 22px rgba(0,0,0,.12); }
        .ln-card-title { letter-spacing: .5px; line-height: 1.2; font-size: 16px; padding: 8px 6px 4px; word-break: break-word; }
        .ln-card-learned { border: 4px solid #FFA500; }

        .ln-layout { max-width: ${MAX_W}px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 16px; }
        .ln-left-nav { position: sticky; top: ${TOP_GAP + 12}px; align-self: start; background: #fff; border: 1px solid #EEF0F2; border-radius: 14px; padding: 12px; box-shadow: 0 6px 16px rgba(0,0,0,.06); }
        .ln-left-btn { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 12px; margin-bottom: 8px; font-weight: 700; border-radius: 10px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; transition: transform .12s ease, box-shadow .12s ease; }
        .ln-left-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(0,0,0,.08); }
        .ln-left-pill { font-size: 12px; opacity: .8; }
        .ln-left-arrow { transition: transform .18s ease; display:inline-block; border-top: 6px solid transparent; border-bottom: 6px solid transparent; }
        .ln-left-arrow.collapsed { transform: rotate(-90deg); }

        .ln-main { margin-right: ${RIGHT_W + GAP}px; }

        .ln-fixed-right { position: fixed; top: ${TOP_GAP + SEARCH_BLOCK_H}px; right: calc((100vw - ${MAX_W}px) / 2); width: ${RIGHT_W}px; height: calc(100vh - ${TOP_GAP + SEARCH_BLOCK_H}px); display: flex; flex-direction: column; background: #fff; border-radius: 18px 18px 0 0; box-shadow: 0 10px 24px rgba(0,0,0,.12); overflow: hidden; transform: translateY(100%); opacity: 0; pointer-events: none; transition: transform .45s ease-in-out, opacity .45s ease-in-out; }
        .ln-fixed-right.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .ln-stage { flex: 1; overflow: auto; padding: 28px; display: grid; place-items: center; background: #fff; }
        .ln-detail-footer { height: 180px; background: #fff; border-top: 1px solid #EEF0F2; display:flex; align-items:center; justify-content:center; gap:16px; padding:18px 20px 0; }
        .ln-btn { border:none; border-radius:10px; padding:20px 32px; font-weight:700; color:#fff; cursor:pointer; }
        .ln-btn.ok { background:#f2b64fff; } .ln-btn.bad { background:#ef4444ff; }

        .ln-group-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-content: start; margin-bottom: 18px; transition: max-height .35s ease; }
        .ln-group-grid.collapsed { max-height: 0; overflow: hidden; }

        @media (max-width: ${MAX_W + RIGHT_W + GAP}px) {
          .ln-main { margin-right: ${RIGHT_W + 16}px; }
        }
        @media (max-width: 980px) {
          .ln-layout { grid-template-columns: 1fr; }
          .ln-left-nav { position: static; }
          .ln-fixed-right { position: static; width: 100%; height: auto; border-radius: 16px; transform:none; opacity:1; pointer-events:auto; }
          .ln-main { margin-right: 0; }
          .ln-group-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* 顶部：搜索 + 全局进度 */}
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ display: "block", width: "90%", maxWidth: 640, margin: "0 auto 16px auto", padding: "12px 16px", borderRadius: 12, border: "1px solid #D1D5DB", fontSize: 16, background: "#fff" }}
        />
        <div style={{ maxWidth: 960, margin: "0 auto 10px auto", height: 10, background: "#E5E7EB", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${all.length ? Math.round((learnedCount / all.length) * 100) : 0}%`, background: "linear-gradient(90deg,#FFD166,#F77F00)" }}/>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          {learnedCount}/{all.length} learned
        </div>
      </div>

      {/* 状态提示 */}
      {loading && <div style={{ textAlign: "center", color: "#6B7280" }}>Loading words...</div>}
      {error && <div style={{ textAlign: "center", color: "#ef4444" }}>{error}</div>}

      {/* 主布局：左侧导航 + 右侧分组主列 */}
      <div className="ln-layout">
        {/* 左侧导航（保持原样式&功能，并集中于左侧） */}
        <aside className="ln-left-nav">
          {[
            "1A. Essentials_Survival Signs",
            "1B. Greetings & Social Basics",
            "2A. Family Members",
            "2B. Feelings/Needs",
            "3A. School/Play",
            "3B. Everyday/Actions",
            "4A. Basic Questions",
            "4B. Interaction Clarification",
            "Other",
          ].map((cat) => {
            const items = buckets[cat] || [];
            const { n, total } = (()=>{
              const total = items.length;
              const n = items.reduce((acc, x) => acc + (learned.has(x.title) ? 1 : 0), 0);
              return { n, total };
            })();
            const color = CATEGORY_COLORS[cat] || { border: "#cbd5e1" };
            const disabled = isSearching && items.length === 0; // 搜索时且该组无结果 → 禁用
            const isCol = collapsed[cat];

            return (
              <button
                key={cat}
                className="ln-left-btn"
                onClick={() => {
                  if (disabled) return;
                  if (isSearching) {
                    const el = document.querySelector(`#cat-${slug(cat)}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    setCollapsed(p => ({ ...p, [cat]: !p[cat] }));
                  }
                }}
                style={{ borderColor: color.border, opacity: disabled ? .45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                title={disabled ? `No results in ${cat}` : (isCol ? `Expand ${cat}` : `Collapse ${cat}`)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 20, borderRadius: 6, background: color.border }} />
                  <span style={{ fontSize: 12, textAlign: "left", lineHeight: 1.2 }}>{cat}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="ln-left-pill" style={{ color: color.border }}>{n}/{total}</span>
                  <span className={`ln-left-arrow ${isCol ? "collapsed" : ""}`} style={{ borderLeft: `10px solid ${color.border}` }} />
                </span>
              </button>
            );
          })}
          {/* 一键折叠/展开全部（保留原功能） */}
          <button className="ln-left-btn" onClick={() => {
            const allCats = Object.keys(buckets).length ? Object.keys(buckets) : [
              "1A. Essentials_Survival Signs","1B. Greetings & Social Basics","2A. Family Members","2B. Feelings/Needs","3A. School/Play","3B. Everyday/Actions","4A. Basic Questions","4B. Interaction Clarification","Other"
            ];
            const state = {}; allCats.forEach(c=> state[c] = true); setCollapsed(state);
          }}>Collapse all</button>
          <button className="ln-left-btn" onClick={() => {
            const allCats = Object.keys(buckets).length ? Object.keys(buckets) : [
              "1A. Essentials_Survival Signs","1B. Greetings & Social Basics","2A. Family Members","2B. Feelings/Needs","3A. School/Play","3B. Everyday/Actions","4A. Basic Questions","4B. Interaction Clarification","Other"
            ];
            const state = {}; allCats.forEach(c=> state[c] = false); setCollapsed(state);
          }}>Expand all</button>
        </aside>

        {/* 右侧主列（仅渲染网格分组；搜索时强制展开并隐藏空组） */}
        <main className="ln-main">
          {[
            "1A. Essentials_Survival Signs",
            "1B. Greetings & Social Basics",
            "2A. Family Members",
            "2B. Feelings/Needs",
            "3A. School/Play",
            "3B. Everyday/Actions",
            "4A. Basic Questions",
            "4B. Interaction Clarification",
            "Other",
          ].map((cat) => {
            const items = buckets[cat] || [];
            if (isSearching && items.length === 0) return null;  // 搜索时隐藏空组

            const color = CATEGORY_COLORS[cat] || { border: "#cbd5e1" };
            const isCol = isSearching ? false : collapsed[cat];  // 搜索时强制展开

            return (
              <section key={cat} id={`cat-${slug(cat)}`}>
                {/* <h3 style={{ margin: "12px 0", color: color.border }}>{cat}</h3> */}
                <div className={`ln-group-grid ${isCol ? "collapsed" : ""}`}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`ln-card ${learned.has(item.title) ? "ln-card-learned" : ""}`}
                      onClick={() => handleSelect(item)}
                      style={{ borderLeft: `6px solid ${color.border}` }}
                    >
                      <div className="ln-card-title">{item.title}</div>
                    </div>
                  ))}
                  {!loading && items.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#ef4444", fontWeight: 600 }}>
                      No items in this category.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* 右侧固定详情 */}
      <aside
        className={`ln-fixed-right ${open ? "open" : ""}`}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        <div className="ln-stage">
          {current ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <h2 style={{ marginBottom: 12, fontSize: 28 }}>{current.title}</h2>
              {current.url ? (
                <video
                  key={current.url}
                  src={current.url}
                  controls
                  style={{ maxHeight: "60vh", maxWidth: "100%", borderRadius: 12 }}
                />
              ) : (
                <p style={{ color: "#6B7280" }}>This item has no video URL.</p>
              )}
            </div>
          ) : (
            <p style={{ color: "#eaca8dff" }}>Select a card to see details</p>
          )}
        </div>

        <div className="ln-detail-footer">
          <button
            className="ln-btn ok"
            onClick={() => current && setLearned((p) => new Set(p).add(current.title))}
            disabled={!current || !open}
            style={!current || !open ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          >
            Learned
          </button>
          <button
            className="ln-btn bad"
            onClick={() =>
              current &&
              setLearned((p) => {
                const n = new Set(p);
                n.delete(current.title);
                return n;
              })
            }
            disabled={!current || !open}
            style={!current || !open ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          >
            Not yet
          </button>
        </div>
      </aside>
      {/* 📱 Floating QR Code (bottom-right corner)
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "32px",
          background: "#fff",
          border: "2px solid #E5E7EB",
          borderRadius: "16px",
          padding: "12px 16px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          textAlign: "center",
          zIndex: 9999,
        }}
      >
        <p style={{ fontSize: "13px", marginBottom: "4px", color: "#444" }}>
          📱 Flashcard Mode
        </p>
        <QRCodeCanvas
          value="https://helloauslan.me/flashcard" 
          size={100}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          includeMargin={true}
          style={{ borderRadius: "8px" }}
        />
      </div> */}
    </div>
  );
}