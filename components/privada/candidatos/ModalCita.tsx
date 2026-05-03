/**
 * ModalCita - Modal para programar nuevas citas o editar citas existentes de candidatos.
 * Permite seleccionar fecha (restringida a días futuros), definir requisitos y especificar
 * la dirección de la entrevista. Detecta automáticamente si es una cita nueva (POST)
 * o existente (PUT) según el estado del candidato y envía los datos al endpoint /api/citas.
 */

import { Candidato } from "./hooks/useCandidatos";

interface ModalCitaProps {
  open: boolean;
  candidato: Candidato;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    fechaCita: string;
    requisitos: string;
    direccion: string;
  };
  setFormData: (data: { fechaCita: string; requisitos: string; direccion: string }) => void;
  error: string | null;
  enviando: boolean;
  minDate: string;
}

export function ModalCita({
  open,
  candidato,
  onClose,
  onSubmit,
  formData,
  setFormData,
  error,
  enviando,
  minDate,
}: ModalCitaProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {candidato.citado ? "Editar Cita" : "Programar Cita"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidato</label>
              <input
                type="text"
                value={candidato.candidato.nombre}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plaza</label>
              <input
                type="text"
                value={candidato.plazaNombre}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para el día</label>
              <input
                type="date"
                value={formData.fechaCita}
                onChange={(e) => setFormData({ ...formData, fechaCita: e.target.value })}
                min={minDate}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debe Traer</label>
              <textarea
                value={formData.requisitos}
                onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debe Dirigirse a</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
                placeholder="Dirección de la entrevista"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors disabled:opacity-50"
              >
                {enviando ? "Enviando..." : candidato.citado ? "Actualizar y Reenviar" : "Enviar Cita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
