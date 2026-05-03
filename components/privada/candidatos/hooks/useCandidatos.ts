import { useState, useEffect, useCallback } from "react";

interface Cita {
  id: number;
  fechaCita: string;
  requisitos: string;
  direccion: string;
}

export interface Candidato {
  id: number;
  estado: string;
  citado: boolean;
  entrevistaPasada: boolean | null;
  candidato: {
    ci: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
  };
  plazaNombre: string;
  plaza: {
    requisitos: string;
  };
  cita: Cita | null;
}

interface InfoFormData {
  titulacion: string;
  oficios: string;
  idiomas: string;
  idioma: string;
  nivel: string;
  lugar: string;
  cursos: string;
  faltantes: string;
  licencia: string;
  comunitaria: string;
  intrabajo: string;
  desempeno: string;
}

type TabType = "pendientes" | "citados" | "aprobados" | "rechazados";

const emptyInfoFormData: InfoFormData = {
  titulacion: "",
  oficios: "",
  idiomas: "",
  idioma: "",
  nivel: "",
  lugar: "",
  cursos: "",
  faltantes: "",
  licencia: "",
  comunitaria: "",
  intrabajo: "",
  desempeno: ""
};

/**
 * useCandidatos - Custom hook que centraliza toda la lógica de gestión de candidatos:
 * - Fetch inicial de candidatos por estado (pendientes, citados, aprobados, rechazados)
 * - Filtrado por búsqueda de nombre, CI o plaza
 * - Apertura/cierre de modales (cita e info form)
 * - Handlers para aprobar/rechazar candidatos y guardar información
 * - Estados de loading, enviando, saving y errores
 */
export function useCandidatos() {
  const [pendientes, setPendientes] = useState<Candidato[]>([]);
  const [citados, setCitados] = useState<Candidato[]>([]);
  const [aprobados, setAprobados] = useState<Candidato[]>([]);
  const [rechazados, setRechazados] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("pendientes");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fechaCita: "",
    requisitos: "",
    direccion: ""
  });
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoFormData, setInfoFormData] = useState<InfoFormData>(emptyInfoFormData);
  const [savingInfo, setSavingInfo] = useState(false);

  const fetchCandidatos = useCallback(async () => {
    try {
      const [pendRes, citRes, aprobRes, rechRes] = await Promise.all([
        fetch("/api/candidatos?citado=false"),
        fetch("/api/candidatos?citado=true"),
        fetch("/api/candidatos?entrevistaPasada=true"),
        fetch("/api/candidatos?entrevistaPasada=false")
      ]);

      const pendData = await pendRes.json();
      const citData = await citRes.json();
      const aprobData = await aprobRes.json();
      const rechData = await rechRes.json();

      setPendientes(Array.isArray(pendData) ? pendData : []);
      setCitados(Array.isArray(citData) ? citData : []);
      setAprobados(Array.isArray(aprobData) ? aprobData : []);
      setRechazados(Array.isArray(rechData) ? rechData : []);
    } catch (error) {
      console.error("Error fetching candidatos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidatos();
  }, [fetchCandidatos]);

  const filterByBusqueda = (list: Candidato[]) =>
    list.filter(
      (c) =>
        busqueda === "" ||
        c.candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.candidato.ci.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.plazaNombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  const filteredPendientes = filterByBusqueda(pendientes);
  const filteredCitados = filterByBusqueda(citados);
  const filteredAprobados = filterByBusqueda(aprobados);
  const filteredRechazados = filterByBusqueda(rechazados);

  const getFilteredList = () => {
    switch (tab) {
      case "pendientes": return filteredPendientes;
      case "citados": return filteredCitados;
      case "aprobados": return filteredAprobados;
      case "rechazados": return filteredRechazados;
    }
  };

  const getTotal = () => getFilteredList().length;
  const getTotalAll = () => {
    switch (tab) {
      case "pendientes": return pendientes.length;
      case "citados": return citados.length;
      case "aprobados": return aprobados.length;
      case "rechazados": return rechazados.length;
    }
  };

  const abrirModal = (candidato: Candidato) => {
    setCandidatoSeleccionado(candidato);
    setError(null);

    if (candidato.cita) {
      setFormData({
        fechaCita: candidato.cita.fechaCita,
        requisitos: candidato.cita.requisitos,
        direccion: candidato.cita.direccion
      });
    } else {
      setFormData({
        fechaCita: "",
        requisitos: candidato.plaza.requisitos,
        direccion: ""
      });
    }

    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setCandidatoSeleccionado(null);
    setError(null);
  };

  const handleSubmitCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatoSeleccionado) return;

    setEnviando(true);
    setError(null);

    try {
      const url = "/api/citas";
      const method = candidatoSeleccionado.citado ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: candidatoSeleccionado.id,
          fechaCita: formData.fechaCita,
          requisitos: formData.requisitos,
          direccion: formData.direccion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar la cita");
        return;
      }

      cerrarModal();
      fetchCandidatos();
    } catch (err) {
      setError("Error al enviar la cita");
    } finally {
      setEnviando(false);
    }
  };

  const openInfoForm = (candidato: Candidato) => {
    setCandidatoSeleccionado(candidato);
    setShowInfoForm(true);
    setInfoFormData({ ...emptyInfoFormData });
  };

  const closeInfoForm = () => {
    setShowInfoForm(false);
    setCandidatoSeleccionado(null);
  };

  const guardarInfoYCambiarEstado = async (aprobado: boolean) => {
    if (!candidatoSeleccionado) return;

    setSavingInfo(true);
    setError(null);

    try {
      const resCheck = await fetch(`/api/informacion-can?solicitudId=${candidatoSeleccionado.id}`);

      let informacionId: number | null = null;

      if (resCheck.ok) {
        const existingData = await resCheck.json();
        informacionId = existingData.id;

        const resUpdate = await fetch(`/api/informacion-can?id=${informacionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...infoFormData })
        });

        if (!resUpdate.ok) {
          const errorData = await resUpdate.json();
          setError(errorData.error || "Error al actualizar información");
          setSavingInfo(false);
          return;
        }
      } else {
        const resCreate = await fetch("/api/informacion-can", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...infoFormData,
            solicitudId: candidatoSeleccionado.id
          })
        });

        if (!resCreate.ok) {
          const errorData = await resCreate.json();
          setError(errorData.error || "Error al guardar información");
          setSavingInfo(false);
          return;
        }
      }

      setShowInfoForm(false);

      setEnviando(true);
      const resEstado = await fetch("/api/candidatos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: candidatoSeleccionado.id,
          entrevistaPasada: aprobado
        })
      });

      if (resEstado.ok) {
        fetchCandidatos();
        setTab(aprobado ? "aprobados" : "rechazados");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setSavingInfo(false);
      setEnviando(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 42, 143);
    doc.text("Reporte de Candidatos", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

    const tabLabels: Record<TabType, string> = {
      pendientes: "Pendientes a Citar",
      citados: "Citados",
      aprobados: "Aprobados",
      rechazados: "Rechazados"
    };

    let startY = 35;
    doc.text(`Categoría: ${tabLabels[tab]}`, 14, 34);
    if (busqueda) {
      doc.text(`Búsqueda: "${busqueda}"`, 14, 40);
      startY = 46;
    }

    const listaActual = getFilteredList();
    const tableData = listaActual.map((c) => [
      c.candidato.ci,
      c.candidato.nombre,
      c.candidato.telefono || "-",
      c.plazaNombre
    ]);

    autoTable(doc, {
      startY,
      head: [["CI", "Nombre", "Teléfono", "Plaza"]],
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
        2: { cellWidth: 30 },
        3: { cellWidth: 55 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total de candidatos: ${listaActual.length}`, 14, finalY);

    doc.save("candidatos.pdf");
  };

  return {
    candidatos: { pendientes, citados, aprobados, rechazados },
    filtered: { filteredPendientes, filteredCitados, filteredAprobados, filteredRechazados },
    loading,
    tab,
    setTab,
    busqueda,
    setBusqueda,
    getFilteredList,
    getTotal,
    getTotalAll,
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
  };
}

export type { TabType, InfoFormData };
