import { useState, useEffect, useMemo } from "react";
import { letters, numbers } from "../data/letters.js";

const STORAGE_KEY = "LN_LEARNED_V2";

// 顶部避让 & 搜索区高度（用于与左侧首排卡片齐平）
const TOP_GAP = 96;
const SEARCH_BLOCK_H = 128;

// 布局尺寸
const MAX_W = 1200;  // 容器最大宽度
const RIGHT_W = 440; // 右侧固定栏宽度
const GAP = 24;      // 左右列间距

export default function LettersNumbers() {
  const [current, setCurrent] = useState(null);   // 正在展示的 item
  const [pending, setPending] = useState(null);   // 等待切换的 item
  const [open, setOpen] = useState(false);        // 右栏是否展开（决定整块上下滑）
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
  }, [learned]);

  const all = useMemo(() => [...letters, ...numbers], []);
  const filtered = useMemo(
    () => all.filter((x) => x.toLowerCase().includes(search.toLowerCase())),
    [all, search]
  );

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

  // —— 样式 —— //
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

  // 点击左侧卡片：处理“地鼠”效果
  const handleSelect = (item) => {
    if (!current) {
      // 第一次打开：直接设置内容并上滑进入
      setCurrent(item);
      setOpen(true);
      return;
    }
    if (item === current) return; // 点了同一个，忽略
    // 有内容时切换：先下滑关闭，等 transition 结束再换内容上滑
    setPending(item);
    setOpen(false);
  };

  // 面板过渡结束：如果刚刚是“下滑关闭”并且有 pending，则换内容并上滑
  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return; // 只关心 transform 动画
    if (!open && pending) {
      setCurrent(pending);
      setPending(null);
      // 下一帧再打开，确保浏览器应用了关闭状态后再触发上滑
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
        .ln-card img {
          height: 88px; width: auto; margin-bottom: 8px; transition: transform .15s ease;
        }
        .ln-card:hover img { transform: scale(1.06); }

        /* 面板固定：不随页面滚动 */
        .ln-fixed-right {
          position: fixed;
          top: ${TOP_GAP + SEARCH_BLOCK_H}px;         /* 与左侧首排对齐 */
          right: calc((100vw - ${MAX_W}px) / 2);      /* 与容器右缘对齐 */
          width: ${RIGHT_W}px;
          height: calc(100vh - ${TOP_GAP + SEARCH_BLOCK_H}px - 0px);
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 18px 18px 0 0;               /* 底部直角 */
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
          overflow: hidden;

          /* 关键：整块面板的上下滑动（默认隐藏在底部） */
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
          overflow: auto;           /* 内容多时内部滚，不影响外层固定 */
          padding: 28px;
          display: grid;
          place-items: center;
          background: #fff;
        }

        /* 底部操作条：矩形、贴右栏底 */
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

        /* 左侧网格为右栏预留空间 */
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
        {/* 搜索 + 进度 */}
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

        {/* 左侧网格 */}
        <div className="ln-left-grid">
          {filtered.map((item) => (
            <div key={item} className="ln-card" onClick={() => handleSelect(item)}>
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

      {/* 右侧固定详情：整块面板按 open 状态上下滑；过渡结束后若 pending 则切页再上滑 */}
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
