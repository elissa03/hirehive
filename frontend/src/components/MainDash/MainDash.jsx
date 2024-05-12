import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import styles from "./MainDash.module.css";

function MainDash() {
  const [chartData, setChartData] = useState(null);
  const chartContainer = useRef(null);

  // Sample data for chart
  const sampleData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Applications Received",
        data: [12, 19, 3, 5, 2, 3, 11, 15, 20, 12, 8, 5],
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Red color with transparency
        borderColor: "rgba(255, 99, 132, 1)", // Red color
        borderWidth: 1,
        tension: 0.4, // Adjust the curve of the line
      },
      {
        label: "Interviews Scheduled",
        data: [5, 3, 7, 2, 8, 6, 9, 10, 12, 8, 6, 4],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue color with transparency
        borderColor: "rgba(54, 162, 235, 1)", // Blue color
        borderWidth: 1,
        tension: 0.4, // Adjust the curve of the line
      },
    ],
  };

  useEffect(() => {
    if (!chartData) {
      // Initialize the chart
      const ctx = chartContainer.current.getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: sampleData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      setChartData(myChart);
    }
  }, [chartData, sampleData]);

  return (
    <div>
      <h3 className={styles.heading}>Dashboard</h3>
      <div className={styles.section}>
        <h5>Applications Overview</h5>
        <canvas ref={chartContainer}></canvas>
      </div>
      <div className={styles.section}>
        <h3>Other Statistics</h3>
        <div className={styles.statistics}>
          <div className={styles.statistic}>
            <h4>Job Offers</h4>
            <p>15</p>
            <span className={styles.info}>(+10% compared to last month)</span>
          </div>
          <div className={styles.statistic}>
            <h4>Rejections</h4>
            <p>7</p>
            <span className={styles.info}>(-5% compared to last month)</span>
          </div>
          <div className={styles.statistic}>
            <h4>Interviews Conducted</h4>
            <p>25</p>
            <span className={styles.info}>(Avg. 3 per day)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainDash;
