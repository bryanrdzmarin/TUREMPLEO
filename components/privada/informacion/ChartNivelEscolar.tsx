/**
 * ChartNivelEscolar - Gráfico de barras verticales que muestra la cantidad de
 * candidatos agrupados por su nivel escolar: Secundaria, Técnico Medio,
 * Preuniversitario, Universitario, etc. Útil para visualizar el perfil
 * educativo de los candidatos registrados.
 */

import { Bar } from "react-chartjs-2";
import { getChartOptions, COLORS } from "./ChartConfig";

interface ChartNivelEscolarProps {
  data: { nivel: string; total: number }[];
}

export function ChartNivelEscolar({ data }: ChartNivelEscolarProps) {
  const chartData = {
    labels: data.map((d) => d.nivel),
    datasets: [
      {
        label: "Candidatos",
        data: data.map((d) => d.total),
        backgroundColor: COLORS.success,
        borderRadius: 6,
        barThickness: 35,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-80">
      <Bar data={chartData} options={getChartOptions("Candidatos por Nivel Escolar")} />
    </div>
  );
}
