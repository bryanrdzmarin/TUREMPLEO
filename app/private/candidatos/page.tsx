"use client";

import { useState, useEffect } from "react";

interface Cita {
  id: number;
  fechaCita: string;
  requisitos: string;
  direccion: string;
}

interface Candidato {
  id: number;
  estado: string;
  citado: boolean;
  entrevistaPasada: boolean | null;
  candidato: {
    ci: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
  };
  plazaNombre: string;
  plaza: {
    requisitos: string;
  };
  cita: Cita | null;
}

export default function CandidatosPage() {
  const [pendientes, setPendientes] = useState<Candidato[]>([]);
  const [citados, setCitados] = useState<Candidato[]>([]);
  const [aprobados, setAprobados] = useState<Candidato[]>([]);
  const [rechazados, setRechazados] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pendientes" | "citados" | "aprobados" | "rechazados">("pendientes");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fechaCita: "",
    requisitos: "",
    direccion: ""
  });

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    try {
      const [pendRes, citRes, aprobRes, rechRes] = await Promise.all([
        fetch("/api/candidatos?citado=false"),
        fetch("/api/candidatos?citado=true"),
        fetch("/api/candidatos?entrevistaPasada=true"),
        fetch("/api/candidatos?entrevistaPasada=false")
      ]);

      const pendData = await pendRes.json();
      const citData = await citRes.json();
      const aprobData = await aprobRes.json();
      const rechData = await rechRes.json();

      setPendientes(Array.isArray(pendData) ? pendData : []);
      setCitados(Array.isArray(citData) ? citData : []);
      setAprobados(Array.isArray(aprobData) ? aprobData : []);
      setRechazados(Array.isArray(rechData) ? rechData : []);
    } catch (error) {
      console.error("Error fetching candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredList = () => {
    switch (tab) {
      case "pendientes": return filteredPendientes;
      case "citados": return filteredCitados;
      case "aprobados": return filteredAprobados;
      case "rechazados": return filteredRechazados;
    }
  };

  const getTotal = () => {
    switch (tab) {
      case "pendientes": return filteredPendientes.length;
      case "citados": return filteredCitados.length;
      case "aprobados": return filteredAprobados.length;
      case "rechazados": return filteredRechazados.length;
    }
  };

  const getTotalAll = () => {
    switch (tab) {
      case "pendientes": return pendientes.length;
      case "citados": return citados.length;
      case "aprobados": return aprobados.length;
      case "rechazados": return rechazados.length;
    }
  };

  const filteredPendientes = pendientes.filter((c) =>
    busqueda === "" ||
    c.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.plazaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const filteredCitados = citados.filter((c) =>
    busqueda === "" ||
    c.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.plazaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const filteredAprobados = aprobados.filter((c) =>
    busqueda === "" ||
    c.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.plazaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const filteredRechazados = rechazados.filter((c) =>
    busqueda === "" ||
    c.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.plazaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = (candidato: Candidato) => {
    setCandidatoSeleccionado(candidato);
    setError(null);
    
    if (candidato.cita) {
      setFormData({
        fechaCita: candidato.cita.fechaCita,
        requisitos: candidato.cita.requisitos,
        direccion: candidato.cita.direccion
      });
    } else {
      setFormData({
        fechaCita: "",
        requisitos: candidato.plaza.requisitos,
        direccion: ""
      });
    }
    
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setCandidatoSeleccionado(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatoSeleccionado) return;

    setEnviando(true);
    setError(null);

    try {
      const url = candidatoSeleccionado.citado ? "/api/citas" : "/api/citas";
      const method = candidatoSeleccionado.citado ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: candidatoSeleccionado.id,
          fechaCita: formData.fechaCita,
          requisitos: formData.requisitos,
          direccion: formData.direccion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar la cita");
        return;
      }

      cerrarModal();
      fetchCandidatos();
    } catch (err) {
      setError("Error al enviar la cita");
    } finally {
      setEnviando(false);
    }
  };

  const handleAprobarEntrevista = async (candidato: Candidato) => {
    setEnviando(true);
    setError(null);

    try {
      const res = await fetch("/api/candidatos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: candidato.id,
          entrevistaPasada: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al aprobar");
        return;
      }

      fetchCandidatos();
      setTab("aprobados");
    } catch (err) {
      setError("Error al aprobar candidato");
    } finally {
      setEnviando(false);
    }
  };

  const handleRechazarEntrevista = async (candidato: Candidato) => {
    setEnviando(true);
    setError(null);

    try {
      const res = await fetch("/api/candidatos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: candidato.id,
          entrevistaPasada: false
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al rechazar");
        return;
      }

      fetchCandidatos();
      setTab("rechazados");
    } catch (err) {
      setError("Error al rechazar candidato");
    } finally {
      setEnviando(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  const listaActual = getFilteredList();
  const totalActual = getTotal();
  const totalTodos = getTotalAll();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Candidatos</h1>
        <div className="text-sm text-gray-500">
          Total: {totalActual} de {totalTodos}
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setTab("pendientes")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "pendientes"
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Pendientes a Citar ({pendientes.length})
        </button>
        <button
          onClick={() => setTab("citados")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "citados"
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Citados ({citados.length})
        </button>
        <button
          onClick={() => setTab("aprobados")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "aprobados"
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Aprobados ({aprobados.length})
        </button>
        <button
          onClick={() => setTab("rechazados")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "rechazados"
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Rechazados ({rechazados.length})
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, CI o plaza..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CI</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Plaza</th>
                {tab === "citados" && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha Cita</th>
                )}
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listaActual.length === 0 ? (
                <tr>
                  <td colSpan={tab === "citados" ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                    No hay candidatos {tab === "pendientes" ? "pendientes a citar" : tab === "citados" ? "citados" : tab === "aprobados" ? "aprobados" : "rechazados"}
                  </td>
                </tr>
              ) : (
                listaActual.map((c) => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${candidatoSeleccionado?.id === c.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setCandidatoSeleccionado(c)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.ci}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.candidato.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.candidato.telefono || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{c.plazaNombre}</td>
                    {tab === "citados" && (
                      <td className="px-4 py-3 text-sm text-gray-600">{c.cita ? formatFecha(c.cita.fechaCita) : "-"}</td>
                    )}
                    <td className="px-4 py-3 text-center">
                      {tab === "pendientes" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); abrirModal(c); }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          Citar
                        </button>
                      )}
                      {tab === "citados" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); abrirModal(c); }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          Editar Cita
                        </button>
                      )}
                      {tab === "aprobados" && (
                        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                          Aprobado
                        </span>
                      )}
                      {tab === "rechazados" && (
                        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700">
                          Rechazado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tab === "citados" && listaActual.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Evaluación de Entrevista</h3>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona un candidato de la tabla para evaluar
          </p>
          
          {candidatoSeleccionado ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <strong>{candidatoSeleccionado.candidato.nombre}</strong> - {candidatoSeleccionado.candidato.ci}
              </span>
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => handleRechazarEntrevista(candidatoSeleccionado)}
                  disabled={enviando}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 font-medium"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => handleAprobarEntrevista(candidatoSeleccionado)}
                  disabled={enviando}
                  className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 font-medium"
                >
                  Aprobar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Clic en un candidato para seleccionarlo</p>
          )}
        </div>
      )}

      {modalOpen && candidatoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={cerrarModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {candidatoSeleccionado.citado ? "Editar Cita" : "Programar Cita"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Candidato</label>
                  <input
                    type="text"
                    value={candidatoSeleccionado.candidato.nombre}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plaza</label>
                  <input
                    type="text"
                    value={candidatoSeleccionado.plazaNombre}
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
                    min={getMinDate()}
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
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors disabled:opacity-50"
                  >
                    {enviando ? "Enviando..." : candidatoSeleccionado.citado ? "Actualizar y Reenviar" : "Enviar Cita"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
