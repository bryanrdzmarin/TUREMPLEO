/**
 * ModalCitar - Modal de 2 pasos para citar a un candidato desde la reserva.
 * Paso 1 "seleccionar": muestra las plazas aprobadas del candidato para que elija una.
 * Paso 2 "formulario": formulario con fecha/hora de la cita, dirección donde debe
 * presentarse y documentos/requisitos a traer. Al enviar, hace POST a /api/reserva
 * con los datos del candidato, plaza y cita.
 */

import { ReservaData, PlazaAprobada } from "./hooks/useReserva";

interface ModalCitarProps {
  modalCitar: ReservaData | null;
  stepCitar: "seleccionar" | "formulario";
  plazaSeleccionada: PlazaAprobada | null;
  formCitar: { fechaCita: string; direccion: string; requisitos: string };
  citando: boolean;
  onSelectPlaza: (plaza: PlazaAprobada) => void;
  onFormChange: (form: { fechaCita: string; direccion: string; requisitos: string }) => void;
  onSubmit: () => Promise<boolean | undefined>;
  onClose: () => void;
}

export function ModalCitar({
  modalCitar,
  stepCitar,
  plazaSeleccionada,
  formCitar,
  citando,
  onSelectPlaza,
  onFormChange,
  onSubmit,
  onClose,
}: ModalCitarProps) {
  if (!modalCitar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Citar Candidato</h2>
          <p className="text-gray-600 mb-4">
            <strong>{modalCitar.candidato.nombre}</strong> - {modalCitar.candidato.ci}
          </p>

          {stepCitar === "seleccionar" ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Seleccione la plaza para citar:</p>
              {modalCitar.plazasAprobadas.map((plaza, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPlaza(plaza)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-[#002A8F] hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{plaza.plazaNombre}</span>
                </button>
              ))}
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mt-4"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit();
            }} className="space-y-4">
              <p className="text-sm text-gray-500">Plaza: <span className="font-medium text-gray-800">{plazaSeleccionada?.plazaNombre}</span></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de la Cita</label>
                <input
                  type="datetime-local"
                  value={formCitar.fechaCita}
                  onChange={(e) => onFormChange({ ...formCitar, fechaCita: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formCitar.direccion}
                  onChange={(e) => onFormChange({ ...formCitar, direccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  placeholder="Dirección donde debe presentarse"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Documentos y Requisitos a Traer</label>
                <textarea
                  value={formCitar.requisitos}
                  onChange={(e) => onFormChange({ ...formCitar, requisitos: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent resize-none"
                  placeholder="Lista de documentos que debe traer"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={citando}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {citando ? "Enviando..." : "Enviar Cita"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
