import { useState, useEffect, useCallback } from "react";

interface Candidato {
  id: number;
  ci: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
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
}

interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
}

export interface Solicitud {
  id: number;
  candidatoId: number;
  plazaId: number;
  plazaNombre: string;
  estado: string;
  creadoEn: string;
  candidato: Candidato;
  plaza: Plaza | null;
  requisitosCumplidos: string | null;
  motivoDenegacion: string | null;
}

/**
 * useSolicitudes - Custom hook que centraliza toda la lógica de gestión de solicitudes:
 * - Fetch de todas las solicitudes desde /api/solicitudes
 * - Filtrado por estado (todos, pendiente, aprobado, rechazado) y búsqueda por nombre/CI/plaza
 * - Cambio de estado: aprobar o rechazar solicitudes via PUT a /api/solicitudes
 * - Manejo de denegación con motivo obligatorio
 * - Formateo de fechas y colores por estado
 */
export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [detalleSolicitud, setDetalleSolicitud] = useState<Solicitud | null>(null);
  const [solicitudADenegar, setSolicitudADenegar] = useState<Solicitud | null>(null);
  const [motivoDenegacion, setMotivoDenegacion] = useState("");
  const [denegando, setDenegando] = useState(false);

  const fetchSolicitudes = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const filteredSolicitudes = solicitudes.filter((s) => {
    const matchesEstado = filtroEstado === "todos" || s.estado === filtroEstado;
    const matchesBusqueda = busqueda === "" ||
      s.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.plazaNombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchesEstado && matchesBusqueda;
  });

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

  const handleDenegar = async () => {
    if (!solicitudADenegar || !motivoDenegacion.trim()) return;
    setDenegando(true);
    await cambiarEstado(solicitudADenegar.id, "rechazado", motivoDenegacion);
    setSolicitudADenegar(null);
    setMotivoDenegacion("");
    setDenegando(false);
  };

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

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 42, 143);
    doc.text("Reporte de Solicitudes", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

    let startY = 35;
    if (filtroEstado !== "todos" || busqueda) {
      let filtrosTexto = "Filtros aplicados: ";
      if (filtroEstado !== "todos") filtrosTexto += `Estado: ${filtroEstado}`;
      if (busqueda) filtrosTexto += `${filtroEstado !== "todos" ? " | " : ""}Búsqueda: "${busqueda}"`;
      doc.text(filtrosTexto, 14, 34);
      startY = 40;
    }

    const tableData = filteredSolicitudes.map((s) => [
      s.candidato.nombre,
      s.candidato.ci,
      s.plazaNombre,
      s.estado.charAt(0).toUpperCase() + s.estado.slice(1),
      formatFecha(s.creadoEn)
    ]);

    autoTable(doc, {
      startY,
      head: [["Candidato", "CI", "Plaza", "Estado", "Fecha"]],
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
        0: { cellWidth: 45 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total de solicitudes: ${filteredSolicitudes.length}`, 14, finalY);

    doc.save("solicitudes.pdf");
  };

  return {
    solicitudes,
    filteredSolicitudes,
    totalCount: solicitudes.length,
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
  };
}
