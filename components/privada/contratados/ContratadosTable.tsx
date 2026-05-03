/**
 * ContratadosTable - Tabla que muestra la lista de candidatos contratados. Renderiza columnas
 * de CI, Nombre, Plaza(s) y Fecha Contratación. Muestra las plazas como badges verdes.
 * Incluye estados de loading ("Cargando...") y empty state ("No hay candidatos contratados").
 */

import { ContratadoData } from "./hooks/useContratados";

interface ContratadosTableProps {
  contratados: ContratadoData[];
  loading: boolean;
  formatFecha: (fecha: string | Date | null) => string;
}

export function ContratadosTable({ contratados, loading, formatFecha }: ContratadosTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CI</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plaza(s)</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Contratación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                Cargando...
              </td>
            </tr>
          ) : contratados.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                No hay candidatos contratados
              </td>
            </tr>
          ) : (
            contratados.map((item) => (
              <tr key={item.candidato.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{item.candidato.ci}</td>
                <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.candidato.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {item.plazas.map((plaza, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {plaza.plazaNombre}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{formatFecha(item.fechaContratacion)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
