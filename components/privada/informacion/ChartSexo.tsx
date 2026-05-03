/**
 * ChartSexo - Gráfico de dona (doughnut) que muestra la distribución de
 * candidatos por sexo: masculino, femenino y no especificado. Cada segmento
 * tiene un color diferenciador y muestra el porcentaje al pasar el cursor.
 */

import { Doughnut } from "react-chartjs-2";
import { COLORS } from "./ChartConfig";

interface ChartSexoProps {
  data: { sexo: string; total: number }[];
}

export function ChartSexo({ data }: ChartSexoProps) {
  const chartData = {
    labels: data.map((d) => d.sexo.charAt(0).toUpperCase() + d.sexo.slice(1)),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: [COLORS.primary, COLORS.pink, COLORS.gray],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-80">
      <div className="h-full flex flex-col">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Distribución por Sexo</h3>
        <div className="flex-1 relative">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom" as const,
                  labels: {
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: { size: 12 },
                    color: "#374151",
                  },
                },
                tooltip: {
                  backgroundColor: "#1F2937",
                  titleFont: { size: 13 },
                  bodyFont: { size: 12 },
                  padding: 12,
                  cornerRadius: 8,
                  callbacks: {
                    label: function(context: any) {
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((context.raw / total) * 100).toFixed(1);
                      return `${context.label}: ${context.raw} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
