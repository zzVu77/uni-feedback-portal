import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Context } from "chartjs-plugin-datalabels";
import {
  PostCountByDateItem,
  ClassificationSentimentData,
} from "@/types/social-listening";
export const drawChart = ({
  classificationData,
  postCountData,
}: {
  classificationData: ClassificationSentimentData[] | undefined;
  postCountData: PostCountByDateItem[] | undefined;
}): {
  sentimentChartImage: string;
  postCountChartImage: string;
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
      labels: ["Tích cực", "Tiêu cực"],
      datasets: [
        {
          data: [
            classificationData?.[0]?.count || 0,
            classificationData?.[1]?.count || 0,
          ],
          backgroundColor: ["#22c55e", "#ef4444"],
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 80 },
            padding: 16,
          },
        },
        datalabels: {
          color: "#fff",
          font: { size: 70 },
          formatter: (value: number, context: Context) => {
            const dataset = context.chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a: number, b: number) => a + b, 0);
            const percent = total
              ? ((value / total) * 100).toFixed(1) + "%"
              : "0%";
            return `${percent}`;
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
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.1)",
          tension: 0.3,
          fill: true,
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
            font: { size: 30 },
          },
        },
      },
      scales: {
        x: { ticks: { font: { size: 30 }, padding: 8 } },
        y: { ticks: { font: { size: 30 } } },
      },
    },
  });
  const postCountChartImage = postCountCanvas.toDataURL("image/png");
  postCountChart.destroy();
  document.body.removeChild(postCountCanvas);
  return { sentimentChartImage, postCountChartImage };
};
