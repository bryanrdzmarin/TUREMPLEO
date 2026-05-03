/**
 * CitadosTable - Tabla que muestra la lista de candidatos ya citados desde la reserva.
 * Columnas: CI, Nombre, Plaza(s) con badges azules, y Acciones (Denegar y Aprobar).
 * Denegar devuelve al candidato a la reserva. Aprobar archiva todas sus solicitudes
 * y desbloquea plazas asociadas. Ambos requieren confirmación del usuario.
 */

import { ReservaData } from "./hooks/useReserva";

interface CitadosTableProps {
  reserva: ReservaData[];
  loading: boolean;
  onDenegar: (candidatoId: number) => void;
  onAprobar: (candidatoId: number) => void;
}

export function CitadosTable({ reserva, loading, onDenegar, onAprobar }: CitadosTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plaza(s)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : reserva.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No hay candidatos citados
                </td>
              </tr>
            ) : (
              reserva.map((item) => (
                <tr key={item.candidato.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.candidato.ci}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.candidato.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {item.plazasAprobadas.map((plaza, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {plaza.plazaNombre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDenegar(item.candidato.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        Denegado
                      </button>
                      <button
                        onClick={() => onAprobar(item.candidato.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                      >
                        Aprobado
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
