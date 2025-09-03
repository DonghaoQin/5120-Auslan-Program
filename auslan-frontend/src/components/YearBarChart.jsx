// components/YearBarChart.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Plot from "react-plotly.js";

const API = "https://auslan-backend.onrender.com";

export default function YearBarChart() {
  const [data, setData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const chartRef = useRef();
  const animationRef = useRef(null); // Store current animation values

  // Detect when chart scrolls into view
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

  // Fetch population data from backend API
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

  // Initialize animated data when data is loaded
  useEffect(() => {
    if (data.length > 0) {
      const initialData = new Array(data.length).fill(0);
      setAnimatedData(initialData);
      // Store the current animation values in a ref
      animationRef.current = [...initialData];
    }
  }, [data]);

  // Fixed animation logic using refs to avoid state batching issues
  useEffect(() => {
    if (!shouldAnimate || !data.length || !animationRef.current) return;

    let currentBarIndex = 0;
    let animationId;

    const animateNextBar = () => {
      if (currentBarIndex >= data.length) return;

      const target = data[currentBarIndex].population;
      const startTime = performance.now();
      const duration = 1200; // Animation duration in milliseconds

      const animateBar = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easeOutCubic);

        // Update the ref directly to avoid React state batching
        animationRef.current[currentBarIndex] = currentValue;
        
        // Update React state with a copy of the ref
        setAnimatedData([...animationRef.current]);

        if (progress < 1) {
          animationId = requestAnimationFrame(animateBar);
        } else {
          // Ensure final value is exact
          animationRef.current[currentBarIndex] = target;
          setAnimatedData([...animationRef.current]);
          
          // Move to next bar after a short delay
          currentBarIndex++;
          setTimeout(animateNextBar, 300);
        }
      };

      animationId = requestAnimationFrame(animateBar);
    };

    // Start the animation sequence
    animateNextBar();

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [shouldAnimate, data]);

  // Extract years and max value for fixed Y-axis
  const { years, maxPopulation } = useMemo(() => {
    const y = data.map((d) => d.year);
    const max = Math.max(...data.map((d) => d.population || 0));
    return { years: y, maxPopulation: Math.ceil(max * 1.1) };
  }, [data]);

  // Chart layout options
  const layout = {
    title: {
      text: "Auslan Population by Year",
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
      showgrid: true,
      gridcolor: "rgba(0,0,0,0.1)",
    },
    yaxis: {
      title: "Population",
      range: [0, maxPopulation],
      tickfont: { size: 14 },
      titlefont: { size: 16 },
      showgrid: true,
      gridcolor: "rgba(0,0,0,0.1)",
    },
    bargap: 0.4,
    plot_bgcolor: "rgba(255,255,255,0.9)",
    paper_bgcolor: "rgba(248, 250, 252, 0.8)",
    margin: { l: 80, r: 40, t: 80, b: 60 },
    showlegend: false,
  };

  // Dynamic bar colors based on animation progress
  const getBarColor = (value, index) => {
    if (!data[index]) return "#E0E7FF";
    
    const progress = data[index].population > 0 ? value / data[index].population : 0;
    const hue = 180 + (progress * 40); // Color shifts from cyan to teal
    const saturation = 60 + (progress * 20);
    const lightness = 70 - (progress * 20);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Bar chart data
  const chartData = [
    {
      type: "bar",
      x: years,
      y: animatedData,
      marker: {
        color: animatedData.map((value, index) => getBarColor(value, index)),
        line: {
          width: 1.5,
          color: "#1E40AF",
        },
      },
      hovertemplate: "<b>Year %{x}</b><br>Population: %{y:,}<extra></extra>",
      text: animatedData.map((value, index) => {
        // Only show text if animation is complete or near complete
        const isComplete = data[index] ? value >= data[index].population * 0.95 : false;
        return isComplete && value > 0 ? value.toLocaleString() : '';
      }),
      textposition: 'outside',
      textfont: {
        size: 11,
        color: '#1F2937',
        family: 'Arial, sans-serif'
      }
    },
  ];

  // Plotly config options
  const config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
    scrollZoom: false,
    doubleClick: 'reset',
  };

  return (
    <div 
      ref={chartRef} 
      className="relative w-full" 
      style={{ 
        maxWidth: 900, 
        margin: "20px auto",
        padding: "10px"
      }}
    >
      {!data.length ? (
        <div style={{ 
          height: 500, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '16px',
          color: '#6B7280',
          backgroundColor: 'rgba(248, 250, 252, 0.8)',
          borderRadius: '8px',
          border: '1px solid rgba(209, 213, 219, 0.3)'
        }}>
          Loading population data...
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '10px'
        }}>
          <Plot
            data={chartData}
            layout={layout}
            config={config}
            useResizeHandler
            style={{ width: "100%", height: 520 }}
          />
        </div>
      )}
    </div>
  );
}