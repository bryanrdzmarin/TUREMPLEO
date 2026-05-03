"use client";

import { useCandidatos } from "@/components/privada/candidatos/hooks/useCandidatos";
import { TabButtons } from "@/components/privada/candidatos/TabButtons";
import { SearchBar } from "@/components/privada/candidatos/SearchBar";
import { CandidatosTable } from "@/components/privada/candidatos/CandidatosTable";
import { EvaluacionEntrevista } from "@/components/privada/candidatos/EvaluacionEntrevista";
import { ModalCita } from "@/components/privada/candidatos/ModalCita";
import { ModalInfoForm } from "@/components/privada/candidatos/ModalInfoForm";
import { ExportPDFButton } from "@/components/privada/ui/ExportPDFButton";

export default function CandidatosPage() {
  const {
    candidatos,
    getFilteredList,
    getTotal,
    getTotalAll,
    loading,
    tab,
    setTab,
    busqueda,
    setBusqueda,
    modalOpen,
    cerrarModal,
    candidatoSeleccionado,
    setCandidatoSeleccionado,
    enviando,
    error,
    formData,
    setFormData,
    abrirModal,
    handleSubmitCita,
    showInfoForm,
    infoFormData,
    setInfoFormData,
    savingInfo,
    openInfoForm,
    closeInfoForm,
    guardarInfoYCambiarEstado,
    getMinDate,
    formatFecha,
    exportToPDF,
  } = useCandidatos();

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
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {totalActual} de {totalTodos}
          </div>
          <ExportPDFButton
            onExport={exportToPDF}
            disabled={totalActual === 0}
          />
        </div>
      </div>

      <TabButtons
        tab={tab}
        setTab={setTab}
        counts={{
          pendientes: candidatos.pendientes.length,
          citados: candidatos.citados.length,
          aprobados: candidatos.aprobados.length,
          rechazados: candidatos.rechazados.length,
        }}
      />

      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />

      <CandidatosTable
        lista={listaActual}
        tab={tab}
        candidatoSeleccionado={candidatoSeleccionado}
        setCandidatoSeleccionado={setCandidatoSeleccionado}
        abrirModal={abrirModal}
        formatFecha={formatFecha}
      />

      {tab === "citados" && (
        <EvaluacionEntrevista
          lista={listaActual}
          candidatoSeleccionado={candidatoSeleccionado}
          onEvaluar={openInfoForm}
          enviando={enviando}
        />
      )}

      {modalOpen && candidatoSeleccionado && (
        <ModalCita
          open={modalOpen}
          candidato={candidatoSeleccionado}
          onClose={cerrarModal}
          onSubmit={handleSubmitCita}
          formData={formData}
          setFormData={setFormData}
          error={error}
          enviando={enviando}
          minDate={getMinDate()}
        />
      )}

      {showInfoForm && candidatoSeleccionado && (
        <ModalInfoForm
          open={showInfoForm}
          candidato={candidatoSeleccionado}
          onClose={closeInfoForm}
          onApprove={() => guardarInfoYCambiarEstado(true)}
          onReject={() => guardarInfoYCambiarEstado(false)}
          formData={infoFormData}
          setFormData={setInfoFormData}
          error={error}
          saving={savingInfo}
        />
      )}
    </div>
  );
}
