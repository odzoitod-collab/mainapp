"use client";

import { useMemo } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { caDate, fmtRub, fmtTick } from "@/lib/format";
import type { ProfitRow } from "@/types/models";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

export function AnalyticsCharts({
  profits,
  mode = "both",
}: {
  profits: ProfitRow[];
  mode?: "line" | "pie" | "both";
}) {
  const lineData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[caDate(d)] = 0;
    }
    profits.forEach((p) => {
      const k = caDate(p.created_at || "");
      if (k in days) days[k] += Number(p.amount);
    });
    const labels = Object.keys(days).map((d) => d.slice(5));
    const values = Object.values(days);
    return { labels, values };
  }, [profits]);

  const pieData = useMemo(() => {
    const mp: Record<string, number> = {};
    profits.forEach((p) => {
      const n = p.service_name || "—";
      mp[n] = (mp[n] || 0) + Number(p.amount);
    });
    let sr = Object.entries(mp).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!sr.length) sr = [["—", 1]];
    return {
      labels: sr.map((x) => x[0]),
      values: sr.map((x) => x[1]),
    };
  }, [profits]);

  const lineOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 750 },
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(9,14,28,0.96)",
          borderColor: "rgba(77,141,245,0.2)",
          borderWidth: 1,
          titleFont: { family: "Inter", size: 11 },
          bodyFont: { family: "Inter", size: 13 },
          callbacks: {
            label: (c) => " " + fmtRub(c.parsed.y),
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.03)" },
          ticks: {
            color: "rgba(120,143,168,0.6)",
            font: { size: 10 },
            maxRotation: 0,
          },
        },
        y: {
          display: true,
          position: "right",
          min: 0,
          suggestedMax: Math.max(...lineData.values, 1) * 1.1,
          grid: { color: "rgba(255,255,255,0.025)" },
          ticks: {
            color: "rgba(120,143,168,0.5)",
            font: { size: 9 },
            maxTicksLimit: 4,
            callback: (v) => fmtTick(Number(v)),
          },
        },
      },
    }),
    [lineData.values],
  );

  const doughnutOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "58%",
      animation: { animateRotate: true, duration: 850 },
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "rgba(197,208,232,0.8)",
            font: { size: 10, family: "Inter" },
            boxWidth: 9,
            padding: 8,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(9,14,28,0.96)",
          borderColor: "rgba(77,141,245,0.15)",
          borderWidth: 1,
          callbacks: {
            label: (c) => {
              const sum = (c.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const raw = Number(c.raw);
              return ` ${c.label}: ${fmtRub(raw)} (${sum ? ((raw / sum) * 100).toFixed(1) : 0}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  const showLine = mode === "line" || mode === "both";
  const showPie = mode === "pie" || mode === "both";

  return (
    <>
      {showLine ? (
      <div className="chart-wrap">
        <Line
          data={{
            labels: lineData.labels,
            datasets: [
              {
                data: lineData.values,
                borderColor: "#4d8df5",
                backgroundColor: (context) => {
                  const c = context.chart;
                  const { ctx, chartArea } = c;
                  if (!chartArea) return "transparent";
                  const g = ctx.createLinearGradient(
                    0,
                    chartArea.top,
                    0,
                    chartArea.bottom,
                  );
                  g.addColorStop(0, "rgba(77,141,245,0.28)");
                  g.addColorStop(0.65, "rgba(77,141,245,0.05)");
                  g.addColorStop(1, "transparent");
                  return g;
                },
                fill: true,
                tension: 0.36,
                borderWidth: 2.4,
                pointBackgroundColor: "#090e1c",
                pointBorderColor: "#60a5fa",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          }}
          options={lineOptions}
        />
      </div>
      ) : null}
      {showPie ? (
      <div className="chart-wrap chart-pie">
        <Doughnut
          data={{
            labels: pieData.labels,
            datasets: [
              {
                data: pieData.values,
                backgroundColor: [
                  "#4d8df5",
                  "#60a5fa",
                  "#93c5fd",
                  "#6366f1",
                  "#8b5cf6",
                ],
                borderColor: "rgba(9,14,28,0.96)",
                borderWidth: 2,
                hoverOffset: 8,
              },
            ],
          }}
          options={doughnutOptions}
        />
      </div>
      ) : null}
    </>
  );
}
