import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";

const API = "https://auslan-backend.onrender.com";

export default function PyramidAnimated({ height = 520 }) {
  const [rows, setRows] = useState([]);
  const [valueCol, setValueCol] = useState(null);
  const [animateNow, setAnimateNow] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [bounceEffect, setBounceEffect] = useState(false);

  useEffect(() => {
    fetch(`${API}/violin/age-data`)
      .then(r => r.json())
      .then(json => {
        setRows(json.rows || []);
        setValueCol(json.value_column);
        // 更快的延遲
        setTimeout(() => setAnimateNow(true), 300);
      })
      .catch(console.error);
  }, []);

  const { yLabels, maleX, femaleX, maleAbs, femaleAbs } = useMemo(() => {
    if (!rows.length || !valueCol) {
      return { yLabels: [], maleX: [], femaleX: [], maleAbs: [], femaleAbs: [] };
    }
    const y = rows.map(r => r.Age_years);
    const totals = rows.map(r => Number(r[valueCol]) || 0);
    const male = totals.map(v => Math.floor(v * 0.51));
    const female = totals.map((v, i) => v - male[i]);
    return {
      yLabels: y,
      maleX: male.map(v => -v),  
      femaleX: female,
      maleAbs: male,
      femaleAbs: female
    };
  }, [rows, valueCol]);

  const zeros = useMemo(() => new Array(yLabels.length).fill(0), [yLabels.length]);

  // 彩虹色彩 - 更鮮豔適合小孩
  const rainbowColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  // 可愛的動畫寬度變化
  const baseBarWidth = 0.8;
  const hoverBarWidth = 1.2; // 更明顯的放大效果

  const maleWidths = yLabels.map((_, i) => {
    const isHovered = hovered && hovered.trace === 0 && hovered.idx === i;
    const bounceScale = bounceEffect ? 1.1 : 1;
    return (isHovered ? hoverBarWidth : baseBarWidth) * bounceScale;
  });
  
  const femaleWidths = yLabels.map((_, i) => {
    const isHovered = hovered && hovered.trace === 1 && hovered.idx === i;
    const bounceScale = bounceEffect ? 1.1 : 1;
    return (isHovered ? hoverBarWidth : baseBarWidth) * bounceScale;
  });

  // 彩虹漸變顏色
  const maleColors = yLabels.map((_, i) => {
    const colorIndex = i % rainbowColors.length;
    const baseColor = rainbowColors[colorIndex];
    const isHovered = hovered && hovered.trace === 0 && hovered.idx === i;
    
    if (isHovered) {
      return `${baseColor}FF`; // 完全不透明
    }
    return `${baseColor}CC`; // 稍微透明
  });

  const femaleColors = yLabels.map((_, i) => {
    const colorIndex = (i + 5) % rainbowColors.length; // 錯開顏色
    const baseColor = rainbowColors[colorIndex];
    const isHovered = hovered && hovered.trace === 1 && hovered.idx === i;
    
    if (isHovered) {
      return `${baseColor}FF`;
    }
    return `${baseColor}CC`;
  });

  // 可愛的邊框效果
  const maleBorderColors = yLabels.map((_, i) => {
    const isHovered = hovered && hovered.trace === 0 && hovered.idx === i;
    return isHovered ? "#FFD700" : "rgba(255, 255, 255, 0.8)"; // 金色邊框當hover
  });

  const femaleBorderColors = yLabels.map((_, i) => {
    const isHovered = hovered && hovered.trace === 1 && hovered.idx === i;
    return isHovered ? "#FFD700" : "rgba(255, 255, 255, 0.8)";
  });

  const maleBorderWidths = yLabels.map((_, i) =>
    hovered && hovered.trace === 0 && hovered.idx === i ? 4 : 2
  );
  const femaleBorderWidths = yLabels.map((_, i) =>
    hovered && hovered.trace === 1 && hovered.idx === i ? 4 : 2
  );

  // 彈跳效果
  const triggerBounce = () => {
    setBounceEffect(true);
    setTimeout(() => setBounceEffect(false), 600);
  };

  const data = useMemo(() => ([
    {
      type: "bar",
      orientation: "h",
      y: yLabels,
      x: animateNow ? maleX : zeros,
      name: "Boys 👦",
      marker: {
        color: maleColors,
        line: {
          color: maleBorderColors,
          width: maleBorderWidths,
        },
        opacity: 0.9
      },
      width: maleWidths,
      hovertemplate: "Age: %{y} years<br>Boys count: %{customdata:,}<br>👦<extra></extra>",
      customdata: maleAbs,
      hoverlabel: {
        bgcolor: "rgba(255, 255, 255, 0.95)",
        bordercolor: "#FFD700",
        font: { 
          color: "#333", 
          size: 14,
          family: "Arial, sans-serif"
        },
        borderwidth: 2
      },
      // 關鍵：移除所有動畫效果讓hover即時響應
      animation: false
    },
    {
      type: "bar",
      orientation: "h",
      y: yLabels,
      x: animateNow ? femaleX : zeros,
      name: "Girls 👧",
      marker: {
        color: femaleColors,
        line: {
          color: femaleBorderColors,
          width: femaleBorderWidths,
        },
        opacity: 0.9
      },
      width: femaleWidths,
      hovertemplate: "Age: %{y} years<br>Girls count: %{customdata:,}<br>👧<extra></extra>",
      customdata: femaleAbs,
      hoverlabel: {
        bgcolor: "rgba(255, 255, 255, 0.95)",
        bordercolor: "#FFD700",
        font: { 
          color: "#333", 
          size: 14,
          family: "Arial, sans-serif"
        },
        borderwidth: 2
      },
      // 關鍵：移除所有動畫效果讓hover即時響應
      animation: false
    }
  ]), [yLabels, maleX, femaleX, zeros, animateNow, maleAbs, femaleAbs, maleWidths, femaleWidths, maleColors, femaleColors, maleBorderColors, femaleBorderColors, maleBorderWidths, femaleBorderWidths, hovered]);

  const maxSide = useMemo(() => {
    const m = Math.max(...maleX.map(Math.abs), ...femaleX);
    return Math.ceil((m || 1000) * 1.2); // 稍微多留點空間
  }, [maleX, femaleX]);

  const layout = {
    height,
    barmode: "overlay",
    bargap: 0.1, // 更緊密的間距
    paper_bgcolor: "rgba(240, 248, 255, 0.3)", // 淡藍色背景
    plot_bgcolor: "rgba(255, 255, 255, 0.8)",
    margin: { l: 150, r: 80, t: 60, b: 80 },
    
    title: {
      text: "",
      font: { 
        size: 20, 
        color: "#2D3436",
        family: "Arial, sans-serif"
      },
      x: 0.5,
      xanchor: 'center'
    },
    
    xaxis: {
      range: [-maxSide, maxSide],
      tickvals: [-maxSide, -Math.floor(maxSide * 0.5), 0, Math.floor(maxSide * 0.5), maxSide],
      ticktext: [`${maxSide}`, `${Math.floor(maxSide * 0.5)}`, "0", `${Math.floor(maxSide * 0.5)}`, `${maxSide}`],
      title: { 
        text: "👈 Boys Count　　　　　　Girls Count 👉",
        font: { size: 16, color: "#2D3436" }
      },
      zeroline: true, 
      zerolinewidth: 3, 
      zerolinecolor: "#FFD700", // 金色中線
      gridcolor: "rgba(100, 100, 100, 0.1)",
      tickfont: { color: "#2D3436", size: 12 }
    },
    yaxis: {
      autorange: "reversed",
      title: { 
        text: "",
        font: { size: 16, color: "#2D3436" }
      },
      tickfont: { color: "#2D3436", size: 12 },
      gridcolor: "rgba(100, 100, 100, 0.1)"
    },
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: 'center',
      y: -0.15,
      font: { size: 16, color: "#2D3436" }
    },
    hovermode: "closest",
    hoverlabel: {
      namelength: 0
    },
    // 快速動畫
    transition: { 
      duration: 800, 
      easing: "bounce-out"
    },
    // 即時hover響應
    hovermode: "closest",
    hoverdistance: 10,
    // 關鍵：禁用所有過渡動畫
    uirevision: true
  };

  const config = { 
    responsive: true, 
    displayModeBar: false, 
    staticPlot: false,
    doubleClick: false, // 防止小孩誤觸重置
    scrollZoom: false
  };

  if (!yLabels.length) return null;

  return (
    <div className="relative w-full">
      {/* 刪除按鈕區域 */}
      
      <Plot
        data={data}
        layout={layout}
        config={config}
        useResizeHandler
        style={{ width: "100%", height }}
        animate={animateNow} // 只在初始載入時動畫
        animationOptions={{
          transition: { 
            duration: 1000, // 加快動畫
            easing: "bounce-out" 
          },
          frame: { 
            duration: 100, // 更快的幀率
            redraw: false
          }
        }}
        
        onHover={(ev) => {
          const p = ev.points?.[0];
          if (p) {
            setHovered({ trace: p.curveNumber, idx: p.pointNumber });
          }
        }}
        onUnhover={() => setHovered(null)}
        
        // 點擊會有驚喜效果
        onClick={(ev) => {
          const p = ev.points?.[0];
          if (p) {
            // 創造彩虹閃爍效果
            setHovered({ trace: p.curveNumber, idx: p.pointNumber });
            triggerBounce(); // 觸發整體彈跳
            setTimeout(() => {
              setHovered(null);
            }, 1000);
          }
        }}
      />
      
      {/* 移除說明文字 */}
    </div>
  );
}