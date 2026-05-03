/**
 * ChartTendenciaMensual - Gráfico de línea que muestra la tendencia de solicitudes
 * recibidas por mes durante los últimos 12 meses. Permite visualizar picos y
 * valles en la actividad de recepción de solicitudes a lo largo del tiempo.
 */

import { Line } from "react-chartjs-2";
import { getChartOptions, COLORS } from "./ChartConfig";

interface ChartTendenciaMensualProps {
  data: { mes: string; total: number }[];
}

export function ChartTendenciaMensual({ data }: ChartTendenciaMensualProps) {
  const chartData = {
    labels: data.map((d) => d.mes),
    datasets: [
      {
        label: "Solicitudes",
        data: data.map((d) => d.total),
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-80">
      <Line data={chartData} options={getChartOptions("Tendencia Mensual de Solicitudes")} />
    </div>
  );
}
