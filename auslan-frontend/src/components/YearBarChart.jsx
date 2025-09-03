// components/YearBarChart.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Plot from "react-plotly.js";

const API = "https://auslan-backend.onrender.com";

export default function YearBarChart() {
  const [data, setData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const chartRef = useRef();
  const animationRef = useRef([]);

  // Detect scroll to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldAnimate) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.3 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [shouldAnimate]);

  // Fetch population data
  useEffect(() => {
    fetch(`${API}/year/population-by-year`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.yearly_population) {
          setData(json.yearly_population);
        }
      })
      .catch(console.error);
  }, []);

  // Prepare initial zero-height bars
  useEffect(() => {
    if (data.length > 0) {
      const initial = data.map(() => 0);
      animationRef.current = [...initial];
      setAnimatedData(initial);
    }
  }, [data]);

  // Animate bars sequentially
  useEffect(() => {
    if (!shouldAnimate || data.length === 0) return;

    let index = 0;

    const animateBar = () => {
      const target = data[index].population;
      const startTime = performance.now();
      const duration = 1000;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const value = Math.floor(target * eased);

        animationRef.current[index] = value;
        setAnimatedData([...animationRef.current]);

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          animationRef.current[index] = target;
          setAnimatedData([...animationRef.current]);
          index++;
          if (index < data.length) {
            setTimeout(animateBar, 200); // delay before next bar
          }
        }
      };

      requestAnimationFrame(step);
    };

    animateBar();
  }, [shouldAnimate, data]);

  const { years, maxPopulation } = useMemo(() => {
    const y = data.map((d) => String(d.year)); // convert to string for x-axis
    const max = Math.max(...data.map((d) => d.population));
    return { years: y, maxPopulation: Math.ceil(max * 1.15) };
  }, [data]);

  const yearColors = [
    "#ADD8E6", "#FFDFBA", "#FFB6C1", "#FFD580", "#A0D995", "#CBAACB"
  ];

  const chartData = [
    {
      type: "bar",
      x: years,
      y: animatedData,
      marker: {
        color: years.map((_, i) => yearColors[i % yearColors.length]),
        line: { color: "#1E40AF", width: 1.5 },
      },
      hovertemplate: "<b>Year %{x}</b><br>Population: %{y:,}<extra></extra>",
      text: animatedData.map((val, i) => {
        const complete = data[i] && val >= data[i].population * 0.95;
        return complete && val > 0 ? val.toLocaleString() : "";
      }),
      textposition: "outside",
      textfont: {
        size: 16,
        color: "#000000",
        family: "Arial Black, Arial, sans-serif", // Bold
      },
    },
  ];

  const layout = {
    title: {
      text: "",
      font: {
        size: 22,
        color: "#2D3436",
        family: "Arial, sans-serif",
      },
      x: 0.5,
    },
    xaxis: {
      title: "Year",
      tickfont: { size: 14 },
      titlefont: { size: 16 },
      tickangle: -25,
      tickmode: "array",
      tickvals: years,
      ticktext: years,
      showgrid: false,
    },
    yaxis: {
      title: "Population",
      range: [0, maxPopulation],
      tickfont: { size: 14 },
      titlefont: { size: 16 },
      showgrid: true,
      gridcolor: "rgba(0,0,0,0.08)",
    },
    bargap: 0.35,
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 70, r: 30, t: 80, b: 60 },
    showlegend: false,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
  };

  return (
    <div
      ref={chartRef}
      style={{
        maxWidth: 900,
        margin: "30px auto",
        padding: "15px",
      }}
    >
      {!data.length ? (
        <div
          style={{
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6B7280",
            fontSize: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        >
          Loading population data...
        </div>
      ) : (
        <Plot
          data={chartData}
          layout={layout}
          config={config}
          useResizeHandler
          style={{ width: "100%", height: 520 }}
        />
      )}
    </div>
  );
}