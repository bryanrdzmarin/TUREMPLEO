"use client";

import { useSolicitudes } from "@/components/privada/solicitudes/hooks/useSolicitudes";
import { EstadoTabs } from "@/components/privada/solicitudes/EstadoTabs";
import { SearchBar } from "@/components/privada/solicitudes/SearchBar";
import { SolicitudesTable } from "@/components/privada/solicitudes/SolicitudesTable";
import { ModalDetalle } from "@/components/privada/solicitudes/ModalDetalle";
import { ModalDenegar } from "@/components/privada/solicitudes/ModalDenegar";
import { ExportPDFButton } from "@/components/privada/ui/ExportPDFButton";

export default function SolicitudesPage() {
  const {
    filteredSolicitudes,
    totalCount,
    loading,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    detalleSolicitud,
    setDetalleSolicitud,
    solicitudADenegar,
    setSolicitudADenegar,
    motivoDenegacion,
    setMotivoDenegacion,
    denegando,
    cambiarEstado,
    handleDenegar,
    formatFecha,
    getEstadoColor,
    exportToPDF,
  } = useSolicitudes();

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Solicitudes</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {filteredSolicitudes.length} de {totalCount}
          </div>
          <ExportPDFButton
            onExport={exportToPDF}
            disabled={filteredSolicitudes.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <EstadoTabs filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} />
        <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
      </div>

      <SolicitudesTable
        solicitudes={filteredSolicitudes}
        onVerDetalle={setDetalleSolicitud}
        onAprobar={(id) => cambiarEstado(id, "aprobado")}
        onRechazar={setSolicitudADenegar}
        getEstadoColor={getEstadoColor}
        formatFecha={formatFecha}
      />

      <ModalDetalle
        solicitud={detalleSolicitud}
        onClose={() => setDetalleSolicitud(null)}
        formatFecha={formatFecha}
        getEstadoColor={getEstadoColor}
      />

      <ModalDenegar
        solicitud={solicitudADenegar}
        motivo={motivoDenegacion}
        setMotivo={setMotivoDenegacion}
        onConfirm={handleDenegar}
        onCancel={() => { setSolicitudADenegar(null); setMotivoDenegacion(""); }}
        denegando={denegando}
      />
    </div>
  );
}
