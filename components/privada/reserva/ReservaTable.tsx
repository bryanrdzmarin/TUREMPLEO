/**
 * ReservaTable - Tabla que muestra la lista de candidatos en la reserva laboral.
 * Columnas: CI, Nombre, Plaza(s) con badges azules, y Acciones (ver detalles y citar).
 * Incluye estados de loading y empty state. Se muestra solo en vista "reserva".
 */

import { ReservaData } from "./hooks/useReserva";

interface ReservaTableProps {
  reserva: ReservaData[];
  loading: boolean;
  onVerDetalles: (item: ReservaData) => void;
  onCitar: (item: ReservaData) => void;
}

export function ReservaTable({ reserva, loading, onVerDetalles, onCitar }: ReservaTableProps) {
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
                  No hay candidatos en la reserva
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
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onVerDetalles(item)}
                        className="p-2 text-[#002A8F] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onCitar(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Citar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
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
