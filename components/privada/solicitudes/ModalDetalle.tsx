/**
 * ModalDetalle - Modal con información completa de una solicitud. Muestra 9 secciones
 * de datos del candidato: Datos Personales (nombre, CI, teléfono, email, fecha nac., edad,
 * sexo, color piel/pelo, peso, estatura, estado civil, municipio nac.), Familia (padre, madre),
 * Dirección (dirección, reparto, municipio, provincia), Teléfonos (particular, laboral, familiar),
 * Nivel Escolar (nivel, especialidad), Experiencia Laboral (profesiones, idiomas, cursos, licencia),
 * Experiencia en Turismo (ha trabajado, centros), Fuente de Procedencia, Trayectoria Política.
 * También muestra los requisitos de la plaza y los requisitos cumplidos por el candidato,
 * además del estado, fecha y motivo de denegación (si aplica).
 */

import { Solicitud } from "./hooks/useSolicitudes";

interface ModalDetalleProps {
  solicitud: Solicitud | null;
  onClose: () => void;
  formatFecha: (fecha: string) => string;
  getEstadoColor: (estado: string) => string;
}

export function ModalDetalle({ solicitud, onClose, formatFecha, getEstadoColor }: ModalDetalleProps) {
  if (!solicitud) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-2 md:p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl md:max-w-3xl my-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Detalles de Solicitud</h2>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-gray-500">Candidato:</span> <span className="font-medium break-words">{solicitud.candidato.nombre}</span></div>
                <div><span className="text-gray-500">CI:</span> <span className="font-medium">{solicitud.candidato.ci}</span></div>
                <div><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{solicitud.candidato.telefono || "-"}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium break-words">{solicitud.candidato.email || "-"}</span></div>
                <div><span className="text-gray-500">Fecha Nac.:</span> <span className="font-medium">{solicitud.candidato.fechaNacimiento || "-"}</span></div>
                <div><span className="text-gray-500">Edad:</span> <span className="font-medium">{solicitud.candidato.edad || "-"}</span></div>
                <div><span className="text-gray-500">Sexo:</span> <span className="font-medium">{solicitud.candidato.sexo || "-"}</span></div>
                <div><span className="text-gray-500">Color Piel:</span> <span className="font-medium">{solicitud.candidato.colorPiel || "-"}</span></div>
                <div><span className="text-gray-500">Color Pelo:</span> <span className="font-medium">{solicitud.candidato.colorPelo || "-"}</span></div>
                <div><span className="text-gray-500">Peso (kg):</span> <span className="font-medium">{solicitud.candidato.peso || "-"}</span></div>
                <div><span className="text-gray-500">Estatura (cm):</span> <span className="font-medium">{solicitud.candidato.estatura || "-"}</span></div>
                <div><span className="text-gray-500">Estado Civil:</span> <span className="font-medium">{solicitud.candidato.estadoCivil || "-"}</span></div>
                <div className="md:col-span-2"><span className="text-gray-500">Municipio Nac.:</span> <span className="font-medium">{solicitud.candidato.municipioNacimiento || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Familia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-gray-500">Nombre Padre:</span> <span className="font-medium">{solicitud.candidato.nombrePadre || "-"}</span></div>
                <div><span className="text-gray-500">Nombre Madre:</span> <span className="font-medium">{solicitud.candidato.nombreMadre || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2"><span className="text-gray-500">Dirección:</span> <span className="font-medium">{solicitud.candidato.direccion || "-"}</span></div>
                <div><span className="text-gray-500">Reparto:</span> <span className="font-medium">{solicitud.candidato.reparto || "-"}</span></div>
                <div><span className="text-gray-500">Municipio:</span> <span className="font-medium">{solicitud.candidato.municipio || "-"}</span></div>
                <div><span className="text-gray-500">Provincia:</span> <span className="font-medium">{solicitud.candidato.provincia || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Teléfonos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div><span className="text-gray-500">Particular:</span> <span className="font-medium">{solicitud.candidato.telefonoParticular || "-"}</span></div>
                <div><span className="text-gray-500">Laboral:</span> <span className="font-medium">{solicitud.candidato.telefonoLaboral || "-"}</span></div>
                <div><span className="text-gray-500">Familiar:</span> <span className="font-medium">{solicitud.candidato.telefonoFamiliar || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Nivel Escolar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-gray-500">Nivel:</span> <span className="font-medium">{solicitud.candidato.nivelEscolar || "-"}</span></div>
                <div><span className="text-gray-500">Especialidad:</span> <span className="font-medium">{solicitud.candidato.especialidad || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Experiencia Laboral</h3>
              <div className="space-y-1">
                <div><span className="text-gray-500">Profesiones/Oficios:</span> <span className="font-medium">{solicitud.candidato.profesiones || "-"}</span></div>
                <div><span className="text-gray-500">Idiomas:</span> <span className="font-medium">{solicitud.candidato.idiomas || "-"}</span></div>
                <div><span className="text-gray-500">Cursos:</span> <span className="font-medium">{solicitud.candidato.cursos || "-"}</span></div>
                <div><span className="text-gray-500">Licencia:</span> <span className="font-medium">{solicitud.candidato.licenciaConduccion || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Experiencia en Turismo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-gray-500">Ha trabajado:</span> <span className="font-medium">{solicitud.candidato.haTrabajadoTurismo ? "Sí" : "No"}</span></div>
                <div><span className="text-gray-500">Centros:</span> <span className="font-medium">{solicitud.candidato.experienciaTurismo || "-"}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Fuente de Procedencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2"><span className="text-gray-500">Fuente:</span> <span className="font-medium">{solicitud.candidato.fuenteProcedencia || "-"}</span></div>
                {solicitud.candidato.otraFuente && <div><span className="text-gray-500">Otra:</span> <span className="font-medium">{solicitud.candidato.otraFuente}</span></div>}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-[#002A8F] mb-2">Trayectoria Política</h3>
              <div><span className="text-gray-500">Detalles:</span> <span className="font-medium">{solicitud.candidato.trayectoriaPolitica || "-"}</span></div>
            </div>

            {solicitud.plaza && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-[#002A8F] mb-2">Requisitos de la Plaza</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{solicitud.plaza.requisitos || "Sin requisitos definidos"}</div>
              </div>
            )}

            {solicitud.requisitosCumplidos && (
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="font-semibold text-[#002A8F] mb-2">Requisitos Cumplidos por el Candidato</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{solicitud.requisitosCumplidos}</div>
              </div>
            )}

            <div className="border-t pt-4 flex flex-wrap gap-4 text-xs md:text-sm">
              <div><span className="text-gray-500">Plaza:</span> <span className="font-medium">{solicitud.plazaNombre}</span></div>
              <div><span className="text-gray-500">Estado:</span> <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getEstadoColor(solicitud.estado)}`}>{solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span></div>
              <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formatFecha(solicitud.creadoEn)}</span></div>
              {solicitud.estado === "rechazado" && solicitud.motivoDenegacion && (
                <div className="w-full mt-2">
                  <span className="text-gray-500">Motivo de denegación:</span>
                  <p className="text-red-600 font-medium">{solicitud.motivoDenegacion}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
