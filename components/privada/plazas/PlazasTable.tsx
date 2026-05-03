/**
 * PlazasTable - Tabla que muestra la lista de plazas con columnas de Nombre,
 * Requisitos, Funciones y Estado. El estado es un botón toggle para cambiar
 * entre Activo/Inactivo. Las acciones incluyen botones de editar (icono lápiz)
 * y eliminar (icono basura) por cada fila.
 */

import { Plaza } from "./hooks/usePlazas";

interface PlazasTableProps {
  plazas: Plaza[];
  onEdit: (plaza: Plaza) => void;
  onDeleteConfirm: (id: number) => void;
  onToggleActivo: (plaza: Plaza) => void;
}

export function PlazasTable({ plazas, onEdit, onDeleteConfirm, onToggleActivo }: PlazasTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Requisitos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Funciones</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plazas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay plazas
                </td>
              </tr>
            ) : (
              plazas.map((plaza) => (
                <tr key={plaza.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{plaza.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate">{plaza.requisitos}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{plaza.funciones}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleActivo(plaza)}
                      className={`px-2 py-1 text-xs rounded-full font-medium cursor-pointer ${
                        plaza.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plaza.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(plaza)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteConfirm(plaza.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
