import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";

const API = import.meta.env.VITE_API_BASE_URL || "https://auslan-backend.onrender.com";

export default function PyramidAnimated({ height = 520 }) {
  const [rows, setRows] = useState([]);
  const [valueCol, setValueCol] = useState(null);
  const [animateNow, setAnimateNow] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [bounceEffect, setBounceEffect] = useState(false);

  useEffect(() => {
    fetch(`${API}/violin/age-data`)
      .then((r) => r.json())
      .then((json) => {
        setRows(json.rows || []);
        setValueCol(json.value_column);
        setTimeout(() => setAnimateNow(true), 300);
      })
      .catch(console.error);
  }, []);

  const { yLabels, maleX, femaleX, maleAbs, femaleAbs } = useMemo(() => {
    if (!rows.length || !valueCol) {
      return { yLabels: [], maleX: [], femaleX: [], maleAbs: [], femaleAbs: [] };
    }

    const y = rows.map((r) => r.Age_years);
    const totals = rows.map((r) => Number(r[valueCol]) || 0);
    const male = totals.map((v) => Math.floor(v * 0.51));
    const female = totals.map((v, i) => v - male[i]);

    return {
      yLabels: y,
      maleX: male.map((v) => -v),
      femaleX: female,
      maleAbs: male,
      femaleAbs: female,
    };
  }, [rows, valueCol]);

  const zeros = useMemo(() => new Array(yLabels.length).fill(0), [yLabels.length]);

  const rainbowColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
  ];

  const baseBarWidth = 0.8;
  const hoverBarWidth = 1.2;

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

  const maleColors = yLabels.map((_, i) => {
    const colorIndex = i % rainbowColors.length;
    const baseColor = rainbowColors[colorIndex];
    const isHovered = hovered && hovered.trace === 0 && hovered.idx === i;
    return isHovered ? `${baseColor}FF` : `${baseColor}CC`;
  });

  const femaleColors = yLabels.map((_, i) => {
    const colorIndex = (i + 5) % rainbowColors.length;
    const baseColor = rainbowColors[colorIndex];
    const isHovered = hovered && hovered.trace === 1 && hovered.idx === i;
    return isHovered ? `${baseColor}FF` : `${baseColor}CC`;
  });

  const maleBorderColors = yLabels.map((_, i) => {
    const isHovered = hovered && hovered.trace === 0 && hovered.idx === i;
    return isHovered ? "#FFD700" : "rgba(255, 255, 255, 0.8)";
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

  const triggerBounce = () => {
    setBounceEffect(true);
    setTimeout(() => setBounceEffect(false), 600);
  };

  const data = useMemo(() => [
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
        opacity: 0.9,
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
          family: "Arial, sans-serif",
        },
        borderwidth: 2,
      },
      animation: false,
      showlegend: false, // disable legend symbol
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
        opacity: 0.9,
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
          family: "Arial, sans-serif",
        },
        borderwidth: 2,
      },
      animation: false,
      showlegend: false, // disable legend symbol
    }
  ], [
    yLabels, maleX, femaleX, zeros, animateNow,
    maleAbs, femaleAbs, maleWidths, femaleWidths,
    maleColors, femaleColors, maleBorderColors,
    femaleBorderColors, maleBorderWidths, femaleBorderWidths, hovered
  ]);

  const maxSide = useMemo(() => {
    const m = Math.max(...maleX.map(Math.abs), ...femaleX);
    return Math.ceil((m || 1000) * 1.2);
  }, [maleX, femaleX]);

  const layout = {
    height,
    barmode: "overlay",
    bargap: 0.1,
    paper_bgcolor: "rgba(240, 248, 255, 0.3)",
    plot_bgcolor: "rgba(255, 255, 255, 0.8)",
    margin: { l: 150, r: 80, t: 60, b: 80 },

    title: {
      text: "",
      font: {
        size: 20,
        color: "#2D3436",
        family: "Arial, sans-serif",
      },
      x: 0.5,
      xanchor: "center",
    },

    xaxis: {
      range: [-maxSide, maxSide],
      tickvals: [-maxSide, -Math.floor(maxSide * 0.5), 0, Math.floor(maxSide * 0.5), maxSide],
      ticktext: [`${maxSide}`, `${Math.floor(maxSide * 0.5)}`, "0", `${Math.floor(maxSide * 0.5)}`, `${maxSide}`],
      title: {
        text: "👈 Boys Count　　　　　　Girls Count 👉",
        font: { size: 16, color: "#2D3436" },
      },
      zeroline: true,
      zerolinewidth: 3,
      zerolinecolor: "#FFD700",
      gridcolor: "rgba(100, 100, 100, 0.1)",
      tickfont: { color: "#2D3436", size: 12 },
    },

    yaxis: {
      autorange: "reversed",
      title: {
        text: "",
        font: { size: 16, color: "#2D3436" },
      },
      tickfont: { color: "#2D3436", size: 12 },
      gridcolor: "rgba(100, 100, 100, 0.1)",
    },

    showlegend: false, // disable Plotly legend

    hovermode: "closest",
    hoverlabel: { namelength: 0 },

    transition: {
      duration: 800,
      easing: "bounce-out",
    },

    hoverdistance: 10,
    uirevision: true,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
    doubleClick: false,
    scrollZoom: false,
  };

  if (!yLabels.length) return null;

  return (
    <div className="relative w-full">
      <Plot
        data={data}
        layout={layout}
        config={config}
        useResizeHandler
        style={{ width: "100%", height }}
        animate={animateNow}
        animationOptions={{
          transition: {
            duration: 1000,
            easing: "bounce-out",
          },
          frame: {
            duration: 100,
            redraw: false,
          },
        }}
        onHover={(ev) => {
          const p = ev.points?.[0];
          if (p) {
            setHovered({ trace: p.curveNumber, idx: p.pointNumber });
          }
        }}
        onUnhover={() => setHovered(null)}
        onClick={(ev) => {
          const p = ev.points?.[0];
          if (p) {
            setHovered({ trace: p.curveNumber, idx: p.pointNumber });
            triggerBounce();
            setTimeout(() => {
              setHovered(null);
            }, 1000);
          }
        }}
      />

      {/* Custom legend below chart */}
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: "#333" }}>
        
      </div>
    </div>
  );
}