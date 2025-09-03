// components/YearBarChart.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Plot from "react-plotly.js";

const API = "https://auslan-backend.onrender.com";

export default function YearBarChart() {
  const [data, setData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const chartRef = useRef();

  // Intersection Observer to detect scroll-into-view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch data once only
  useEffect(() => {
    fetch(`${API}/year/population-by-year`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.yearly_population) {
          setData(json.yearly_population);
        }
      })
      .catch(console.error);
  }, []);

  // Animate when allowed
  useEffect(() => {
    if (!shouldAnimate || !data.length) return;

    let i = 0;
    const fullData = data;
    const animArray = new Array(fullData.length).fill(0);

    const animateBar = () => {
      if (i >= fullData.length) return;

      let frame = 0;
      const target = fullData[i].population;
      const step = Math.ceil(target / 100); // slower growth

      const grow = () => {
        if (frame < target) {
          frame += step;
          animArray[i] = Math.min(frame, target);
          setAnimatedData([...animArray]);
          requestAnimationFrame(grow);
        } else {
          i++;
          setTimeout(animateBar, 400); // longer pause before next bar
        }
      };

      grow();
    };

    animateBar();
  }, [shouldAnimate, data]);

  const { years, maxPopulation } = useMemo(() => {
    const y = data.map((d) => d.year);
    const max = Math.max(...data.map((d) => d.population || 0));
    return { years: y, maxPopulation: Math.ceil(max * 1.2) };
  }, [data]);

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
      range: [0, maxPopulation],
      tickfont: { size: 14 },
    },
    bargap: 0.3,
    plot_bgcolor: "rgba(255,255,255,0.85)",
    paper_bgcolor: "rgba(240, 248, 255, 0.3)",
    margin: { l: 60, r: 30, t: 60, b: 50 },
  };

  const chartData = [
    {
      type: "bar",
      x: years,
      y: animatedData,
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

  if (!years.length || !animatedData.length) return <div ref={chartRef} style={{ height: 500 }}></div>;

  return (
    <div ref={chartRef} className="relative w-full" style={{ maxWidth: 800, margin: "0 auto" }}>
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