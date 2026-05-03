/**
 * SolicitudesTable - Tabla que muestra la lista de solicitudes con columnas de
 * Candidato, CI, Plaza, Estado (badge con color según estado) y Acciones.
 * Las acciones incluyen: ver detalles (ojo), aprobar (check verde) y rechazar
 * (cruz roja) — estas últimas solo para solicitudes pendientes.
 * Incluye diseño responsive que oculta columnas en pantallas pequeñas.
 */

import { Solicitud } from "./hooks/useSolicitudes";

interface SolicitudesTableProps {
  solicitudes: Solicitud[];
  onVerDetalle: (s: Solicitud) => void;
  onAprobar: (id: number) => void;
  onRechazar: (s: Solicitud) => void;
  getEstadoColor: (estado: string) => string;
  formatFecha: (fecha: string) => string;
}

export function SolicitudesTable({
  solicitudes,
  onVerDetalle,
  onAprobar,
  onRechazar,
  getEstadoColor,
  formatFecha,
}: SolicitudesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Candidato</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">CI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Plaza</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay solicitudes
                </td>
              </tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-800">{s.candidato.nombre}</div>
                    <div className="text-xs text-gray-500 md:hidden">{s.candidato.ci}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{s.candidato.ci}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{s.plazaNombre}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getEstadoColor(s.estado)}`}>
                      {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{formatFecha(s.creadoEn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => onVerDetalle(s)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {s.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => onAprobar(s.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Aprobar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onRechazar(s)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Rechazar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
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
