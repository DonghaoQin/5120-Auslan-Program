// components/YearBarChart.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function YearBarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Auslan Population",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderRadius: 8,
      },
    ],
  });

  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Fetch backend data from /year/population-by-year
    fetch("http://localhost:8000/year/population-by-year")
      .then((res) => res.json())
      .then((data) => {
        const labels = data.yearly_population.map((item) => item.year);
        const values = data.yearly_population.map((item) => item.population);

        // Animate bar growth by step
        let step = 0;
        const growBars = () => {
          if (step <= values.length) {
            setChartData((prev) => ({
              ...prev,
              labels: labels.slice(0, step),
              datasets: [
                {
                  ...prev.datasets[0],
                  data: values.slice(0, step),
                },
              ],
            }));
            step++;
            setTimeout(growBars, 400); // Adjust speed (lower = faster)
          }
        };

        growBars();
      })
      .catch((err) => console.error("Failed to fetch year data:", err));
  }, []);

  const options = {
    responsive: true,
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Auslan Population by Year",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2000,
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}