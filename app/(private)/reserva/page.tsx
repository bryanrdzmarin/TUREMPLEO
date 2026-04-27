"use client";

import { useState, useEffect } from "react";

interface CandidatoData {
  id: number;
  ci: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
}

interface Evaluacion {
  titulacion: string | null;
  oficios: string | null;
  idiomas: string | null;
  nivel: string | null;
  lugar: string | null;
  cursos: string | null;
  faltantes: string | null;
  licencia: string | null;
  comunitaria: string | null;
  intrabajo: string | null;
  desempeno: string | null;
}

interface PlazaAprobada {
  solicitudId: number;
  plazaId: number;
  plazaNombre: string;
  fechaEvaluacion: string | null;
  evaluacion: Evaluacion | null;
}

interface ReservaData {
  candidato: CandidatoData;
  plazasAprobadas: PlazaAprobada[];
}

export default function ReservaPage() {
  const [reserva, setReserva] = useState<ReservaData[]>([]);
  const [plazas, setPlazas] = useState<{id: number, nombre: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    plaza: "",
    titulacion: "",
    idiomas: "",
    nivel: "",
    licencia: "",
    oficios: "",
    cursos: "",
    comunitaria: "",
    intrabajo: ""
  });
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<ReservaData | null>(null);
  const [vistaActiva, setVistaActiva] = useState<"reserva" | "citados">("reserva");

  useEffect(() => {
    const saved = localStorage.getItem("reservaVistaActiva");
    if (saved === "citados" || saved === "reserva") {
      setVistaActiva(saved);
    }
  }, []);

  const handleSetVistaActiva = (vista: "reserva" | "citados") => {
    setVistaActiva(vista);
    localStorage.setItem("reservaVistaActiva", vista);
  };
  const [modalCitar, setModalCitar] = useState<ReservaData | null>(null);
  const [plazaSeleccionada, setPlazaSeleccionada] = useState<PlazaAprobada | null>(null);
  const [formCitar, setFormCitar] = useState({ fechaCita: "", direccion: "", requisitos: "" });
  const [citando, setCitando] = useState(false);
  const [stepCitar, setStepCitar] = useState<"seleccionar" | "formulario">("seleccionar");
  const [solicitudesCitadas, setSolicitudesCitadas] = useState<{solicitudId: number; candidatoId: number; nombre: string}[]>([]);

  const fetchPlazas = async () => {
    try {
      const res = await fetch("/api/reserva");
      const data = await res.json();
      const plazasUnicas = new Map<string, {id: number, nombre: string}>();
      data.forEach((candidato: any) => {
        candidato.plazasAprobadas.forEach((plaza: any) => {
          if (!plazasUnicas.has(plaza.plazaNombre)) {
            plazasUnicas.set(plaza.plazaNombre, {
              id: plaza.plazaId,
              nombre: plaza.plazaNombre
            });
          }
        });
      });
      setPlazas(Array.from(plazasUnicas.values()));
    } catch (error) {
      console.error("Error fetching plazas:", error);
    }
  };

  const fetchReserva = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (vistaActiva === "citados") {
        params.append("vista", "citados");
      }
      if (filtros.plaza) params.append("plaza", filtros.plaza);
      if (filtros.titulacion) params.append("titulacion", filtros.titulacion);
      if (filtros.idiomas) params.append("idiomas", filtros.idiomas);
      if (filtros.nivel) params.append("nivel", filtros.nivel);
      if (filtros.licencia) params.append("licencia", filtros.licencia);
      if (filtros.oficios) params.append("oficios", filtros.oficios);
      if (filtros.cursos) params.append("cursos", filtros.cursos);
      if (filtros.comunitaria) params.append("comunitaria", filtros.comunitaria);
      if (filtros.intrabajo) params.append("intrabajo", filtros.intrabajo);

      const res = await fetch(`/api/reserva?${params.toString()}`);
      const data = await res.json();
      setReserva(data);
    } catch (error) {
      console.error("Error fetching reserva:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlazas();
    fetchReserva();
  }, [vistaActiva]);

  const aplicarFiltros = () => {
    fetchReserva();
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#002A8F]">Reserva Laboral</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleSetVistaActiva("reserva")}
              className={`px-4 py-2 rounded-lg font-medium ${vistaActiva === "reserva" ? "bg-[#002A8F] text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Reserva
            </button>
            <button
              onClick={() => handleSetVistaActiva("citados")}
              className={`px-4 py-2 rounded-lg font-medium ${vistaActiva === "citados" ? "bg-[#002A8F] text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Citados
            </button>
          </div>
        </div>
        
        {vistaActiva === "reserva" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plaza</label>
                <select
                  value={filtros.plaza}
                  onChange={(e) => setFiltros({ ...filtros, plaza: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todas las plazas</option>
                  {plazas.map((plaza) => (
                    <option key={plaza.id} value={plaza.nombre}>{plaza.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulación</label>
                <select
                  value={filtros.titulacion}
                  onChange={(e) => setFiltros({ ...filtros, titulacion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todas</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Técnico Medio">Técnico Medio</option>
                  <option value="Preuniversitario">Preuniversitario</option>
                  <option value="Universitario">Universitario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas (buscar)</label>
                <input
                  type="text"
                  value={filtros.idiomas}
                  onChange={(e) => setFiltros({ ...filtros, idiomas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  placeholder="Buscar en idiomas..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Idiomas</label>
                <select
                  value={filtros.nivel}
                  onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="básico">Básico</option>
                  <option value="medio">Medio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="nativo">Nativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
                <select
                  value={filtros.licencia}
                  onChange={(e) => setFiltros({ ...filtros, licencia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todas</option>
                  <option value="A">A</option>
                  <option value="A1">A1</option>
                  <option value="B">B</option>
                  <option value="C1">C1</option>
                  <option value="C">C</option>
                  <option value="D1">D1</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="FE">FE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oficios (buscar)</label>
                <input
                  type="text"
                  value={filtros.oficios}
                  onChange={(e) => setFiltros({ ...filtros, oficios: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  placeholder="Buscar en oficios..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cursos (buscar)</label>
                <input
                  type="text"
                  value={filtros.cursos}
                  onChange={(e) => setFiltros({ ...filtros, cursos: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                  placeholder="Buscar en cursos..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado averiguación comunidad</label>
                <select
                  value={filtros.comunitaria}
                  onChange={(e) => setFiltros({ ...filtros, comunitaria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado centros trabajo</label>
                <select
                  value={filtros.intrabajo}
                  onChange={(e) => setFiltros({ ...filtros, intrabajo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>

            <button
              onClick={aplicarFiltros}
              className="px-6 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors"
            >
              Aplicar Filtros
            </button>
          </>
        )}
      </div>

      {vistaActiva === "reserva" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CI</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plaza(s)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : reserva.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No hay candidatos en la reserva
                    </td>
                  </tr>
                ) : (
                  reserva.map((item) => (
                    <tr key={item.candidato.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.candidato.ci}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.candidato.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {item.plazasAprobadas.map((plaza, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {plaza.plazaNombre}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setCandidatoSeleccionado(item)}
                            className="p-2 text-[#002A8F] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setModalCitar(item); setStepCitar("seleccionar"); setPlazaSeleccionada(null); }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Citar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
      )}

      {vistaActiva === "citados" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CI</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plaza(s)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : reserva.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No hay candidatos citados
                    </td>
                  </tr>
                ) : (
                  reserva.map((item) => (
                    <tr key={item.candidato.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.candidato.ci}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.candidato.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {item.plazasAprobadas.map((plaza, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {plaza.plazaNombre}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              if (!confirm("¿Está seguro de marcar como denegado?")) return;
                              try {
                                const res = await fetch("/api/reserva", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ candidatoId: item.candidato.id, accion: "denegar" })
                                });
                                if (res.ok) {
                                  alert("Candidato devuelto a la reserva");
                                  fetchReserva();
                                }
                              } catch (error) {
                                console.error("Error denegando:", error);
                              }
                            }}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                          >
                            Denegado
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm("¿Está seguro de marcar como aprobado? Se archivarán todas las solicitudes del candidato.")) return;
                              try {
                                const res = await fetch("/api/reserva", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ candidatoId: item.candidato.id, accion: "aprobar" })
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.plazasDesbloqueadas && data.plazasDesbloqueadas.length > 0) {
                                    alert(`${data.message}. Plazas desbloqueadas: ${data.plazasDesbloqueadas.length}`);
                                  } else {
                                    alert(data.message);
                                  }
                                  fetchReserva();
                                } else {
                                  const data = await res.json();
                                  alert(data.error || "Error al aprobar");
                                }
                              } catch (error) {
                                console.error("Error aprobando:", error);
                              }
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                          >
                            Aprobado
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
      )}

      {candidatoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setCandidatoSeleccionado(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Detalles del Candidato</h2>
                  <p className="text-gray-600">{candidatoSeleccionado.candidato.nombre} - {candidatoSeleccionado.candidato.ci}</p>
                </div>
                <button
                  onClick={() => setCandidatoSeleccionado(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#002A8F] border-b pb-2">Plazas Aprobadas y Evaluaciones</h3>
                
                {candidatoSeleccionado.plazasAprobadas.map((plaza, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg text-gray-800">{plaza.plazaNombre}</h4>
                      <span className="text-sm text-gray-500">Evaluado: {formatFecha(plaza.fechaEvaluacion)}</span>
                    </div>

                    {plaza.evaluacion ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Certificación escolar aportada:</span> <span className="font-medium">{plaza.evaluacion.titulacion || "-"}</span></div>
                        <div><span className="text-gray-500">Idiomas que domina:</span> <span className="font-medium">{plaza.evaluacion.idiomas || "-"}</span></div>
                        <div><span className="text-gray-500">Nivel que tiene:</span> <span className="font-medium">{plaza.evaluacion.nivel || "-"}</span></div>
                        <div><span className="text-gray-500">Licencia de conducción:</span> <span className="font-medium">{plaza.evaluacion.licencia || "-"}</span></div>
                        
                        {plaza.evaluacion.oficios && (
                          <div className="md:col-span-2"><span className="text-gray-500">Muestra de oficios en los que ha trabajado:</span> <span className="font-medium">{plaza.evaluacion.oficios}</span></div>
                        )}
                        {plaza.evaluacion.cursos && (
                          <div className="md:col-span-2"><span className="text-gray-500">Cursos que ha realizado:</span> <span className="font-medium">{plaza.evaluacion.cursos}</span></div>
                        )}
                        {plaza.evaluacion.desempeno && (
                          <div className="md:col-span-2">
                            <span className="text-gray-500">Observaciones del reclutador:</span>
                            <p className="font-medium mt-1">{plaza.evaluacion.desempeno}</p>
                          </div>
                        )}
                        
                        <div><span className="text-gray-500">Resultado de la averiguación en la comunidad:</span> <span className={`font-medium ${plaza.evaluacion.comunitaria === 'aprobado' ? 'text-green-600' : plaza.evaluacion.comunitaria === 'rechazado' ? 'text-red-600' : 'text-yellow-600'}`}>{plaza.evaluacion.comunitaria || "-"}</span></div>
                        <div><span className="text-gray-500">Resultado de la averiguación en centros de trabajo anteriores:</span> <span className={`font-medium ${plaza.evaluacion.intrabajo === 'aprobado' ? 'text-green-600' : plaza.evaluacion.intrabajo === 'rechazado' ? 'text-red-600' : 'text-yellow-600'}`}>{plaza.evaluacion.intrabajo || "-"}</span></div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Esta plaza aún no ha sido evaluada</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalCitar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalCitar(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Citar Candidato</h2>
              <p className="text-gray-600 mb-4">
                <strong>{modalCitar.candidato.nombre}</strong> - {modalCitar.candidato.ci}
              </p>
              
              {stepCitar === "seleccionar" ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Seleccione la plaza para citar:</p>
                  {modalCitar.plazasAprobadas.map((plaza, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPlazaSeleccionada(plaza);
                        setStepCitar("formulario");
                      }}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-[#002A8F] hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{plaza.plazaNombre}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setModalCitar(null)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mt-4"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formCitar.fechaCita || !formCitar.direccion || !formCitar.requisitos) return;
                  setCitando(true);
                  try {
                    const res = await fetch("/api/reserva", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        solicitudId: plazaSeleccionada?.solicitudId,
                        email: modalCitar.candidato.email,
                        nombre: modalCitar.candidato.nombre,
                        plazaNombre: plazaSeleccionada?.plazaNombre,
                        fechaCita: formCitar.fechaCita,
                        direccion: formCitar.direccion,
                        requisitos: formCitar.requisitos
                      })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert(data.error || "Error al enviar la cita");
                      return;
                    }
                    alert("Cita enviada exitosamente");
                    setSolicitudesCitadas([...solicitudesCitadas, { solicitudId: plazaSeleccionada!.solicitudId, candidatoId: modalCitar.candidato.id, nombre: modalCitar.candidato.nombre }]);
                    setModalCitar(null);
                    setPlazaSeleccionada(null);
                    setFormCitar({ fechaCita: "", direccion: "", requisitos: "" });
                    setStepCitar("seleccionar");
                    fetchReserva();
                  } catch (error) {
                    console.error("Error sending cita:", error);
                    alert("Error al enviar la cita");
                  } finally {
                    setCitando(false);
                  }
                }} className="space-y-4">
                  <p className="text-sm text-gray-500">Plaza: <span className="font-medium text-gray-800">{plazaSeleccionada?.plazaNombre}</span></p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de la Cita</label>
                    <input
                      type="datetime-local"
                      value={formCitar.fechaCita}
                      onChange={(e) => setFormCitar({ ...formCitar, fechaCita: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      value={formCitar.direccion}
                      onChange={(e) => setFormCitar({ ...formCitar, direccion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
                      placeholder="Dirección donde debe presentarse"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documentos y Requisitos a Traer</label>
                    <textarea
                      value={formCitar.requisitos}
                      onChange={(e) => setFormCitar({ ...formCitar, requisitos: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent resize-none"
                      placeholder="Lista de documentos que debe traer"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setModalCitar(null);
                        setPlazaSeleccionada(null);
                        setFormCitar({ fechaCita: "", direccion: "", requisitos: "" });
                        setStepCitar("seleccionar");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={citando}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {citando ? "Enviando..." : "Enviar Cita"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}