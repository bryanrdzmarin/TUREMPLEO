/**
 * ChartSolicitudesEstado - Gráfico de barras verticales que muestra la cantidad
 * de solicitudes agrupadas por su estado: pendiente, aprobado, rechazado y contratado.
 * Cada barra tiene un color distintivo para fácil identificación visual.
 */

import { Bar } from "react-chartjs-2";
import { getChartOptions, PALETTE } from "./ChartConfig";

interface ChartSolicitudesEstadoProps {
  data: { estado: string; total: number }[];
}

export function ChartSolicitudesEstado({ data }: ChartSolicitudesEstadoProps) {
  const estadoLabels = data.map((d) => {
    return d.estado.charAt(0).toUpperCase() + d.estado.slice(1);
  });

  const chartData = {
    labels: estadoLabels,
    datasets: [
      {
        label: "Solicitudes",
        data: data.map((d) => d.total),
        backgroundColor: PALETTE.slice(0, data.length),
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-80">
      <Bar data={chartData} options={getChartOptions("Solicitudes por Estado")} />
    </div>
  );
}
