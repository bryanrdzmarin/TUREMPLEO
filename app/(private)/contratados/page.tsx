"use client";

import { useContratados } from "@/components/privada/contratados/hooks/useContratados";
import { FilterPanel } from "@/components/privada/contratados/FilterPanel";
import { ContratadosTable } from "@/components/privada/contratados/ContratadosTable";
import { ExportPDFButton } from "@/components/privada/contratados/ExportPDFButton";

export default function ContratadosPage() {
  const {
    contratados,
    loading,
    plazas,
    filtroPlaza,
    setFiltroPlaza,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    fetchContratados,
    formatFecha,
    limpiarFiltros,
    tieneFiltros,
    exportToPDF,
  } = useContratados();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#002A8F]">Personal Contratado</h1>
          <ExportPDFButton
            onExport={exportToPDF}
            disabled={contratados.length === 0}
          />
        </div>

        <FilterPanel
          fechaDesde={fechaDesde}
          setFechaDesde={setFechaDesde}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
          filtroPlaza={filtroPlaza}
          setFiltroPlaza={setFiltroPlaza}
          plazas={plazas}
          onBuscar={fetchContratados}
          onLimpiar={limpiarFiltros}
          tieneFiltros={tieneFiltros}
        />

        <ContratadosTable
          contratados={contratados}
          loading={loading}
          formatFecha={formatFecha}
        />
      </div>
    </div>
  );
}
