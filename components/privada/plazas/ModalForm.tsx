/**
 * ModalForm - Modal con formulario para crear una nueva plaza o editar una existente.
 * Los campos son: Nombre (texto), Requisitos (textarea) y Funciones (textarea).
 * Al crear se envía como POST, al editar como PUT. Se cierra con botón Cancelar.
 */

import { Plaza } from "./hooks/usePlazas";

interface ModalFormProps {
  open: boolean;
  editingPlaza: Plaza | null;
  form: { nombre: string; requisitos: string; funciones: string };
  setForm: (form: { nombre: string; requisitos: string; funciones: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ModalForm({ open, editingPlaza, form, setForm, onSubmit, onClose }: ModalFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingPlaza ? "Editar Plaza" : "Nueva Plaza"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => {
                  const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                  setForm({ ...form, nombre: soloLetras });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
              <textarea
                value={form.requisitos}
                onChange={(e) => setForm({ ...form, requisitos: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funciones</label>
              <textarea
                value={form.funciones}
                onChange={(e) => setForm({ ...form, funciones: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent resize-none"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001d6e] transition-colors"
              >
                {editingPlaza ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
