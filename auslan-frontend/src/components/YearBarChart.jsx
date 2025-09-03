// components/YearBarChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";

const API = "https://auslan-backend.onrender.com";

export default function YearBarChart() {
  const [data, setData] = useState([]);
  const [animateNow, setAnimateNow] = useState(false);

  useEffect(() => {
    fetch(`${API}/year/population-by-year`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.yearly_population) {
          setData(json.yearly_population);
          setTimeout(() => setAnimateNow(true), 300);
        }
      })
      .catch(console.error);
  }, []);

  const { years, populations } = useMemo(() => {
    const y = data.map((d) => d.year);
    const p = data.map((d) => d.population);
    return { years: y, populations: p };
  }, [data]);

  const zeros = useMemo(() => new Array(years.length).fill(0), [years.length]);

  const layout = {
    title: {
      text: "Auslan Population by Year",
      font: {
        size: 20,
        color: "#2D3436",
        family: "Arial, sans-serif",
      },
      x: 0.5,
    },
    xaxis: {
      title: "Year",
      tickfont: { size: 14 },
    },
    yaxis: {
      title: "Population",
      rangemode: "tozero",
      tickfont: { size: 14 },
    },
    bargap: 0.3,
    plot_bgcolor: "rgba(255,255,255,0.85)",
    paper_bgcolor: "rgba(240, 248, 255, 0.3)",
    margin: { l: 60, r: 30, t: 60, b: 50 },
    transition: {
      duration: 500,
      easing: "cubic-in-out",
    },
  };

  const chartData = [
    {
      type: "bar",
      x: years,
      y: animateNow ? populations : zeros,
      marker: {
        color: "#4ECDC4",
        line: {
          width: 2,
          color: "#2C3E50",
        },
      },
      hovertemplate: "Year: %{x}<br>Population: %{y:,}<extra></extra>",
    },
  ];

  const config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
    scrollZoom: false,
  };

  if (!years.length) return null;

  return (
    <div className="relative w-full" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Plot
        data={chartData}
        layout={layout}
        config={config}
        useResizeHandler
        style={{ width: "100%", height: 500 }}
      />
    </div>
  );
}