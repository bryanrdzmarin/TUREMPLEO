/**
 * ModalDeleteConfirm - Modal de confirmación simple para eliminar una plaza.
 * Muestra un mensaje de pregunta "¿Estás seguro?" con botones Cancelar y Eliminar.
 * El botón Eliminar ejecuta el DELETE al endpoint /api/plazas.
 */

interface ModalDeleteConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ModalDeleteConfirm({ open, onConfirm, onCancel }: ModalDeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
        <p className="text-gray-600 mb-4">¿Estás seguro de que deseas eliminar esta plaza?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
