/**
 * ModalInfoForm - Modal para registrar documentos aportados y evaluar al candidato post-entrevista.
 * Incluye tres secciones: (1) Documentos Aportados: titulación, oficios, idiomas, cursos,
 * licencia de conducción y documentos faltantes; (2) Resultados de investigaciones: averiguación
 * comunitaria e intrabajo; (3) Desempeño: observaciones del reclutador. Permite aprobar o
 * rechazar al candidato, guardando toda la información en el endpoint /api/informacion-can
 * (crea o actualiza según existencia) y luego cambia el estado en /api/candidatos.
 */

import { Candidato, InfoFormData } from "./hooks/useCandidatos";

interface ModalInfoFormProps {
  open: boolean;
  candidato: Candidato;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  formData: InfoFormData;
  setFormData: (data: InfoFormData) => void;
  error: string | null;
  saving: boolean;
}

const licencias = ["Ninguna", "A", "A1", "B", "C1", "C", "D1", "D", "E", "F", "FE"];
const titulaciones = ["Secundaria", "Técnico Medio", "Preuniversitario", "Universitario"];
const niveles = ["basico", "medio", "avanzado", "nativo"];
const resultados = ["aprobado", "rechazado", "pendiente"];

export function ModalInfoForm({
  open,
  candidato,
  onClose,
  onApprove,
  onReject,
  formData,
  setFormData,
  error,
  saving,
}: ModalInfoFormProps) {
  if (!open) return null;

  const update = (field: keyof InfoFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar los documentos aportados</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-[#002A8F] mb-3">Documentos Aportados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificación escolar aportada</label>
                  <select
                    value={formData.titulacion}
                    onChange={(e) => update("titulacion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  >
                    <option value="">Seleccione</option>
                    {titulaciones.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Muestra de oficios en los que ha trabajado</label>
                  <textarea
                    value={formData.oficios}
                    onChange={(e) => update("oficios", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                    placeholder="Ej: Cocinero, Camarero, Mantenimiento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas que domina</label>
                  <textarea
                    value={formData.idiomas}
                    onChange={(e) => update("idiomas", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                    placeholder="Ej: Español, Inglés básico"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel que tiene</label>
                  <select
                    value={formData.nivel}
                    onChange={(e) => update("nivel", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  >
                    <option value="">Seleccione nivel</option>
                    {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar donde lo adquirió</label>
                  <input
                    type="text"
                    value={formData.lugar}
                    onChange={(e) => update("lugar", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                    placeholder="Ej: Universidad de La Habana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cursos que ha realizado</label>
                  <textarea
                    value={formData.cursos}
                    onChange={(e) => update("cursos", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                    placeholder="Ej: Curso de Inglés, Curso de Cocina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documentos que le faltaron aportar</label>
                  <textarea
                    value={formData.faltantes}
                    onChange={(e) => update("faltantes", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                    placeholder="Ej: Certificate de trabajo, Curriculum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Licencia de conducción</label>
                  <select
                    value={formData.licencia}
                    onChange={(e) => update("licencia", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  >
                    <option value="">Seleccione</option>
                    {licencias.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-[#002A8F] mb-3">Resultados de las investigaciones realizadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resultado de la averiguación en la comunidad</label>
                  <select
                    value={formData.comunitaria}
                    onChange={(e) => update("comunitaria", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  >
                    <option value="">Seleccione</option>
                    {resultados.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resultado de la averiguación en centros de trabajo anteriores</label>
                  <select
                    value={formData.intrabajo}
                    onChange={(e) => update("intrabajo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  >
                    <option value="">Seleccione</option>
                    {resultados.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#002A8F] mb-3">Desempeño en la entrevista</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones del reclutador</label>
                <textarea
                  value={formData.desempeno}
                  onChange={(e) => update("desempeno", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  placeholder="Escriba sus observaciones sobre el desempeño del candidato en la entrevista..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onReject}
              disabled={saving || formData.comunitaria === ""}
              className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 font-medium"
            >
              {saving ? "Guardando..." : "Rechazar"}
            </button>
            <button
              onClick={onApprove}
              disabled={saving || formData.comunitaria === ""}
              className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 font-medium"
            >
              {saving ? "Guardando..." : "Aprobar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
