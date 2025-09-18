import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "LN_LEARNED_V2";

// 顶部避让 & 搜索区高度（用于与左侧首排卡片齐平）
const TOP_GAP = 96;
const SEARCH_BLOCK_H = 128;

// 布局尺寸
const MAX_W = 1200;  // 容器最大宽度
const RIGHT_W = 600; // 右侧固定栏宽度
const GAP = 24;      // 左右列间距

// ✅ 你的后端接口（返回所有单词/视频）
const API_URL = "https://auslan-backend.onrender.com/videos/";

export default function BasicWords() {
  const [current, setCurrent] = useState(null);   // 正在展示的 item（对象）
  const [pending, setPending] = useState(null);   // 等待切换的 item（对象）
  const [open, setOpen] = useState(false);        // 右栏是否展开
  const [learned, setLearned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
  });
  const [search, setSearch] = useState("");

  // 🔄 从远端加载 words（保持 UI 不变，仅替换数据源）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [words, setWords] = useState([]); // [{id, title, url}, ...]

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // ✅ 兼容不同后端字段名：优先 title，其次 name/word/text
        // 原来：const normalized = (Array.isArray(data) ? data : []).map((x, idx) => { ... });

  const normalized = (Array.isArray(data) ? data : []).map((x, idx) => {
    const title =
      x.filename?.toString() ||  // ✅ 用后端的 filename
      x.title?.toString() ||
      x.name?.toString() ||
      x.word?.toString() ||
      x.text?.toString() ||
      `Item ${idx + 1}`;

    const url =
      (typeof x.url === "string" ? x.url : null);   // ✅ 用后端的 url（是完整的 S3 链接）

    return {
      id: x.id ?? x._id ?? `${title}-${idx}`,
      title,
      url,
      raw: x,
    };
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

  // Sort words alphabetically by title
  const all = useMemo(() => {
    return [...words].sort((a, b) => a.title.localeCompare(b.title));
  }, [words]);

  // Filter by first letter only
  const filtered = useMemo(
    () =>
      search
        ? all.filter((x) => x.title[0]?.toLowerCase() === search[0]?.toLowerCase())
        : all,
    [all, search]
  );

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

  // 点击左侧卡片：处理“地鼠”效果（保持原交互）
  const handleSelect = (item) => {
    if (!current) {
      setCurrent(item);
      setOpen(true);
      return;
    }
    if (item?.id === current?.id) return;
    setPending(item);
    setOpen(false);
  };

  // 面板过渡结束：如果刚刚是“下滑关闭”并且有 pending，则换内容并上滑
  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return; // 只关心 transform 动画
    if (!open && pending) {
      setCurrent(pending);
      setPending(null);
      requestAnimationFrame(() => setOpen(true));
    }
  };

  // 计算进度（用 title 作为唯一键存储）
  const learnedCount = useMemo(() => {
    const keys = new Set([...learned]);
    return all.reduce((acc, x) => acc + (keys.has(x.title) ? 1 : 0), 0);
  }, [all, learned]);


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
        /* 这里不再显示图片缩略图，保留原有 hover 质感 */
        .ln-card-title {
          letter-spacing: .5px;
          line-height: 1.2;
          font-size: 18px;
          padding: 10px 6px 4px;
          word-break: break-word;
        }

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

        /* 左侧网格 */
        .ln-left-grid {
          margin-right: ${RIGHT_W + GAP}px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);  /* ✅ 固定三列 */
          gap: 12px;                              /* ✅ 缩小间距 */
          align-content: start;
        }

        .ln-card {
          padding: 10px 6px;                      /* ✅ 缩小按钮 */
          font-size: 16px;
        }


        .ln-card-learned {
          border: 2px solid #FFA500;  /* 橙色边框 */
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
                marginLeft: 12,
                padding: "4px 10px",
                fontSize: 14,
                border: "1px solid #ddd",
                borderRadius: 6,
                cursor: "pointer",
                background: "#fff",
              }}
            >
              Clear All
            </button>
          )}
        </div>





        {/* 状态提示 */}
        {loading && (
          <div style={{ textAlign: "center", margin: "8px 0 16px", color: "#6B7280" }}>
            Loading words...
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", margin: "8px 0 16px", color: "#ef4444" }}>
            {error}
          </div>
        )}

        {/* 左侧网格 */}
        <div className="ln-left-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`ln-card ${learned.has(item.title) ? "ln-card-learned" : ""}`}
              onClick={() => handleSelect(item)}
            >
              <div className="ln-card-title">{item.title}</div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6B7280" }}>
              No results.
            </div>
          )}
        </div>
      </div>

      {/* 右侧固定详情 */}
      {/* 右侧固定详情 */}
      <aside
        className={`ln-fixed-right ${open ? "open" : ""}`}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        <div className="ln-stage">
          {current ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <h2 style={{ marginBottom: 12, fontSize: 28 }}>{current.title}</h2>

              {/* 如果有视频地址则播放；没有则给个友好提示 */}
              {current.url ? (
                <video
                  key={current.url}
                  src={current.url}
                  controls
                  style={{
                    maxHeight: "60vh", // 让视频更大
                    maxWidth: "100%",
                    borderRadius: 12,
                  }}
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
