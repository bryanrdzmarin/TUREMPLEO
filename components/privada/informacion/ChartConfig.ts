/**
 * ChartConfig - Configuración global compartida para todos los gráficos de Chart.js.
 * Define la paleta de colores de la marca, estilos de fuente, bordes y opciones
 * de responsive para mantener consistencia visual en todo el dashboard.
 */

export const COLORS = {
  primary: "#002A8F",
  primaryLight: "#003CB5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  pink: "#EC4899",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
};

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        color: "#374151",
      },
    },
    tooltip: {
      backgroundColor: "#1F2937",
      titleFont: { size: 13, family: "'Inter', sans-serif" },
      bodyFont: { size: 12, family: "'Inter', sans-serif" },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 11, family: "'Inter', sans-serif" },
        color: "#6B7280",
      },
    },
    y: {
      grid: {
        color: "#F3F4F6",
      },
      ticks: {
        font: { size: 11, family: "'Inter', sans-serif" },
        color: "#6B7280",
      },
      beginAtZero: true,
    },
  },
};

export function getChartOptions(title: string, showYAxis = true) {
  return {
    ...CHART_OPTIONS,
    plugins: {
      ...CHART_OPTIONS.plugins,
      title: {
        display: true,
        text: title,
        font: { size: 14, weight: "bold" as const, family: "'Inter', sans-serif" },
        color: "#1F2937",
        padding: { bottom: 16 },
      },
    },
    scales: {
      ...CHART_OPTIONS.scales,
      ...(showYAxis ? { y: CHART_OPTIONS.scales.y } : {}),
    },
  };
}

export const PALETTE = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.gray,
];
