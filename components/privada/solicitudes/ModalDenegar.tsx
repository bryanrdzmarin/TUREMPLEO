/**
 * ModalDenegar - Modal para rechazar una solicitud pendiente. Muestra el nombre
 * del candidato y la plaza, y requiere un motivo obligatorio (textarea) para
 * la denegación. Envía el PUT a /api/solicitudes con el estado "rechazado"
 * y el motivo incluido. El botón de confirmar está deshabilitado sin motivo.
 */

import { Solicitud } from "./hooks/useSolicitudes";

interface ModalDenegarProps {
  solicitud: Solicitud | null;
  motivo: string;
  setMotivo: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  denegando: boolean;
}

export function ModalDenegar({ solicitud, motivo, setMotivo, onConfirm, onCancel, denegando }: ModalDenegarProps) {
  if (!solicitud) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Denegar Solicitud</h2>
          <p className="text-gray-600 mb-4">
            ¿Está seguro que desea denegar la solicitud de <span className="font-semibold">{solicitud.candidato.nombre}</span> para la plaza <span className="font-semibold">{solicitud.plazaNombre}</span>?
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de denegación <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
              placeholder="Escriba el motivo por el cual se deniega esta solicitud..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={!motivo.trim() || denegando}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {denegando ? "Denegando..." : "Confirmar Denegación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
