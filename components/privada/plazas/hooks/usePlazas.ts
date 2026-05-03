import { useState, useEffect, useCallback } from "react";

export interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
  funciones: string;
  activo: boolean;
}

/**
 * usePlazas - Custom hook que centraliza toda la lógica de gestión de plazas:
 * - Fetch de todas las plazas desde /api/plazas
 * - Crear nuevas plazas (POST) y editar existentes (PUT)
 * - Eliminar plazas (DELETE) con manejo de error cuando tiene solicitudes asociadas
 * - Toggle del estado activo/inactivo de cada plaza
 * - Filtrado para mostrar solo activas o todas (activas + inactivas)
 */
export function usePlazas() {
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<Plaza | null>(null);
  const [form, setForm] = useState({ nombre: "", requisitos: "", funciones: "" });
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [errorDelete, setErrorDelete] = useState<{message: string, plaza: Plaza} | null>(null);

  const fetchPlazas = useCallback(async () => {
    try {
      const res = await fetch("/api/plazas");
      const data = await res.json();
      setPlazas(data);
    } catch (error) {
      console.error("Error fetching plazas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlazas();
  }, [fetchPlazas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/plazas";
      const method = editingPlaza ? "PUT" : "POST";

      const body = editingPlaza
        ? { ...form, activo: true, id: editingPlaza.id }
        : form;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      setModalOpen(false);
      setEditingPlaza(null);
      setForm({ nombre: "", requisitos: "", funciones: "" });
      fetchPlazas();
    } catch (error) {
      console.error("Error saving plaza:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/plazas?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        const plaza = plazas.find(p => p.id === id);
        if (data.tieneSolicitudes && plaza) {
          setErrorDelete({ message: data.error, plaza });
          return;
        }
        alert(data.error || data.detalles || "Error al eliminar la plaza");
        return;
      }

      setDeleteConfirm(null);
      fetchPlazas();
    } catch (error) {
      console.error("Error deleting plaza:", error);
      alert("Error de conexión al eliminar la plaza");
    }
  };

  const openEditModal = (plaza: Plaza) => {
    setEditingPlaza(plaza);
    setForm({ nombre: plaza.nombre, requisitos: plaza.requisitos, funciones: plaza.funciones });
    setModalOpen(true);
  };

  const openNewModal = () => {
    setEditingPlaza(null);
    setForm({ nombre: "", requisitos: "", funciones: "" });
    setModalOpen(true);
  };

  const closeFormModal = () => {
    setModalOpen(false);
    setEditingPlaza(null);
    setForm({ nombre: "", requisitos: "", funciones: "" });
  };

  const toggleActivo = async (plaza: Plaza) => {
    try {
      await fetch("/api/plazas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...plaza, activo: !plaza.activo })
      });
      fetchPlazas();
    } catch (error) {
      console.error("Error toggling plaza:", error);
    }
  };

  const handleInactivarPlaza = async (plaza: Plaza) => {
    try {
      await fetch("/api/plazas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...plaza, activo: false })
      });
      setErrorDelete(null);
      setDeleteConfirm(null);
      fetchPlazas();
    } catch (error) {
      console.error("Error inactivating plaza:", error);
    }
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 42, 143);
    doc.text("Reporte de Plazas", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

    if (showInactive) {
      doc.text("Mostrando: Todas las plazas (activas e inactivas)", 14, 34);
    } else {
      doc.text("Mostrando: Solo plazas activas", 14, 34);
    }

    const tableData = filteredPlazas.map((plaza) => [
      plaza.nombre,
      plaza.requisitos,
      plaza.funciones,
      plaza.activo ? "Activo" : "Inactivo"
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Nombre", "Requisitos", "Funciones", "Estado"]],
      body: tableData,
      headStyles: {
        fillColor: [0, 42, 143],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
        3: { cellWidth: 25 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total de plazas: ${filteredPlazas.length}`, 14, finalY);

    doc.save("plazas.pdf");
  };

  const filteredPlazas = showInactive ? plazas : plazas.filter(p => p.activo);

  return {
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
    toggleActivo,
    handleInactivarPlaza,
    exportToPDF,
  };
}
