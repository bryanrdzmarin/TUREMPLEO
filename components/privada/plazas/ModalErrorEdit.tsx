import { Plaza } from "./hooks/usePlazas";

interface ModalErrorEditProps {
  open: boolean;
  message: string;
  onInactivar: () => void;
  onCancel: () => void;
}

export function ModalErrorEdit({ open, message, onInactivar, onCancel }: ModalErrorEditProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">No se puede editar</h3>
        <p className="text-gray-600 mb-2">{message}</p>
        <p className="text-sm text-gray-500 mb-4">Esta plaza tiene solicitudes asociadas. ¿Desea inactivarla para que no se puedan crear más solicitudes?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onInactivar}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Inactivar plaza
          </button>
        </div>
      </div>
    </div>
  );
}
