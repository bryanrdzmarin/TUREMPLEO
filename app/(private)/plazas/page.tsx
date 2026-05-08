"use client";

import { usePlazas } from "@/components/privada/plazas/hooks/usePlazas";
import { HeaderActions } from "@/components/privada/plazas/HeaderActions";
import { PlazasTable } from "@/components/privada/plazas/PlazasTable";
import { ModalForm } from "@/components/privada/plazas/ModalForm";
import { ModalDeleteConfirm } from "@/components/privada/plazas/ModalDeleteConfirm";
import { ModalErrorDelete } from "@/components/privada/plazas/ModalErrorDelete";
import { ModalErrorEdit } from "@/components/privada/plazas/ModalErrorEdit";

export default function PlazasPage() {
  const {
    filteredPlazas,
    loading,
    showInactive,
    setShowInactive,
    modalOpen,
    editingPlaza,
    form,
    setForm,
    openEditModal,
    openNewModal,
    closeFormModal,
    handleSubmit,
    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    errorDelete,
    setErrorDelete,
    errorEdit,
    setErrorEdit,
    toggleActivo,
    handleInactivarPlaza,
    exportToPDF,
  } = usePlazas();

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Plazas</h1>
        <HeaderActions
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          onNewPlaza={openNewModal}
          onExportPDF={exportToPDF}
          hasPlazas={filteredPlazas.length > 0}
        />
      </div>

      <PlazasTable
        plazas={filteredPlazas}
        onEdit={openEditModal}
        onDeleteConfirm={setDeleteConfirm}
        onToggleActivo={toggleActivo}
      />

      <ModalForm
        open={modalOpen}
        editingPlaza={editingPlaza}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onClose={closeFormModal}
      />

      <ModalDeleteConfirm
        open={deleteConfirm !== null}
        onConfirm={() => handleDelete(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {errorDelete && (
        <ModalErrorDelete
          open={errorDelete !== null}
          message={errorDelete.message}
          onInactivar={() => handleInactivarPlaza(errorDelete.plaza)}
          onCancel={() => setErrorDelete(null)}
        />
      )}

      {errorEdit && (
        <ModalErrorEdit
          open={errorEdit !== null}
          message={errorEdit.message}
          onInactivar={() => handleInactivarPlaza(errorEdit.plaza)}
          onCancel={() => setErrorEdit(null)}
        />
      )}
    </div>
  );
}
