import { useState, useEffect, useMemo } from "react";
import { letters, numbers } from "../data/letters.js";

const STORAGE_KEY = "LN_LEARNED_V2";

// Layout constants
const TOP_GAP = 96;
const SEARCH_BLOCK_H = 128;
const MAX_W = 1200;  // Max container width
const RIGHT_W = 440; // Right panel width
const GAP = 24;      // Gap between grid and right panel

export default function LettersNumbers() {
  // Current selected item in detail panel
  const [current, setCurrent] = useState(null);
  // Next pending item to switch to after transition
  const [pending, setPending] = useState(null);
  // Whether the right panel is open (controls slide animation)
  const [open, setOpen] = useState(false);
  // Learned items, stored in localStorage
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });
  // Search filter state
  const [search, setSearch] = useState("");

  // Sync learned data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
  }, [learned]);

  // Merge all letters and numbers
  const all = useMemo(() => [...letters, ...numbers], []);
  // Filter items based on search
  const filtered = useMemo(
    () => all.filter((x) => x.toLowerCase().includes(search.toLowerCase())),
    [all, search]
  );

  // Mapping characters to sign language images
  const imgMap = {
    A: "/assets/signs/A.PNG", B: "/assets/signs/B.PNG", C: "/assets/signs/C.PNG",
    D: "/assets/signs/D.PNG", E: "/assets/signs/E.PNG", F: "/assets/signs/F.PNG",
    G: "/assets/signs/G.PNG", H: "/assets/signs/H.PNG", I: "/assets/signs/I.PNG",
    J: "/assets/signs/J.PNG", K: "/assets/signs/K.PNG", L: "/assets/signs/L.PNG",
    M: "/assets/signs/M.PNG", N: "/assets/signs/N.PNG", O: "/assets/signs/O.PNG",
    P: "/assets/signs/P.PNG", Q: "/assets/signs/Q.PNG", R: "/assets/signs/R.PNG",
    S: "/assets/signs/S.PNG", T: "/assets/signs/T.PNG", U: "/assets/signs/U.PNG",
    V: "/assets/signs/V.PNG", W: "/assets/signs/W.PNG", X: "/assets/signs/X.PNG",
    Y: "/assets/signs/Y.PNG", Z: "/assets/signs/Z.PNG",
    0: "/assets/signs/0.PNG", 1: "/assets/signs/1.PNG", 2: "/assets/signs/2.PNG",
    3: "/assets/signs/3.PNG", 4: "/assets/signs/4.PNG", 5: "/assets/signs/5.PNG",
    6: "/assets/signs/6.PNG", 7: "/assets/signs/7.PNG", 8: "/assets/signs/8.PNG", 9: "/assets/signs/9.PNG",
  };

  // --- Page Styles --- //
  const page = {
    minHeight: "100vh",
    background: "#F6F7FB",
    padding: "24px",
    paddingTop: TOP_GAP + 24,
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    color: "#222",
  };

  const container = {
    maxWidth: MAX_W,
    margin: "0 auto",
  };

  // Handle card selection on left grid
  const handleSelect = (item) => {
    if (!current) {
      // First open: directly show detail panel
      setCurrent(item);
      setOpen(true);
      return;
    }
    if (item === current) return; // Clicked same item, ignore
    // When switching items: close first, then open next after animation
    setPending(item);
    setOpen(false);
  };

  // Handle slide animation end for panel transition
  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return;
    if (!open && pending) {
      setCurrent(pending);
      setPending(null);
      requestAnimationFrame(() => setOpen(true));
    }
  };

  return (
    <div style={page}>
      <style>{`
        .ln-card {
          background: #fff;
          border-radius: 16px;
          padding: 14px 10px;
          text-align: center;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,.06);
          border: 1px solid #EEF0F2;
          user-select: none;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .ln-card:hover {
          transform: translateY(-2px);
          border-color: #CFD4DC;
          box-shadow: 0 10px 22px rgba(0,0,0,.12);
        }
        .ln-card.learned {
          background: linear-gradient(135deg, #FFD166, #F77F00);
          color: #fff;
          border-color: #F77F00;
          box-shadow: 0 6px 16px rgba(247, 127, 0, 0.3);
        }
        .ln-card.learned img {
          filter: brightness(1.05);
        }

        .ln-card img {
          height: 88px; width: auto; margin-bottom: 8px; transition: transform .15s ease;
        }
        .ln-card:hover img { transform: scale(1.06); }

        /* Fixed right detail panel */
        .ln-fixed-right {
          position: fixed;
          top: ${TOP_GAP + SEARCH_BLOCK_H}px;
          right: calc((100vw - ${MAX_W}px) / 2);
          width: ${RIGHT_W}px;
          height: calc(100vh - ${TOP_GAP + SEARCH_BLOCK_H}px);
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 18px 18px 0 0;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
          overflow: hidden;

          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
          transition: transform .45s ease-in-out, opacity .45s ease-in-out;
          will-change: transform, opacity;
        }
        .ln-fixed-right.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .ln-stage {
          flex: 1;
          overflow: auto;
          padding: 28px;
          display: grid;
          place-items: center;
          background: #fff;
        }

        /* Footer buttons inside right panel */
        .ln-detail-footer {
          height: 180px;
          background: #fff;
          border-top: 1px solid #EEF0F2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 18px 20px 0;
        }
        .ln-btn { border: none; border-radius: 10px; padding: 20px 32px; font-weight: 700; color: #fff; cursor: pointer; }
        .ln-btn.ok { background: #f2b64fff; }
        .ln-btn.bad { background: #ef4444ff; }

        /* Left grid layout with space for right panel */
        .ln-left-grid {
          margin-right: ${RIGHT_W + GAP}px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 18px;
          align-content: start;
        }

        @media (max-width: ${MAX_W + RIGHT_W + GAP}px) {
          .ln-left-grid { margin-right: ${RIGHT_W + 16}px; }
        }
        @media (max-width: 980px) {
          .ln-fixed-right { position: static; width: 100%; height: auto; border-radius: 16px;
            transform:none; opacity:1; pointer-events:auto; }
          .ln-left-grid { margin-right: 0; }
        }
      `}</style>

      <div style={container}>
        {/* Search input + progress bar */}
        <input
          type="text"
          placeholder="Search your letter or number..."
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
            width: `${Math.round((learned.size / all.length) * 100)}%`,
            background: "linear-gradient(90deg,#FFD166,#F77F00)",
          }}/>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          {learned.size}/{all.length} learned
        </div>

        {/* Main card grid */}
        <div className="ln-left-grid">
          {filtered.map((item) => (
            <div
              key={item}
              className={`ln-card ${learned.has(item) ? 'learned' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <img
                src={imgMap[item] || "/assets/placeholder.png"}
                alt={item}
                onError={(ev) => { ev.currentTarget.src = "/assets/placeholder.png"; }}
              />
              <div style={{ letterSpacing: 1 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right detail panel with animation */}
      <aside
        className={`ln-fixed-right ${open ? 'open' : ''}`}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        <div className="ln-stage">
          {current ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <h2 style={{ marginBottom: 12, fontSize: 28 }}>{current}</h2>
              <img
                src={imgMap[current] || "/assets/placeholder.png"}
                alt={current}
                style={{ maxHeight: 320, width: "auto" }}
                onError={(ev) => { ev.currentTarget.src = "/assets/placeholder.png"; }}
              />
            </div>
          ) : (
            <p style={{ color: "#eaca8dff" }}>Select a card to see details</p>
          )}
        </div>

        <div className="ln-detail-footer">
          <button
            className="ln-btn ok"
            onClick={() => current && setLearned((p) => new Set(p).add(current))}
            disabled={!current || !open}
            style={!current || !open ? { opacity: .6, cursor: "not-allowed" } : undefined}
          >
            Learned
          </button>
          <button
            className="ln-btn bad"
            onClick={() =>
              current && setLearned((p) => { const n = new Set(p); n.delete(current); return n; })
            }
            disabled={!current || !open}
            style={!current || !open ? { opacity: .6, cursor: "not-allowed" } : undefined}
          >
            Not yet
          </button>
        </div>
      </aside>
    </div>
  );
}
