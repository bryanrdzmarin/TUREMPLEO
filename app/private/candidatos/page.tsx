"use client";

import { useState, useEffect } from "react";

interface CandidatoAprobado {
  id: number;
  candidato: {
    ci: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
  };
  plazaNombre: string;
}

export default function CandidatosPage() {
  const [candidatos, setCandidatos] = useState<CandidatoAprobado[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    try {
      const res = await fetch("/api/candidatos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCandidatos(data);
      } else {
        console.error("Error: la API devolvio un objeto en lugar de array", data);
        setCandidatos([]);
      }
    } catch (error) {
      console.error("Error fetching candidatos:", error);
      setCandidatos([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidatos = candidatos.filter((c) => {
    const searchLower = busqueda.toLowerCase();
    return (
      busqueda === "" ||
      c.candidato.nombre.toLowerCase().includes(searchLower) ||
      c.candidato.ci.toLowerCase().includes(searchLower) ||
      c.candidato.email?.toLowerCase().includes(searchLower) ||
      c.plazaNombre.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Candidatos Aprobados</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredCandidatos.length} de {candidatos.length}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, CI, email o plaza..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent text-sm w-full md:w-80"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CI</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Plaza Solicitada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCandidatos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No hay candidatos aprobados
                  </td>
                </tr>
              ) : (
                filteredCandidatos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.ci}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.candidato.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.telefono || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{c.plazaNombre}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
