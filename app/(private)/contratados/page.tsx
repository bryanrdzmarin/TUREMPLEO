"use client";

import { useState, useEffect } from "react";

interface ContratadoData {
  candidato: {
    id: number;
    ci: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
  };
  plazas: {
    plazaNombre: string;
    fechaContratacion: string | Date;
  }[];
  fechaContratacion: string | Date;
}

export default function ContratadosPage() {
  const [contratados, setContratados] = useState<ContratadoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [plazas, setPlazas] = useState<string[]>([]);
  const [filtroPlaza, setFiltroPlaza] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const fetchContratados = async () => {
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
  };

  useEffect(() => {
    fetchContratados();
  }, [filtroPlaza, fechaDesde, fechaHasta]);

  const limpiarFiltros = () => {
    setFiltroPlaza("");
    setFechaDesde("");
    setFechaHasta("");
  };

  const formatFecha = (fecha: string | Date | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const tieneFiltros = filtroPlaza || fechaDesde || fechaHasta;

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
    }
    
    const startY = tieneFiltros ? 40 : 35;
    
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#002A8F]">Personal Contratado</h1>
          <button
            onClick={exportToPDF}
            disabled={contratados.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaza</label>
            <select
              value={filtroPlaza}
              onChange={(e) => setFiltroPlaza(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            >
              <option value="">Todas las plazas</option>
              {plazas.map((plaza) => (
                <option key={plaza} value={plaza}>{plaza}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={fetchContratados}
              className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={limpiarFiltros}
              disabled={!tieneFiltros}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CI</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plaza(s)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Contratación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : contratados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hay candidatos contratados
                  </td>
                </tr>
              ) : (
                contratados.map((item) => (
                  <tr key={item.candidato.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{item.candidato.ci}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.candidato.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {item.plazas.map((plaza, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {plaza.plazaNombre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatFecha(item.fechaContratacion)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}