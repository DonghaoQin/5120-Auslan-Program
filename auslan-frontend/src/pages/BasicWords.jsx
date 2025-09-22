import { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";

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

/* ------------ Level 配置（可随时微调） ------------- */
const LEVEL_COLORS = {
  1: { bg: "#E6F7F2", bar: "#86E3CB", border: "#66D6BC" },  // 薄荷绿
  2: { bg: "#FFF4E0", bar: "#FFC36E", border: "#F7A940" },  // 杏黄色
  3: { bg: "#ECEAFF", bar: "#B7B4FF", border: "#9895FF" },  // 柔和紫
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

const LEVEL_MAP = (() => {
  const L1 = [
    "hello","hi","thank_you","apology","no","help","what","who","we","you",
    "mum","friend","love","like","look","come_here","go_to","stop","wait",
    "play","home","school","teacher","dog","apple","baby"
  ];
  const L2 = [
    "again","already","annoying","ask","bad","bath","big","brother","cute",
    "dont_know","drink","finished","fun","hairbrush","how_old","meat","move",
    "now","our","people","pizza","seat","share","surprised","tired","welcome"
  ];
  const L3 = [
    "auslan","sign_name","deaf_mute","thinking_reflection","back_of_body",
    "jump_off","wash_face","disappointment","slow_down","sleeping","spoon",
    "australia","understand","upset","sad","nothing","wear","world","yourself",
    "climb","copy","dislike","bye_bye"
  ];
  const m = {};
  L1.forEach(k => m[k] = 1);
  L2.forEach(k => m[k] = 2);
  L3.forEach(k => m[k] = 3);
  return m;
})();
const levelOf = (title) => LEVEL_MAP[slug(title)] ?? 2;

/* --------------------------------------------------- */

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

  // 折叠状态：默认展开（仅在非搜索时起作用）
  const [collapsed, setCollapsed] = useState({ 1: false, 2: false, 3: false });

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

  // 分桶 + 组内排序（已学优先，再字母序）
  const buckets = useMemo(() => {
    const b = { 1: [], 2: [], 3: [] };
    filtered.forEach((item) => b[levelOf(item.title)].push(item));
    const sorter = (a, b) => {
      const A = learned.has(a.title) ? 0 : 1;
      const B = learned.has(b.title) ? 0 : 1;
      if (A !== B) return A - B;
      return a.title.localeCompare(b.title);
    };
    b[1].sort(sorter); b[2].sort(sorter); b[3].sort(sorter);
    return b;
  }, [filtered, learned]);

  // 右侧详情交互（地鼠切换）
  const handleSelect = (item) => {
    if (!current) { setCurrent(item); setOpen(true); return; }
    if (item?.id === current?.id) return;
    setPending(item); setOpen(false);
  };
  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return;
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
        .ln-card {
          background: #fff;
          border-radius: 16px;
          padding: 10px 6px;
          text-align: center;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,.06);
          border: 1px solid #EEF0F2;
          user-select: none;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .ln-card:hover { transform: translateY(-2px); border-color: #CFD4DC; box-shadow: 0 10px 22px rgba(0,0,0,.12); }
        .ln-card-title { letter-spacing: .5px; line-height: 1.2; font-size: 16px; padding: 8px 6px 4px; word-break: break-word; }
        .ln-card-learned { border: 2px solid #FFA500; }

        /* 页面两列：左侧导航（sticky） + 右侧主列（为右侧详情面板让出空间） */
        .ln-layout { max-width: ${MAX_W}px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 16px; }
        .ln-left-nav {
          position: sticky; 
          top: ${TOP_GAP + 12}px; 
          align-self: start;
          background: #fff; 
          border: 1px solid #EEF0F2; 
          border-radius: 14px; 
          padding: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,.06);
        }
        .ln-left-btn {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; padding: 10px 12px; margin-bottom: 8px;
          font-weight: 700; border-radius: 10px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .ln-left-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(0,0,0,.08); }
        .ln-left-pill { font-size: 12px; opacity: .8; }
        .ln-left-arrow { transition: transform .18s ease; }
        .ln-left-arrow.collapsed { transform: rotate(-90deg); }

        .ln-main { margin-right: ${RIGHT_W + GAP}px; }

        /* 右侧固定面板 */
        .ln-fixed-right {
          position: fixed;
          top: ${TOP_GAP + SEARCH_BLOCK_H}px;
          right: calc((100vw - ${MAX_W}px) / 2);
          width: ${RIGHT_W}px;
          height: calc(100vh - ${TOP_GAP + SEARCH_BLOCK_H}px);
          display: flex; flex-direction: column;
          background: #fff;
          border-radius: 18px 18px 0 0;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
          overflow: hidden;
          transform: translateY(100%); opacity: 0; pointer-events: none;
          transition: transform .45s ease-in-out, opacity .45s ease-in-out;
        }
        .ln-fixed-right.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .ln-stage { flex: 1; overflow: auto; padding: 28px; display: grid; place-items: center; background: #fff; }
        .ln-detail-footer { height: 180px; background: #fff; border-top: 1px solid #EEF0F2; display:flex; align-items:center; justify-content:center; gap:16px; padding:18px 20px 0; }
        .ln-btn { border:none; border-radius:10px; padding:20px 32px; font-weight:700; color:#fff; cursor:pointer; }
        .ln-btn.ok { background:#f2b64fff; } .ln-btn.bad { background:#ef4444ff; }

        /* 组内容网格（支持折叠动画） */
        .ln-group-grid { 
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; 
          align-content: start; margin-bottom: 18px; 
          transition: max-height .35s ease;
        }
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
          style={{
            display: "block", width: "90%", maxWidth: 640,
            margin: "0 auto 16px auto", padding: "12px 16px",
            borderRadius: 12, border: "1px solid #D1D5DB", fontSize: 16, background: "#fff",
          }}
        />
        <div style={{
          maxWidth: 960, margin: "0 auto 10px auto",
          height: 10, background: "#E5E7EB", borderRadius: 999, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${all.length ? Math.round((learnedCount / all.length) * 100) : 0}%`,
            background: "linear-gradient(90deg,#FFD166,#F77F00)",
          }}/>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          {learnedCount}/{all.length} learned
          {learnedCount > 0 && (
            <button
              onClick={() => setLearned(new Set())}
              style={{
                marginLeft: 12, padding: "4px 10px", fontSize: 14,
                border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", background: "#fff",
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* 状态提示 */}
      {loading && <div style={{ textAlign: "center", color: "#6B7280" }}>Loading words...</div>}
      {error && <div style={{ textAlign: "center", color: "#ef4444" }}>{error}</div>}

      {/* 主布局：左侧导航 + 右侧分组主列（仅网格，无 Level 横条） */}
      <div className="ln-layout">
        {/* 左侧导航（sticky & 控制折叠/展开；搜索时只定位） */}
        <aside className="ln-left-nav">
          {[1,2,3].map((lv) => {
            const items = buckets[lv];
            const { n, total } = (()=>{
              const total = items.length;
              const n = items.reduce((acc, x) => acc + (learned.has(x.title) ? 1 : 0), 0);
              return { n, total };
            })();
            const color = LEVEL_COLORS[lv];
            const disabled = isSearching && items.length === 0; // 搜索时且该组无结果 → 禁用
            const isCol = collapsed[lv];

            return (
              <button
                key={lv}
                className="ln-left-btn"
                onClick={() => {
                  if (disabled) return;
                  if (isSearching) {
                    const el = document.querySelector(`#level-${lv}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    setCollapsed(p => ({ ...p, [lv]: !p[lv] }));
                  }
                }}
                style={{ 
                  borderColor: color.border,
                  opacity: disabled ? .45 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
                title={
                  disabled
                    ? `No results in Level ${lv}`
                    : (isCol ? `Expand Level ${lv}` : `Collapse Level ${lv}`)
                }
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 20, borderRadius: 6, background: color.border }} />
                  Level {lv}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="ln-left-pill" style={{ color: color.border }}>{n}/{total}</span>
                  {/* 箭头只体现“当前折叠态”，搜索时我们不切折叠，所以维持当前 UI */}
                  <span className={`ln-left-arrow ${isCol ? "collapsed" : ""}`}
                        style={{ display: "inline-block", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `10px solid ${color.border}` }} />
                </span>
              </button>
            );
          })}
          {/* 一键折叠/展开全部（非搜索才有意义，但不做强限制） */}
          <button className="ln-left-btn" onClick={() => setCollapsed({ 1: true, 2: true, 3: true })}>
            Collapse all
          </button>
          <button className="ln-left-btn" onClick={() => setCollapsed({ 1: false, 2: false, 3: false })}>
            Expand all
          </button>
        </aside>

        {/* 右侧主列（仅渲染网格分组；搜索时强制展开并隐藏空 Level） */}
        <main className="ln-main">
          {[1,2,3].map((lv) => {
            const items = buckets[lv];
            if (isSearching && items.length === 0) return null;  // 搜索时隐藏空组

            const color = LEVEL_COLORS[lv];
            const isCol = isSearching ? false : collapsed[lv];  // 搜索时强制展开

            return (
              <section key={lv} id={`level-${lv}`}>
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
                      No items in this level.
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
    </div>
  );
}
