"use client";

import { useReserva } from "@/components/privada/reserva/hooks/useReserva";
import { VistaTabs } from "@/components/privada/reserva/VistaTabs";
import { FilterPanel } from "@/components/privada/reserva/FilterPanel";
import { ReservaTable } from "@/components/privada/reserva/ReservaTable";
import { CitadosTable } from "@/components/privada/reserva/CitadosTable";
import { ModalDetalles } from "@/components/privada/reserva/ModalDetalles";
import { ModalCitar } from "@/components/privada/reserva/ModalCitar";
import { ExportPDFButton } from "@/components/privada/ui/ExportPDFButton";

export default function ReservaPage() {
  const {
    reserva,
    loading,
    plazas,
    filtros,
    setFiltros,
    candidatoSeleccionado,
    setCandidatoSeleccionado,
    vistaActiva,
    handleSetVistaActiva,
    aplicarFiltros,
    formatFecha,
    modalCitar,
    plazaSeleccionada,
    formCitar,
    setFormCitar,
    citando,
    stepCitar,
    openCitarModal,
    selectPlaza,
    closeCitarModal,
    submitCitar,
    handleDenegar,
    handleAprobar,
    exportToPDF,
  } = useReserva();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#002A8F]">Reserva Laboral</h1>
          <div className="flex items-center gap-4">
            <ExportPDFButton
              onExport={exportToPDF}
              disabled={reserva.length === 0}
            />
            <VistaTabs vistaActiva={vistaActiva} setVista={handleSetVistaActiva} />
          </div>
        </div>

        {vistaActiva === "reserva" && (
          <FilterPanel
            filtros={filtros}
            setFiltros={setFiltros}
            plazas={plazas}
            onAplicar={aplicarFiltros}
          />
        )}
      </div>

      {vistaActiva === "reserva" && (
        <ReservaTable
          reserva={reserva}
          loading={loading}
          onVerDetalles={setCandidatoSeleccionado}
          onCitar={openCitarModal}
        />
      )}

      {vistaActiva === "citados" && (
        <CitadosTable
          reserva={reserva}
          loading={loading}
          onDenegar={handleDenegar}
          onAprobar={handleAprobar}
        />
      )}

      <ModalDetalles
        candidato={candidatoSeleccionado}
        onClose={() => setCandidatoSeleccionado(null)}
        formatFecha={formatFecha}
      />

      <ModalCitar
        modalCitar={modalCitar}
        stepCitar={stepCitar}
        plazaSeleccionada={plazaSeleccionada}
        formCitar={formCitar}
        citando={citando}
        onSelectPlaza={selectPlaza}
        onFormChange={setFormCitar}
        onSubmit={submitCitar}
        onClose={closeCitarModal}
      />
    </div>
  );
}
