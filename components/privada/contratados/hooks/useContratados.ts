import { useState, useEffect, useCallback } from "react";

interface Plaza {
  plazaNombre: string;
  fechaContratacion: string | Date;
}

export interface ContratadoData {
  candidato: {
    id: number;
    ci: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
  };
  plazas: Plaza[];
  fechaContratacion: string | Date;
}

/**
 * useContratados - Custom hook que centraliza toda la lógica de gestión de contratados:
 * - Fetch de contratados con filtros de plaza y rango de fechas
 * - Extracción de plazas únicas para el filtro
 * - Formateo de fechas
 * - Exportación de reporte a PDF con jsPDF y autoTable
 * - Estado de loading y limpieza de filtros
 */
export function useContratados() {
  const [contratados, setContratados] = useState<ContratadoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [plazas, setPlazas] = useState<string[]>([]);
  const [filtroPlaza, setFiltroPlaza] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const fetchContratados = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroPlaza) params.append("plaza", filtroPlaza);
      if (fechaDesde) params.append("fechaDesde", fechaDesde);
      if (fechaHasta) params.append("fechaHasta", fechaHasta);

      const res = await fetch(`/api/contratados?${params.toString()}`);
      const data = await res.json();
      setContratados(data);

      const plazasUnicas = [...new Set(data.flatMap((c: ContratadoData) => c.plazas.map(p => p.plazaNombre)))] as string[];
      setPlazas(plazasUnicas);
    } catch (error) {
      console.error("Error fetching contratados:", error);
    } finally {
      setLoading(false);
    }
  }, [filtroPlaza, fechaDesde, fechaHasta]);

  useEffect(() => {
    fetchContratados();
  }, [fetchContratados]);

  const formatFecha = (fecha: string | Date | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const limpiarFiltros = () => {
    setFiltroPlaza("");
    setFechaDesde("");
    setFechaHasta("");
  };

  const tieneFiltros = !!(filtroPlaza || fechaDesde || fechaHasta);

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 42, 143);
    doc.text("Reporte de Personal Contratado", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

    let startY = 35;
    if (fechaDesde || fechaHasta) {
      let rangoFechas = "";
      if (fechaDesde && fechaHasta) {
        rangoFechas = `Período: ${formatFecha(fechaDesde)} - ${formatFecha(fechaHasta)}`;
      } else if (fechaDesde) {
        rangoFechas = `Desde: ${formatFecha(fechaDesde)}`;
      } else {
        rangoFechas = `Hasta: ${formatFecha(fechaHasta)}`;
      }
      doc.text(rangoFechas, 14, 34);
      startY = 40;
    }

    const tableData = contratados.map((item) => [
      item.candidato.ci,
      item.candidato.nombre,
      item.plazas.map(p => p.plazaNombre).join(", "),
      formatFecha(item.fechaContratacion)
    ]);

    autoTable(doc, {
      startY,
      head: [["CI", "Nombre", "Plaza(s)", "Fecha Contratación"]],
      body: tableData,
      headStyles: {
        fillColor: [0, 42, 143],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total de contratados: ${contratados.length}`, 14, finalY);

    doc.save("contratados.pdf");
  };

  return {
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
  };
}
