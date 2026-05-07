"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: number;
  usuarioId: number | null;
  accion: string;
  entidad: string;
  entidadId: number | null;
  detalles: string | null;
  ip: string | null;
  creadoEn: string;
  usuario: {
    id: number;
    nombreUsuario: string;
    nombre: string;
    rol: string;
  } | null;
}

interface Usuario {
  id: number;
  nombreUsuario: string;
  nombre: string;
  rol: string;
}

const ACCION_LABELS: Record<string, string> = {
  CREAR_USUARIO: "Crear usuario",
  ACTUALIZAR_USUARIO: "Actualizar usuario",
  ELIMINAR_USUARIO: "Eliminar usuario",
  RESETEAR_CONTRASEÑA_EMAIL: "Reset por email",
  GENERAR_CONTRASEÑA: "Generar contraseña",
  CREAR_PLAZA: "Crear plaza",
  ACTUALIZAR_PLAZA: "Actualizar plaza",
  ELIMINAR_PLAZA: "Eliminar plaza",
  CREAR_SOLICITUD: "Crear solicitud",
  APROBAR_SOLICITUD: "Aprobar solicitud",
  RECHAZAR_SOLICITUD: "Rechazar solicitud",
  MARCAR_ENTREVISTA_PASADA: "Entrevista aprobada",
  MARCAR_ENTREVISTA_RECHAZADA: "Entrevista rechazada",
  CITAR_CANDIDATO: "Citar candidato",
  ACTUALIZAR_CITA: "Actualizar cita",
  CONTRATAR_DESDE_RESERVA: "Contratar desde reserva",
  DENEGAR_DESDE_RESERVA: "Denegar desde reserva",
  CITAR_DESDE_RESERVA: "Citar desde reserva",
  CREAR_CANDIDATO: "Crear candidato",
  ACTUALIZAR_CANDIDATO: "Actualizar candidato",
  CREAR_EVALUACION: "Crear evaluación",
  ACTUALIZAR_EVALUACION: "Actualizar evaluación",
  INTENTO_LOGIN_FALLIDO: "Intento de login fallido",
};

const ACCION_COLORS: Record<string, string> = {
  CREAR_USUARIO: "bg-green-100 text-green-800",
  ACTUALIZAR_USUARIO: "bg-blue-100 text-blue-800",
  ELIMINAR_USUARIO: "bg-red-100 text-red-800",
  RESETEAR_CONTRASEÑA_EMAIL: "bg-yellow-100 text-yellow-800",
  GENERAR_CONTRASEÑA: "bg-yellow-100 text-yellow-800",
  CREAR_PLAZA: "bg-green-100 text-green-800",
  ACTUALIZAR_PLAZA: "bg-blue-100 text-blue-800",
  ELIMINAR_PLAZA: "bg-red-100 text-red-800",
  CREAR_SOLICITUD: "bg-green-100 text-green-800",
  APROBAR_SOLICITUD: "bg-green-100 text-green-800",
  RECHAZAR_SOLICITUD: "bg-red-100 text-red-800",
  MARCAR_ENTREVISTA_PASADA: "bg-green-100 text-green-800",
  MARCAR_ENTREVISTA_RECHAZADA: "bg-red-100 text-red-800",
  CITAR_CANDIDATO: "bg-purple-100 text-purple-800",
  ACTUALIZAR_CITA: "bg-blue-100 text-blue-800",
  CONTRATAR_DESDE_RESERVA: "bg-green-100 text-green-800",
  DENEGAR_DESDE_RESERVA: "bg-red-100 text-red-800",
  CITAR_DESDE_RESERVA: "bg-purple-100 text-purple-800",
  CREAR_CANDIDATO: "bg-green-100 text-green-800",
  ACTUALIZAR_CANDIDATO: "bg-blue-100 text-blue-800",
  CREAR_EVALUACION: "bg-green-100 text-green-800",
  ACTUALIZAR_EVALUACION: "bg-blue-100 text-blue-800",
  INTENTO_LOGIN_FALLIDO: "bg-red-100 text-red-800",
};

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("");
  const [filtroEntidad, setFiltroEntidad] = useState("");
  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "25");
      if (filtroUsuario) params.set("userId", filtroUsuario);
      if (filtroAccion) params.set("accion", filtroAccion);
      if (filtroEntidad) params.set("entidad", filtroEntidad);
      if (filtroDesde) params.set("desde", filtroDesde);
      if (filtroHasta) params.set("hasta", filtroHasta);
      if (filtroBusqueda) params.set("busqueda", filtroBusqueda);

      const res = await fetch(`/api/admin/auditoria?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar auditoría");
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setUsuarios(data.usuarios);
    } catch {
      setLogs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltros = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  const limpiarFiltros = () => {
    setFiltroUsuario("");
    setFiltroAccion("");
    setFiltroEntidad("");
    setFiltroDesde("");
    setFiltroHasta("");
    setFiltroBusqueda("");
    setPage(1);
  };

  const formatDetalles = (detalles: string | null): string => {
    if (!detalles) return "";
    try {
      const data = JSON.parse(detalles);
      const parts: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined && value !== "") {
          parts.push(`${key}: ${value}`);
        }
      }
      return parts.join(" · ");
    } catch {
      return detalles;
    }
  };

  const formatFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleString("es", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const entidades = ["Usuario", "Plaza", "Solicitud", "Candidato", "Cita", "Evaluacion", "Sistema"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registro de Auditoría</h1>
        <p className="text-sm text-gray-500 mt-1">Historial de todas las acciones realizadas en el sistema</p>
      </div>

      <form onSubmit={handleFiltros} className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Usuario</label>
            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombreUsuario || u.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Acción</label>
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            >
              <option value="">Todas</option>
              {Object.entries(ACCION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Entidad</label>
            <select
              value={filtroEntidad}
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            >
              <option value="">Todas</option>
              {entidades.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              placeholder="Buscar en detalles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={filtroDesde}
              onChange={(e) => setFiltroDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={filtroHasta}
              onChange={(e) => setFiltroHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001F5C] transition-colors text-sm font-medium"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#002A8F] border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No hay registros de auditoría.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const colorClass = ACCION_COLORS[log.accion] || "bg-gray-100 text-gray-800";
                  const label = ACCION_LABELS[log.accion] || log.accion;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatFecha(log.creadoEn)}
                      </td>
                      <td className="px-4 py-3">
                        {log.usuario ? (
                          <div>
                            <p className="text-sm text-gray-800 font-medium">{log.usuario.nombreUsuario}</p>
                            <p className="text-xs text-gray-500">{log.usuario.nombre}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Sistema</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.entidad}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={formatDetalles(log.detalles)}>
                        {formatDetalles(log.detalles) || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 font-mono text-xs">
                        {log.ip || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Mostrando {((page - 1) * 25) + 1}–{Math.min(page * 25, total)} de {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
