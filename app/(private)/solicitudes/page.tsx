"use client";

import { useState, useEffect } from "react";

interface Candidato {
  id: number;
  ci: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
}

interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
}

interface Solicitud {
  id: number;
  candidatoId: number;
  plazaId: number;
  plazaNombre: string;
  estado: string;
  creadoEn: string;
  candidato: Candidato;
  plaza: Plaza | null;
  requisitosCumplidos: string | null;
  fechaNacimiento: string | null;
  edad: number | null;
  sexo: string | null;
  colorPiel: string | null;
  colorPelo: string | null;
  peso: number | null;
  estatura: number | null;
  estadoCivil: string | null;
  municipioNacimiento: string | null;
  nombrePadre: string | null;
  nombreMadre: string | null;
  direccion: string | null;
  reparto: string | null;
  municipio: string | null;
  provincia: string | null;
  telefonoParticular: string | null;
  telefonoLaboral: string | null;
  telefonoFamiliar: string | null;
  nivelEscolar: string | null;
  especialidad: string | null;
  profesiones: string | null;
  idiomas: string | null;
  cursos: string | null;
  licenciaConduccion: string | null;
  haTrabajadoTurismo: boolean | null;
  experienciaTurismo: string | null;
  fuenteProcedencia: string | null;
  otraFuente: string | null;
  trayectoriaPolitica: string | null;
  motivoDenegacion: string | null;
}

const estados = [
  { value: "todos", label: "Todas" },
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobado", label: "Aprobados" },
  { value: "rechazado", label: "Rechazados" },
];

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [detalleSolicitud, setDetalleSolicitud] = useState<Solicitud | null>(null);
  const [solicitudADenegar, setSolicitudADenegar] = useState<Solicitud | null>(null);
  const [motivoDenegacion, setMotivoDenegacion] = useState("");
  const [denegando, setDenegando] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch("/api/solicitudes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSolicitudes(data);
      } else {
        console.error("Error: la API devolvio un objeto en lugar de array", data);
        setSolicitudes([]);
      }
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string, motivo?: string) => {
    try {
      const body: { estado: string; motivoDenegacion?: string } = { estado: nuevoEstado };
      if (nuevoEstado === "rechazado" && motivo) {
        body.motivoDenegacion = motivo;
      }
      
      const res = await fetch(`/api/solicitudes?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        fetchSolicitudes();
      }
    } catch (error) {
      console.error("Error updating estado:", error);
    }
  };

  const filteredSolicitudes = solicitudes.filter((s) => {
    const matchesEstado = filtroEstado === "todos" || s.estado === filtroEstado;
    const matchesBusqueda = busqueda === "" || 
      s.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.plazaNombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchesEstado && matchesBusqueda;
  });

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-700";
      case "aprobado": return "bg-green-100 text-green-700";
      case "rechazado": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Solicitudes</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredSolicitudes.length} de {solicitudes.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {estados.map((e) => (
            <button
              key={e.value}
              onClick={() => setFiltroEstado(e.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === e.value
                  ? "bg-[#002A8F] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, CI o plaza..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent text-sm w-full md:w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Candidato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">CI</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Plaza</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSolicitudes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No hay solicitudes
                  </td>
                </tr>
              ) : (
                filteredSolicitudes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{s.candidato.nombre}</div>
                      <div className="text-xs text-gray-500 md:hidden">{s.candidato.ci}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{s.candidato.ci}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{s.plazaNombre}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getEstadoColor(s.estado)}`}>
                        {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{formatFecha(s.creadoEn)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => setDetalleSolicitud(s)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {s.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() => cambiarEstado(s.id, "aprobado")}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Aprobar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setSolicitudADenegar(s)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Rechazar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detalleSolicitud && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-2 md:p-4 overflow-y-auto" onClick={() => setDetalleSolicitud(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl md:max-w-3xl my-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Detalles de Solicitud</h2>
              
              <div className="space-y-4 text-xs md:text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Datos Personales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="text-gray-500">Candidato:</span> <span className="font-medium break-words">{detalleSolicitud.candidato.nombre}</span></div>
                    <div><span className="text-gray-500">CI:</span> <span className="font-medium">{detalleSolicitud.candidato.ci}</span></div>
                    <div><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{detalleSolicitud.candidato.telefono || "-"}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="font-medium break-words">{detalleSolicitud.candidato.email || "-"}</span></div>
                    <div><span className="text-gray-500">Fecha Nac.:</span> <span className="font-medium">{detalleSolicitud.fechaNacimiento || "-"}</span></div>
                    <div><span className="text-gray-500">Edad:</span> <span className="font-medium">{detalleSolicitud.edad || "-"}</span></div>
                    <div><span className="text-gray-500">Sexo:</span> <span className="font-medium">{detalleSolicitud.sexo || "-"}</span></div>
                    <div><span className="text-gray-500">Color Piel:</span> <span className="font-medium">{detalleSolicitud.colorPiel || "-"}</span></div>
                    <div><span className="text-gray-500">Color Pelo:</span> <span className="font-medium">{detalleSolicitud.colorPelo || "-"}</span></div>
                    <div><span className="text-gray-500">Peso (kg):</span> <span className="font-medium">{detalleSolicitud.peso || "-"}</span></div>
                    <div><span className="text-gray-500">Estatura (cm):</span> <span className="font-medium">{detalleSolicitud.estatura || "-"}</span></div>
                    <div><span className="text-gray-500">Estado Civil:</span> <span className="font-medium">{detalleSolicitud.estadoCivil || "-"}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500">Municipio Nac.:</span> <span className="font-medium">{detalleSolicitud.municipioNacimiento || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Familia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="text-gray-500">Nombre Padre:</span> <span className="font-medium">{detalleSolicitud.nombrePadre || "-"}</span></div>
                    <div><span className="text-gray-500">Nombre Madre:</span> <span className="font-medium">{detalleSolicitud.nombreMadre || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="md:col-span-2"><span className="text-gray-500">Dirección:</span> <span className="font-medium">{detalleSolicitud.direccion || "-"}</span></div>
                    <div><span className="text-gray-500">Reparto:</span> <span className="font-medium">{detalleSolicitud.reparto || "-"}</span></div>
                    <div><span className="text-gray-500">Municipio:</span> <span className="font-medium">{detalleSolicitud.municipio || "-"}</span></div>
                    <div><span className="text-gray-500">Provincia:</span> <span className="font-medium">{detalleSolicitud.provincia || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Teléfonos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div><span className="text-gray-500">Particular:</span> <span className="font-medium">{detalleSolicitud.telefonoParticular || "-"}</span></div>
                    <div><span className="text-gray-500">Laboral:</span> <span className="font-medium">{detalleSolicitud.telefonoLaboral || "-"}</span></div>
                    <div><span className="text-gray-500">Familiar:</span> <span className="font-medium">{detalleSolicitud.telefonoFamiliar || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Nivel Escolar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="text-gray-500">Nivel:</span> <span className="font-medium">{detalleSolicitud.nivelEscolar || "-"}</span></div>
                    <div><span className="text-gray-500">Especialidad:</span> <span className="font-medium">{detalleSolicitud.especialidad || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Experiencia Laboral</h3>
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Profesiones/Oficios:</span> <span className="font-medium">{detalleSolicitud.profesiones || "-"}</span></div>
                    <div><span className="text-gray-500">Idiomas:</span> <span className="font-medium">{detalleSolicitud.idiomas || "-"}</span></div>
                    <div><span className="text-gray-500">Cursos:</span> <span className="font-medium">{detalleSolicitud.cursos || "-"}</span></div>
                    <div><span className="text-gray-500">Licencia:</span> <span className="font-medium">{detalleSolicitud.licenciaConduccion || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Experiencia en Turismo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="text-gray-500">Ha trabajado:</span> <span className="font-medium">{detalleSolicitud.haTrabajadoTurismo ? "Sí" : "No"}</span></div>
                    <div><span className="text-gray-500">Centros:</span> <span className="font-medium">{detalleSolicitud.experienciaTurismo || "-"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Fuente de Procedencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="md:col-span-2"><span className="text-gray-500">Fuente:</span> <span className="font-medium">{detalleSolicitud.fuenteProcedencia || "-"}</span></div>
                    {detalleSolicitud.otraFuente && <div><span className="text-gray-500">Otra:</span> <span className="font-medium">{detalleSolicitud.otraFuente}</span></div>}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-[#002A8F] mb-2">Trayectoria Política</h3>
                  <div><span className="text-gray-500">Detalles:</span> <span className="font-medium">{detalleSolicitud.trayectoriaPolitica || "-"}</span></div>
                </div>

                {detalleSolicitud.plaza && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-[#002A8F] mb-2">Requisitos de la Plaza</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{detalleSolicitud.plaza.requisitos || "Sin requisitos definidos"}</div>
                  </div>
                )}

                {detalleSolicitud.requisitosCumplidos && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-[#002A8F] mb-2">Requisitos Cumplidos por el Candidato</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{detalleSolicitud.requisitosCumplidos}</div>
                  </div>
                )}

                <div className="border-t pt-4 flex flex-wrap gap-4 text-xs md:text-sm">
                  <div><span className="text-gray-500">Plaza:</span> <span className="font-medium">{detalleSolicitud.plazaNombre}</span></div>
                  <div><span className="text-gray-500">Estado:</span> <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getEstadoColor(detalleSolicitud.estado)}`}>{detalleSolicitud.estado.charAt(0).toUpperCase() + detalleSolicitud.estado.slice(1)}</span></div>
                  <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formatFecha(detalleSolicitud.creadoEn)}</span></div>
                  {detalleSolicitud.estado === "rechazado" && detalleSolicitud.motivoDenegacion && (
                    <div className="w-full mt-2">
                      <span className="text-gray-500">Motivo de denegación:</span>
                      <p className="text-red-600 font-medium">{detalleSolicitud.motivoDenegacion}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDetalleSolicitud(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {solicitudADenegar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSolicitudADenegar(null); setMotivoDenegacion(""); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Denegar Solicitud</h2>
              <p className="text-gray-600 mb-4">
                ¿Está seguro que desea denegar la solicitud de <span className="font-semibold">{solicitudADenegar.candidato.nombre}</span> para la plaza <span className="font-semibold">{solicitudADenegar.plazaNombre}</span>?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de denegación <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivoDenegacion}
                  onChange={(e) => setMotivoDenegacion(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                  placeholder="Escriba el motivo por el cual se deniega esta solicitud..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setSolicitudADenegar(null); setMotivoDenegacion(""); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!motivoDenegacion.trim()) return;
                    setDenegando(true);
                    await cambiarEstado(solicitudADenegar.id, "rechazado", motivoDenegacion);
                    setSolicitudADenegar(null);
                    setMotivoDenegacion("");
                    setDenegando(false);
                  }}
                  disabled={!motivoDenegacion.trim() || denegando}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {denegando ? "Denegando..." : "Confirmar Denegación"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}