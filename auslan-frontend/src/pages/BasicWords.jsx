import { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";


const STORAGE_KEY = "LN_LEARNED_V2";

/** Layout constants */
const TOP_GAP = 96;                // Top safe area for sticky/offset
const SEARCH_BLOCK_H = 128;        // Height used to offset the right panel when sticky
const MAX_W = 1320;                // Max container width
const RIGHT_W = 600;               // Fixed right detail panel width
const GAP = 24;                    // Gap between main column and right panel

/** Backend endpoint */
const API_URL = import.meta.env.VITE_VIDEOS_API_URL || "https://auslan-backend.onrender.com/videos/";

/** Category UI colors */
const CATEGORY_COLORS = {
  "1A. Essential Survival Signs": { bg: "#E6F7F2", bar: "#86E3CB", border: "#66D6BC" },
  "1B. Greetings & Social Basics": { bg: "#FFF4E0", bar: "#FFC36E", border: "#F7A940" },
  "2A. Family Members": { bg: "#ECEAFF", bar: "#B7B4FF", border: "#9895FF" },
  "2B. Feelings/Needs": { bg: "#F0F4FF", bar: "#93C5FD", border: "#3B82F6" },
  "3A. School/Play": { bg: "#FEF2F2", bar: "#FCA5A5", border: "#EF4444" },
  "3B. Everyday/Actions": { bg: "#F5F3FF", bar: "#C4B5FD", border: "#8B5CF6" },
  "4A. Basic Questions": { bg: "#ECFDF5", bar: "#6EE7B7", border: "#10B981" },
  "4B. Interaction Clarification": { bg: "#FFFBEB", bar: "#FDE68A", border: "#F59E0B" },
  Other: { bg: "#F3F4F6", bar: "#D1D5DB", border: "#6B7280" },
};

/** Generate a URL-friendly slug */
const slug = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

/** Map word titles to categories */
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
  C1A.forEach(k => m[k] = "1A. Essential Survival Signs");
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
  /** Selection + panel state */
  const [current, setCurrent] = useState(null);
  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);

  /** Learned set persisted to localStorage */
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
  });

  /** Search and tooltip state */
  const [search, setSearch] = useState("");
  const [showQRTooltip, setShowQRTooltip] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);

  /** Per-category collapsed state */
  const [collapsed, setCollapsed] = useState({});

  /** Data loading state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [words, setWords] = useState([]);

  /** Fetch words from backend */
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
        if (alive) setError(`Failed to load: ${e.message}`);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /** Persist learned set */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
  }, [learned]);

  /** All items sorted alphabetically */
  const all = useMemo(() => [...words].sort((a, b) => a.title.localeCompare(b.title)), [words]);

  /** Search filter (sanitized) */
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
  const isSearching = sanitizedSearch.trim().length > 0;

  /** Global progress */
  const learnedCount = useMemo(() => {
    const keys = new Set([...learned]);
    return all.reduce((acc, x) => acc + (keys.has(x.title) ? 1 : 0), 0);
  }, [all, learned]);

  /** Bucket items by category and sort within each bucket */
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

  /** Category list used by UI */
  const categories = [
    "1A. Essential Survival Signs",
    "1B. Greetings & Social Basics",
    "2A. Family Members",
    "2B. Feelings/Needs",
    "3A. School/Play",
    "3B. Everyday/Actions",
    "4A. Basic Questions",
    "4B. Interaction Clarification",
    "Other",
  ];

  /** Standalone actions: collapse/expand ALL categories */
  const collapseAll = () => {
    const state = {};
    categories.forEach((c) => (state[c] = true));
    setCollapsed(state);
  };
  const expandAll = () => {
    const state = {};
    categories.forEach((c) => (state[c] = false));
    setCollapsed(state);
  };

  /** Right detail panel selection logic (two-phase to support slide animation) */
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

  /** Page base style */
  const page = {
    minHeight: "100vh",
    background: "#F6F7FB",
    padding: "24px",
    paddingTop: TOP_GAP + 24,
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    color: "#222",
  };

  /** Handle QR click to zoom */
  const handleQRClick = () => {
    setQrZoomed(true);
    // Auto close after 10 seconds or user can click to close
    setTimeout(() => setQrZoomed(false), 10000);
  };

  return (
    <div style={page}>
      <style>{`
        .ln-card { background: #fff; border-radius: 16px; padding: 10px 6px; text-align: center; cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,.06); border: 1px solid #EEF0F2; user-select: none; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
        .ln-card:hover { transform: translateY(-2px); border-color: #CFD4DC; box-shadow: 0 10px 22px rgba(0,0,0,.12); }
        .ln-card-title { letter-spacing: .5px; line-height: 1.2; font-size: 16px; padding: 8px 6px 4px; word-break: break-word; }
        .ln-card-learned { border: 4px solid #FFA500; }

        /* Single-column layout (left nav removed) */
        .ln-layout { max-width: ${MAX_W}px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 16px; }

        .ln-main { margin-right: ${RIGHT_W + GAP}px; }

        .ln-fixed-right { position: fixed; top: ${TOP_GAP + SEARCH_BLOCK_H}px; right: calc((100vw - ${MAX_W}px) / 2); width: ${RIGHT_W}px; height: calc(100vh - ${TOP_GAP + SEARCH_BLOCK_H}px); display: flex; flex-direction: column; background: #fff; border-radius: 18px 18px 0 0; box-shadow: 0 10px 24px rgba(0,0,0,.12); overflow: hidden; transform: translateY(100%); opacity: 0; pointer-events: none; transition: transform .45s ease-in-out, opacity .45s ease-in-out; }
        .ln-fixed-right.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .ln-stage { flex: 1; overflow: auto; padding: 28px; display: grid; place-items: center; background: #fff; }
        .ln-detail-footer { height: 180px; background: #fff; border-top: 1px solid #EEF0F2; display:flex; align-items:center; justify-content:center; gap:16px; padding:18px 20px 0; }
        .ln-btn { border:none; border-radius:10px; padding:20px 32px; font-weight:700; color:#fff; cursor:pointer; }
        .ln-btn.ok { background:#f2b64fff; } .ln-btn.bad { background:#ef4444ff; }

        .ln-group-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-content: start; margin-bottom: 18px; transition: max-height .35s ease; }
        .ln-group-grid.collapsed { max-height: 0; overflow: hidden; }

        /* Top actions bar for Collapse/Expand buttons */
        /* Modernized Collapse/Expand buttons */
        .ln-actions {
          max-width: 960px;
          margin: 20px 0 20px 0;
          display: flex;
          gap: 16px;
          justify-content: flex-start; 
          margin-left: 230px; 
        }

        .ln-left-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 700;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .ln-left-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .ln-left-btn:hover::before {
          left: 100%;
        }

        .ln-left-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(102, 126, 234, 0.5);
        }

        .ln-left-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        
        @keyframes subtleGlow {
          0%, 100% {
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45);
          }
        }
        .ln-left-btn {
          animation: subtleGlow 3s infinite;
        }



        /* === Mini Quiz Button: identical to LettersNumbers === */
        .quiz-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 18px 32px;
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.8s ease-out, pulseGlow 3s infinite;
        }
        .quiz-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .quiz-button:hover::before { left: 100%; }
        .quiz-button:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(102,126,234,0.6); scale: 1.05; }
        .quiz-button:active { transform: translateY(-2px); scale: 1.02; }
        .quiz-button-icon { font-size: 24px; animation: bounce 2s infinite; }
        .quiz-button-text { font-weight: 800; letter-spacing: 0.5px; }

        /* Left-aligned container with same right offset as the detail panel */
        .quiz-button-container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 60px 0 40px 230px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: slideInUp 1s ease-out 0.5s both;
          margin-right: ${RIGHT_W + GAP}px; /* keep clear of right panel */
        }

        /* Animations (same as LettersNumbers) */
        @keyframes fadeInUp { from {opacity:0; transform: translateY(40px);} to {opacity:1; transform: translateY(0);} }
        @keyframes slideInUp { from {opacity:0; transform: translateY(60px);} to {opacity:1; transform: translateY(0);} }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
          50% { box-shadow: 0 8px 25px rgba(102,126,234,0.6), 0 0 0 0 rgba(102,126,234,0.4); }
        }
        @keyframes bounce {
          0%,20%,50%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        /* Responsive offsets (match LN behavior) */
        @media (max-width: ${MAX_W + RIGHT_W + GAP}px) {
          .quiz-button-container { margin-right: ${RIGHT_W + 16}px; }
        }
        @media (max-width: 980px) {
          .quiz-button-container {
            margin: 40px 0 10px 0;
            padding: 16px;
            margin-right: 0;
            justify-content: center;
          }
          .quiz-button { padding: 30px 24px; font-size: 16px; }
        }
        @media (max-width: 640px) {
          .quiz-button { padding: 14px 20px; font-size: 15px; }
          .quiz-button-icon { font-size: 20px; }
        }


        /* QR badge */
        .qr-container {
          position: fixed;
          bottom: 24px;
          right: 32px;
          background: #fff;
          border: 2px solid #E5E7EB;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          text-align: center;
          z-index: 9999;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: qrPulse 2s infinite;
          width: 120px;
          height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .qr-container:hover { 
          transform: scale(1.05); 
          box-shadow: 0 8px 20px rgba(0,0,0,0.15); 
          border-color: #3B82F6; 
        }

        .qr-container.zoomed {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(2);
          z-index: 10000;
          animation: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-color: #3B82F6;
          width: 180px;
          height: 180px;
        }

        .qr-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .qr-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .qr-text {
          font-size: 11px;
          color: #444;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }

        .qr-container:hover .qr-text {
          opacity: 1;
          transform: translateY(0);
        }

        .qr-container.zoomed .qr-text {
          opacity: 1;
          transform: translateY(0);
          font-size: 11.5px;
          max-width: 160px;
          margin-bottom: 12px;
        }

        .qr-tooltip {
          position: absolute; 
          bottom: 100%; 
          right: 0; 
          margin-bottom: 10px;
          background: #1F2937; 
          color: white; 
          padding: 8px 12px; 
          border-radius: 8px;
          font-size: 12px; 
          font-weight: 600; 
          white-space: nowrap; 
          opacity: 0;
          transform: translateY(10px); 
          transition: all 0.2s ease; 
          pointer-events: none;
        }
        .qr-tooltip:after {
          content: ''; 
          position: absolute; 
          top: 100%; 
          right: 20px;
          border: 5px solid transparent; 
          border-top-color: #1F2937;
        }
        .qr-tooltip.visible { 
          opacity: 1; 
          transform: translateY(0); 
        }

        .qr-tooltip.zoomed-text {
          position: fixed;
          bottom: auto;
          top: calc(50% + 120px);
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          margin: 0;
          background: #1F2937;
          font-size: 14px;
          z-index: 10001;
        }

        .qr-tooltip.zoomed-text:after {
          display: none;
        }

        .qr-icon { 
          display: inline-block; 
          margin-right: 4px; 
          animation: qrBounce 1.5s infinite; 
        }
        .qr-nav-arrow {
          position: absolute; 
          top: -15px; 
          right: 30px; 
          width: 0; 
          height: 0;
          border-left: 8px solid transparent; 
          border-right: 8px solid transparent;
          border-bottom: 15px solid #3B82F6; 
          animation: qrArrowBounce 1s infinite;
        }

        @keyframes qrPulse {
          0% { box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 0 0 8px rgba(59, 130, 246, 0.1); }
          100% { box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        @keyframes qrBounce { 
          0%,20%,50%,80%,100% { transform: translateY(0); } 
          40% { transform: translateY(-3px); } 
          60% { transform: translateY(-2px); } 
        }
        @keyframes qrArrowBounce { 
          0%,100% { transform: translateY(0); opacity: 1; } 
          50% { transform: translateY(-5px); opacity: 0.7; } 
        }

        @media (max-width: ${MAX_W + RIGHT_W + GAP}px) {
          .ln-main { margin-right: ${RIGHT_W + 16}px; }
        }
        @media (max-width: 980px) {
          .ln-layout { grid-template-columns: 1fr; }
          .ln-fixed-right { position: static; width: 100%; height: auto; border-radius: 16px; transform:none; opacity:1; pointer-events:auto; }
          .ln-main { margin-right: 0; }
          .ln-group-grid { grid-template-columns: repeat(2, 1fr); }
          .qr-container { bottom: 16px; right: 16px; }
        }
      `}</style>

      {/* Top: search + global progress */}
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
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          {learnedCount}/{all.length} learned
        </div>

        {/* Standalone actions just below the search bar */}
        <div className="ln-actions">
          <button className="ln-left-btn" onClick={collapseAll}>Collapse all</button>
          <button className="ln-left-btn" onClick={expandAll}>Expand all</button>
        </div>
      </div>

      {/* Status messages */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.75)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            fontSize: "20px",
            fontWeight: "600",
            color: "#2563EB",
          }}
        >
          <div
            style={{
              border: "6px solid #E5E7EB",
              borderTop: "6px solid #2563EB",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          />
          Loading words...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && <div style={{ textAlign: "center", color: "#ef4444" }}>{error}</div>}

      {/* Main layout: single column with category sections */}
      <div className="ln-layout">
        <main className="ln-main">
          {categories.map((cat) => {
            const items = buckets[cat] || [];
            if (isSearching && items.length === 0) return null; // Hide empty groups while searching

            const color = CATEGORY_COLORS[cat] || { border: "#cbd5e1" };
            const isCol = isSearching ? false : collapsed[cat]; // Force expand during search

            return (
              <section key={cat} id={`cat-${slug(cat)}`}>
                {/* Category header with collapse/expand toggle */}
                <div 
                  style={{
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    borderRadius: "16px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    userSelect: "none"
                  }}
                  onClick={() => setCollapsed(p => ({ ...p, [cat]: !p[cat] }))}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  <div style={{
                    width: "12px",
                    height: "24px",
                    background: color.bar,
                    borderRadius: "8px",
                    border: `2px solid ${color.border}`
                  }}></div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2D3748",
                    letterSpacing: "0.5px",
                    flex: 1
                  }}>
                    {cat}
                  </h3>
                  <div style={{
                    background: color.border,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}>
                    {items.length} words
                  </div>
                  {/* Arrow indicator */}
                  <div style={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "8px"
                  }}>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `8px solid ${color.border}`,
                      transform: isCol ? "rotate(-90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease"
                    }}></div>
                  </div>
                </div>

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

      {/* Right fixed detail panel */}
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

       {/* Quiz Button Section - Now Left Aligned */}
        <div className="quiz-button-container">
          <Link to="/quiz" className="quiz-button">
            <span className="quiz-button-icon">🧩</span>
            <span className="quiz-button-text">Test Your Knowledge - Mini Quiz</span>
            <span className="quiz-button-icon">✨</span>
          </Link>
        </div>
      

      {/* QR Overlay for zoomed state */}
      <div 
        className={`qr-overlay ${qrZoomed ? 'visible' : ''}`}
        onClick={() => setQrZoomed(false)}
      />

      {/* Floating QR Code with zoom functionality */}
      <div
        className={`qr-container ${qrZoomed ? 'zoomed' : ''}`}
        onMouseEnter={() => !qrZoomed && setShowQRTooltip(true)}
        onMouseLeave={() => !qrZoomed && setShowQRTooltip(false)}
        onClick={() => {
          if (qrZoomed) {
            setQrZoomed(false);
          } else {
            handleQRClick();
          }
        }}
      >
        {/* Navigation arrow indicator (hide when zoomed) */}
        {!qrZoomed && <div className="qr-nav-arrow"></div>}
        
        {/* Tooltip */}
        <div className={`qr-tooltip ${showQRTooltip && !qrZoomed ? 'visible' : ''} ${qrZoomed ? 'zoomed-text visible' : ''}`}>
          {qrZoomed ? 'Click to close or scan to access flashcards!' : 'Click to zoom or scan to access mobile flashcards!'}
        </div>
        
        {/* Text that appears on hover */}
        <div className="qr-text">
          <span className="qr-icon">📱</span>
          {qrZoomed ? "Flashcard Mode" : "Mobile Practice"}
        </div>
        
        <QRCodeCanvas
          value="https://helloauslan.me/flashcard" 
          size={qrZoomed ? 120 : 80}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          includeMargin={true}
          style={{ 
            borderRadius: "8px",
            transition: "all 0.3s ease"
          }}
        />
      </div>

    </div>
  );
}
