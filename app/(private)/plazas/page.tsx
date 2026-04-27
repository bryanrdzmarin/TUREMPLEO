"use client";

import { useState, useEffect } from "react";

interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
  funciones: string;
  activo: boolean;
}

export default function PlazasPage() {
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<Plaza | null>(null);
  const [form, setForm] = useState({ nombre: "", requisitos: "", funciones: "" });
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [errorDelete, setErrorDelete] = useState<{message: string, plaza: Plaza} | null>(null);

  useEffect(() => {
    fetchPlazas();
  }, []);

  const fetchPlazas = async () => {
    try {
      const res = await fetch("/api/plazas");
      const data = await res.json();
      setPlazas(data);
    } catch (error) {
      console.error("Error fetching plazas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPlaza ? "/api/plazas" : "/api/plazas";
      const method = editingPlaza ? "PUT" : "POST";
      
      const body = editingPlaza 
        ? { ...form, activo: true, id: editingPlaza.id }
        : form;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      setModalOpen(false);
      setEditingPlaza(null);
      setForm({ nombre: "", requisitos: "", funciones: "" });
      fetchPlazas();
    } catch (error) {
      console.error("Error saving plaza:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/plazas?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) {
        const plaza = plazas.find(p => p.id === id);
        if (data.tieneSolicitudes && plaza) {
          setErrorDelete({ message: data.error, plaza });
          return;
        }
        alert(data.error || data.detalles || "Error al eliminar la plaza");
        return;
      }
      
      setDeleteConfirm(null);
      fetchPlazas();
    } catch (error) {
      console.error("Error deleting plaza:", error);
      alert("Error de conexión al eliminar la plaza");
    }
  };

  const handleEdit = (plaza: Plaza) => {
    setEditingPlaza(plaza);
    setForm({ nombre: plaza.nombre, requisitos: plaza.requisitos, funciones: plaza.funciones });
    setModalOpen(true);
  };

  const toggleActivo = async (plaza: Plaza) => {
    try {
      await fetch("/api/plazas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...plaza, activo: !plaza.activo })
      });
      fetchPlazas();
    } catch (error) {
      console.error("Error toggling plaza:", error);
    }
  };

  const filteredPlazas = showInactive ? plazas : plazas.filter(p => p.activo);

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Plazas</h1>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded text-[#002A8F]"
            />
            Ver inactivas
          </label>
          <button
            onClick={() => {
              setEditingPlaza(null);
              setForm({ nombre: "", requisitos: "", funciones: "" });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001d6e] transition-colors"
          >
            + Nueva Plaza
          </button>
        </div>
      </div>

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
              {filteredPlazas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hay plazas {showInactive ? "" : "activas"}
                  </td>
                </tr>
              ) : (
                filteredPlazas.map((plaza) => (
                  <tr key={plaza.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{plaza.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate">{plaza.requisitos}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{plaza.funciones}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActivo(plaza)}
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
                          onClick={() => handleEdit(plaza)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(plaza.id)}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingPlaza ? "Editar Plaza" : "Nueva Plaza"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                    onClick={() => {
                      setModalOpen(false);
                      setEditingPlaza(null);
                      setForm({ nombre: "", requisitos: "", funciones: "" });
                    }}
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
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Estás seguro de que deseas eliminar esta plaza?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {errorDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No se puede eliminar</h3>
            <p className="text-gray-600 mb-2">{errorDelete.message}</p>
            <p className="text-sm text-gray-500 mb-4">Esta plaza tiene solicitudes asociadas. ¿Desea inactivarla para que no se puedan crear más solicitudes?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setErrorDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await fetch("/api/plazas", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...errorDelete.plaza, activo: false })
                  });
                  setErrorDelete(null);
                  setDeleteConfirm(null);
                  fetchPlazas();
                }}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Inactivar plaza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}