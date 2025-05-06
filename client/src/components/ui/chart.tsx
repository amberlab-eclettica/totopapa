import React from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define the chart types
type ChartType = "line" | "bar" | "pie" | "doughnut";

// Chart props
interface ChartProps {
  type: ChartType;
  data: ChartData<any, any, any>;
  options?: ChartOptions<any>;
  className?: string;
  height?: number | string;
}

export function Chart({
  type,
  data,
  options,
  className = "",
  height = 300,
}: ChartProps) {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: '"Lora", serif',
          }
        }
      },
    },
    scales: type === "line" || type === "bar" 
      ? {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                family: '"Lora", serif',
              }
            }
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: '"Lora", serif',
              }
            }
          },
        }
      : undefined,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  const chartStyle = {
    height: height,
  };
  
  const renderedChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={mergedOptions} />;
      case "bar":
        return <Bar data={data} options={mergedOptions} />;
      case "pie":
        return <Pie data={data} options={mergedOptions} />;
      case "doughnut":
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <Bar data={data} options={mergedOptions} />;
    }
  };

  return (
    <div className={`w-full ${className}`} style={chartStyle}>
      {renderedChart()}
    </div>
  );
}
