/**
 * ModalDetalles - Modal que muestra la información completa del candidato seleccionado:
 * datos personales (nombre y CI) y todas sus plazas aprobadas con sus evaluaciones.
 * Cada evaluación incluye: titulación, oficios, idiomas, nivel, licencia, cursos,
 * averiguación comunitaria, averiguación intrabajo y observaciones del reclutador.
 * Los resultados de averiguación se colorean según su estado (verde=aprobado, rojo=rechazado, amarillo=pendiente).
 */

import { ReservaData } from "./hooks/useReserva";

interface ModalDetallesProps {
  candidato: ReservaData | null;
  onClose: () => void;
  formatFecha: (fecha: string | null) => string;
}

export function ModalDetalles({ candidato, onClose, formatFecha }: ModalDetallesProps) {
  if (!candidato) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detalles del Candidato</h2>
              <p className="text-gray-600">{candidato.candidato.nombre} - {candidato.candidato.ci}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#002A8F] border-b pb-2">Plazas Aprobadas y Evaluaciones</h3>

            {candidato.plazasAprobadas.map((plaza, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg text-gray-800">{plaza.plazaNombre}</h4>
                  <span className="text-sm text-gray-500">Evaluado: {formatFecha(plaza.fechaEvaluacion)}</span>
                </div>

                {plaza.evaluacion ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Certificación escolar aportada:</span> <span className="font-medium">{plaza.evaluacion.titulacion || "-"}</span></div>
                    <div><span className="text-gray-500">Idiomas que domina:</span> <span className="font-medium">{plaza.evaluacion.idiomas || "-"}</span></div>
                    <div><span className="text-gray-500">Nivel que tiene:</span> <span className="font-medium">{plaza.evaluacion.nivel || "-"}</span></div>
                    <div><span className="text-gray-500">Licencia de conducción:</span> <span className="font-medium">{plaza.evaluacion.licencia || "-"}</span></div>

                    {plaza.evaluacion.oficios && (
                      <div className="md:col-span-2"><span className="text-gray-500">Muestra de oficios en los que ha trabajado:</span> <span className="font-medium">{plaza.evaluacion.oficios}</span></div>
                    )}
                    {plaza.evaluacion.cursos && (
                      <div className="md:col-span-2"><span className="text-gray-500">Cursos que ha realizado:</span> <span className="font-medium">{plaza.evaluacion.cursos}</span></div>
                    )}
                    {plaza.evaluacion.desempeno && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Observaciones del reclutador:</span>
                        <p className="font-medium mt-1">{plaza.evaluacion.desempeno}</p>
                      </div>
                    )}

                    <div><span className="text-gray-500">Resultado de la averiguación en la comunidad:</span> <span className={`font-medium ${plaza.evaluacion.comunitaria === 'aprobado' ? 'text-green-600' : plaza.evaluacion.comunitaria === 'rechazado' ? 'text-red-600' : 'text-yellow-600'}`}>{plaza.evaluacion.comunitaria || "-"}</span></div>
                    <div><span className="text-gray-500">Resultado de la averiguación en centros de trabajo anteriores:</span> <span className={`font-medium ${plaza.evaluacion.intrabajo === 'aprobado' ? 'text-green-600' : plaza.evaluacion.intrabajo === 'rechazado' ? 'text-red-600' : 'text-yellow-600'}`}>{plaza.evaluacion.intrabajo || "-"}</span></div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Esta plaza aún no ha sido evaluada</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
