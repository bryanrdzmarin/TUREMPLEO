/**
 * CandidatosTable - Tabla que muestra la lista filtrada de candidatos. Renderiza columnas
 * de CI, Nombre, Teléfono, Plaza y Fecha Cita (solo en tab "citados"). Cada fila es
 * seleccionable al hacer clic y muestra botones de acción según el estado: "Citar" para
 * pendientes, "Editar Cita" para citados, y badges de "Aprobado"/"Rechazado" para los demás.
 */

import { Candidato } from "./hooks/useCandidatos";

interface CandidatosTableProps {
  lista: Candidato[];
  tab: "pendientes" | "citados" | "aprobados" | "rechazados";
  candidatoSeleccionado: Candidato | null;
  setCandidatoSeleccionado: (c: Candidato | null) => void;
  abrirModal: (c: Candidato) => void;
  formatFecha: (fecha: string) => string;
}

export function CandidatosTable({
  lista,
  tab,
  candidatoSeleccionado,
  setCandidatoSeleccionado,
  abrirModal,
  formatFecha,
}: CandidatosTableProps) {
  const getEmptyMessage = () => {
    switch (tab) {
      case "pendientes": return "pendientes a citar";
      case "citados": return "citados";
      case "aprobados": return "aprobados";
      case "rechazados": return "rechazados";
    }
  };

  const getTabLabel = () => {
    switch (tab) {
      case "pendientes": return "pendientes a citar";
      case "citados": return "citados";
      case "aprobados": return "aprobados";
      case "rechazados": return "rechazados";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Plaza</th>
              {tab === "citados" && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha Cita</th>
              )}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lista.length === 0 ? (
              <tr>
                <td colSpan={tab === "citados" ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                  No hay candidatos {getEmptyMessage()}
                </td>
              </tr>
            ) : (
              lista.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50 cursor-pointer ${candidatoSeleccionado?.id === c.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setCandidatoSeleccionado(c)}
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.ci}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.candidato.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.telefono || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{c.plazaNombre}</td>
                  {tab === "citados" && (
                    <td className="px-4 py-3 text-sm text-gray-600">{c.cita ? formatFecha(c.cita.fechaCita) : "-"}</td>
                  )}
                  <td className="px-4 py-3 text-center">
                    {tab === "pendientes" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); abrirModal(c); }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Citar
                      </button>
                    )}
                    {tab === "citados" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); abrirModal(c); }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        Editar Cita
                      </button>
                    )}
                    {tab === "aprobados" && (
                      <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                        Aprobado
                      </span>
                    )}
                    {tab === "rechazados" && (
                      <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700">
                        Rechazado
                      </span>
                    )}
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
