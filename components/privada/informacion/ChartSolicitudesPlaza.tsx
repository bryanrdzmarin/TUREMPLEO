/**
 * ChartSolicitudesPlaza - Gráfico de barras horizontales que muestra el top 8
 * de plazas con mayor cantidad de solicitudes. Cada barra representa una plaza
 * y su longitud indica la cantidad de solicitudes recibidas.
 */

import { Bar } from "react-chartjs-2";
import { getChartOptions, COLORS } from "./ChartConfig";

interface ChartSolicitudesPlazaProps {
  data: { nombre: string; total: number }[];
}

export function ChartSolicitudesPlaza({ data }: ChartSolicitudesPlazaProps) {
  const chartData = {
    labels: data.map((d) => d.nombre.length > 25 ? d.nombre.substring(0, 25) + "..." : d.nombre),
    datasets: [
      {
        label: "Solicitudes",
        data: data.map((d) => d.total),
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = getChartOptions("Top Plazas por Solicitudes");
  (options as any).indexAxis = "y";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-80">
      <Bar data={chartData} options={options as any} />
    </div>
  );
}
