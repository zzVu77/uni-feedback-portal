import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Context } from "chartjs-plugin-datalabels";
import {
  PostCountByDateItem,
  ClassificationSentimentData,
  SentimentTrendItem,
} from "@/types/social-listening";
export const drawChart = ({
  classificationData,
  postCountData,
  trendData,
}: {
  classificationData: ClassificationSentimentData[] | undefined;
  postCountData: PostCountByDateItem[] | undefined;
  trendData: SentimentTrendItem[] | undefined;
}): {
  sentimentChartImage: string;
  postCountChartImage: string;
  trendChartImage: string;
} => {
  const createCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.opacity = "0";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    return canvas;
  };
  const sentimentCanvas = createCanvas(250, 250);
  const sentimentChart = new Chart(sentimentCanvas, {
    type: "pie",
    plugins: [ChartDataLabels],
    data: {
      labels: ["Tích cực", "Tiêu cực", "Stress lo âu"],
      datasets: [
        {
          data: [
            classificationData?.find((c) => c.sentimentLabel === "Tích cực")
              ?.count || 0,
            classificationData?.find((c) => c.sentimentLabel === "Tiêu cực")
              ?.count || 0,
            classificationData?.find((c) => c.sentimentLabel === "Stress lo âu")
              ?.count || 0,
          ],
          backgroundColor: ["#10b981", "#f43f5e", "#f59e0b"],
          borderWidth: 6,
          borderColor: "#ffffff",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 60, family: "'Inter', sans-serif", weight: "bold" },
            padding: 30,
            usePointStyle: true,
            pointStyle: "circle",
            color: "#334155",
          },
        },
        datalabels: {
          color: "#fff",
          font: { size: 65, weight: "bold", family: "'Inter', sans-serif" },
          formatter: (value: number, context: Context) => {
            if (value === 0) return "";
            const dataset = context.chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a: number, b: number) => a + b, 0);
            const percent = total
              ? ((value / total) * 100).toFixed(1) + "%"
              : "";
            return percent;
          },
        },
      },
    },
  });
  const sentimentChartImage = sentimentCanvas.toDataURL("image/png");
  sentimentChart.destroy();
  document.body.removeChild(sentimentCanvas);

  const postCountCanvas = createCanvas(200, 200);
  const postCountChart = new Chart(postCountCanvas, {
    type: "line",
    data: {
      labels:
        postCountData?.map((item: PostCountByDateItem) => item.displayDate) ||
        [],
      datasets: [
        {
          label: "Số lượng bài viết theo ngày",
          data:
            postCountData?.map(
              (item: PostCountByDateItem) => item.totalPosts,
            ) || [],
          borderColor: "#4f46e5",
          borderWidth: 6,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, "rgba(79, 70, 229, 0.4)");
            gradient.addColorStop(1, "rgba(79, 70, 229, 0.02)");
            return gradient;
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#4f46e5",
          pointBorderWidth: 4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      layout: {
        padding: { bottom: 40 }, // 👈 thêm padding dưới
      },
      plugins: {
        legend: {
          labels: {
            font: { size: 30, family: "'Inter', sans-serif", weight: "bold" },
            color: "#334155",
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 28, family: "'Inter', sans-serif" },
            color: "#64748b",
            padding: 12,
          },
        },
        y: {
          border: { display: false },
          grid: { color: "rgba(0,0,0,0.06)", tickLength: 0 },
          beginAtZero: true,
          ticks: {
            font: { size: 28, family: "'Inter', sans-serif" },
            color: "#64748b",
            padding: 12,
            stepSize: 1,
          },
        },
      },
    },
  });
  const postCountChartImage = postCountCanvas.toDataURL("image/png");
  postCountChart.destroy();
  document.body.removeChild(postCountCanvas);

  const trendCanvas = createCanvas(300, 200);
  const labels = trendData?.map((item) => item.displayDate) || [];
  const trendChart = new Chart(trendCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Tích cực",
          data: trendData?.map((item) => item.positive) || [],
          borderColor: "#10b981", // Emerald 500
          borderWidth: 4,
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#10b981",
          pointRadius: 4,
        },
        {
          label: "Tiêu cực",
          data: trendData?.map((item) => item.negative) || [],
          borderColor: "#f43f5e", // Rose 500
          borderWidth: 4,
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#f43f5e",
          pointRadius: 4,
        },
        {
          label: "Stress",
          data: trendData?.map((item) => item.stressAnxiety) || [],
          borderColor: "#f59e0b", // Amber 500
          borderWidth: 4,
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#f59e0b",
          pointRadius: 4,
        },
      ],
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      layout: {
        padding: { bottom: 40 },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { size: 24, family: "'Inter', sans-serif", weight: "bold" },
            color: "#334155",
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 20, family: "'Inter', sans-serif" },
            color: "#64748b",
            padding: 8,
          },
        },
        y: {
          border: { display: false },
          grid: { color: "rgba(0,0,0,0.06)", tickLength: 0 },
          beginAtZero: true,
          ticks: {
            font: { size: 20, family: "'Inter', sans-serif" },
            color: "#64748b",
            padding: 8,
            stepSize: 1,
          },
        },
      },
    },
  });
  const trendChartImage = trendCanvas.toDataURL("image/png");
  trendChart.destroy();
  document.body.removeChild(trendCanvas);

  return { sentimentChartImage, postCountChartImage, trendChartImage };
};
