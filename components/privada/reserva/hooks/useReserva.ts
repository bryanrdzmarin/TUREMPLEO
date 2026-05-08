import { useState, useEffect, useCallback } from "react";

interface CandidatoData {
  id: number;
  ci: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
}

interface Evaluacion {
  titulacion: string | null;
  oficios: string | null;
  idiomas: string | null;
  nivel: string | null;
  lugar: string | null;
  cursos: string | null;
  faltantes: string | null;
  licencia: string | null;
  comunitaria: string | null;
  intrabajo: string | null;
  desempeno: string | null;
}

export interface PlazaAprobada {
  solicitudId: number;
  plazaId: number;
  plazaNombre: string;
  fechaEvaluacion: string | null;
  evaluacion: Evaluacion | null;
}

export interface ReservaData {
  candidato: CandidatoData;
  plazasAprobadas: PlazaAprobada[];
}

export type VistaActiva = "reserva" | "citados";

export interface Filtros {
  plaza: string;
  titulacion: string;
  idiomas: string;
  nivel: string;
  licencia: string;
  oficios: string;
  cursos: string;
  comunitaria: string;
  intrabajo: string;
}

const defaultFiltros: Filtros = {
  plaza: "",
  titulacion: "",
  idiomas: "",
  nivel: "",
  licencia: "",
  oficios: "",
  cursos: "",
  comunitaria: "",
  intrabajo: ""
};

/**
 * useReserva - Custom hook que centraliza toda la lógica de gestión de reserva laboral:
 * - Fetch de candidatos aprobados (reserva o citados según vista activa)
 * - Filtros avanzados: plaza, titulación, idiomas, nivel, licencia, oficios, cursos,
 *   averiguación comunitaria e intrabajo
 * - Persistencia de vista activa (reserva/citados) en localStorage
 * - Citación de candidatos en 2 pasos: seleccionar plaza → formulario de cita
 * - Acciones de aprobar/denegar candidatos en vista "citados"
 * - Fetch de plazas únicas para el filtro
 */
export function useReserva() {
  const [reserva, setReserva] = useState<ReservaData[]>([]);
  const [plazas, setPlazas] = useState<{id: number, nombre: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>(defaultFiltros);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<ReservaData | null>(null);
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reservaVistaActiva");
      if (saved === "citados" || saved === "reserva") return saved;
    }
    return "reserva";
  });
  const [modalCitar, setModalCitar] = useState<ReservaData | null>(null);
  const [plazaSeleccionada, setPlazaSeleccionada] = useState<PlazaAprobada | null>(null);
  const [formCitar, setFormCitar] = useState({ fechaCita: "", direccion: "", requisitos: "" });
  const [citando, setCitando] = useState(false);
  const [stepCitar, setStepCitar] = useState<"seleccionar" | "formulario">("seleccionar");

  const handleSetVistaActiva = (vista: VistaActiva) => {
    setReserva([]);
    setVistaActiva(vista);
    localStorage.setItem("reservaVistaActiva", vista);
  };

  const fetchPlazas = useCallback(async () => {
    try {
      const res = await fetch("/api/reserva");
      const data = await res.json();
      const plazasUnicas = new Map<string, {id: number, nombre: string}>();
      data.forEach((candidato: any) => {
        candidato.plazasAprobadas.forEach((plaza: any) => {
          if (!plazasUnicas.has(plaza.plazaNombre)) {
            plazasUnicas.set(plaza.plazaNombre, {
              id: plaza.plazaId,
              nombre: plaza.plazaNombre
            });
          }
        });
      });
      setPlazas(Array.from(plazasUnicas.values()));
    } catch (error) {
      console.error("Error fetching plazas:", error);
    }
  }, []);

  const fetchReserva = useCallback(async () => {
    setReserva([]);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (vistaActiva === "citados") {
        params.append("vista", "citados");
      }
      if (filtros.plaza) params.append("plaza", filtros.plaza);
      if (filtros.titulacion) params.append("titulacion", filtros.titulacion);
      if (filtros.idiomas) params.append("idiomas", filtros.idiomas);
      if (filtros.nivel) params.append("nivel", filtros.nivel);
      if (filtros.licencia) params.append("licencia", filtros.licencia);
      if (filtros.oficios) params.append("oficios", filtros.oficios);
      if (filtros.cursos) params.append("cursos", filtros.cursos);
      if (filtros.comunitaria) params.append("comunitaria", filtros.comunitaria);
      if (filtros.intrabajo) params.append("intrabajo", filtros.intrabajo);

      const res = await fetch(`/api/reserva?${params.toString()}`);
      const data = await res.json();
      setReserva(data);
    } catch (error) {
      console.error("Error fetching reserva:", error);
    } finally {
      setLoading(false);
    }
  }, [vistaActiva, filtros]);

  useEffect(() => {
    fetchPlazas();
    fetchReserva();
  }, [vistaActiva, fetchPlazas, fetchReserva]);

  const aplicarFiltros = () => {
    fetchReserva();
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const openCitarModal = (item: ReservaData) => {
    setModalCitar(item);
    setStepCitar("seleccionar");
    setPlazaSeleccionada(null);
    setFormCitar({ fechaCita: "", direccion: "", requisitos: "" });
  };

  const selectPlaza = (plaza: PlazaAprobada) => {
    setPlazaSeleccionada(plaza);
    setStepCitar("formulario");
  };

  const closeCitarModal = () => {
    setModalCitar(null);
    setPlazaSeleccionada(null);
    setFormCitar({ fechaCita: "", direccion: "", requisitos: "" });
    setStepCitar("seleccionar");
  };

  const submitCitar = async () => {
    if (!modalCitar || !plazaSeleccionada) return;
    if (!formCitar.fechaCita || !formCitar.direccion || !formCitar.requisitos) return;

    setCitando(true);
    try {
      const res = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: plazaSeleccionada.solicitudId,
          email: modalCitar.candidato.email,
          nombre: modalCitar.candidato.nombre,
          plazaNombre: plazaSeleccionada.plazaNombre,
          fechaCita: formCitar.fechaCita,
          direccion: formCitar.direccion,
          requisitos: formCitar.requisitos
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al enviar la cita");
        return false;
      }
      alert("Cita enviada exitosamente");
      closeCitarModal();
      fetchReserva();
      return true;
    } catch (error) {
      console.error("Error sending cita:", error);
      alert("Error al enviar la cita");
      return false;
    } finally {
      setCitando(false);
    }
  };

  const handleDenegar = async (candidatoId: number) => {
    if (!confirm("¿Está seguro de marcar como denegado?")) return;
    try {
      const res = await fetch("/api/reserva", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatoId, accion: "denegar" })
      });
      if (res.ok) {
        alert("Candidato devuelto a la reserva");
        fetchReserva();
        fetchPlazas();
      }
    } catch (error) {
      console.error("Error denegando:", error);
    }
  };

  const handleAprobar = async (candidatoId: number) => {
    if (!confirm("¿Está seguro de marcar como aprobado? Se archivarán todas las solicitudes del candidato.")) return;
    try {
      const res = await fetch("/api/reserva", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatoId, accion: "aprobar" })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.plazasDesbloqueadas && data.plazasDesbloqueadas.length > 0) {
          alert(`${data.message}. Plazas desbloqueadas: ${data.plazasDesbloqueadas.length}`);
        } else {
          alert(data.message);
        }
        fetchReserva();
        fetchPlazas();
      } else {
        alert(data.error || "Error al aprobar");
      }
    } catch (error) {
      console.error("Error aprobando:", error);
    }
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 42, 143);
    doc.text("Reporte de Reserva Laboral", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

    let startY = 35;
    doc.text(`Vista: ${vistaActiva === "reserva" ? "Reserva" : "Citados"}`, 14, 34);

    if (vistaActiva === "reserva") {
      const filtrosActivos: string[] = [];
      if (filtros.plaza) filtrosActivos.push(`Plaza: ${filtros.plaza}`);
      if (filtros.titulacion) filtrosActivos.push(`Titulación: ${filtros.titulacion}`);
      if (filtros.idiomas) filtrosActivos.push(`Idiomas: ${filtros.idiomas}`);
      if (filtros.nivel) filtrosActivos.push(`Nivel: ${filtros.nivel}`);
      if (filtros.licencia) filtrosActivos.push(`Licencia: ${filtros.licencia}`);
      if (filtros.oficios) filtrosActivos.push(`Oficios: ${filtros.oficios}`);
      if (filtros.cursos) filtrosActivos.push(`Cursos: ${filtros.cursos}`);
      if (filtros.comunitaria) filtrosActivos.push(`Comunitaria: ${filtros.comunitaria}`);
      if (filtros.intrabajo) filtrosActivos.push(`Intrabajo: ${filtros.intrabajo}`);

      if (filtrosActivos.length > 0) {
        filtrosActivos.forEach((filtro, idx) => {
          doc.text(filtro, 14, 40 + idx * 6);
        });
        startY = 40 + filtrosActivos.length * 6 + 4;
      } else {
        startY = 40;
      }
    }

    const tableData = reserva.flatMap((item) =>
      item.plazasAprobadas.map((plaza) => [
        item.candidato.ci,
        item.candidato.nombre,
        plaza.plazaNombre
      ])
    );

    autoTable(doc, {
      startY,
      head: [["CI", "Nombre", "Plaza(s)"]],
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
        1: { cellWidth: 70 },
        2: { cellWidth: 60 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total de candidatos: ${reserva.length}`, 14, finalY);

    doc.save("reserva.pdf");
  };

  return {
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
    setPlazaSeleccionada,
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
  };
}
