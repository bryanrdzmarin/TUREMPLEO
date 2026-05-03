/**
 * InformacionPage - Dashboard de estadísticas que muestra información visual
 * del sistema: tarjetas resumen con contadores principales y gráficos de
 * barras, líneas y dona para análisis de solicitudes, candidatos y plazas.
 */

"use client";

import "@/components/privada/informacion/ChartRegistration";
import { useEstadisticas } from "@/components/privada/informacion/hooks/useEstadisticas";
import { CardsResumen } from "@/components/privada/informacion/CardsResumen";
import { ChartSolicitudesEstado } from "@/components/privada/informacion/ChartSolicitudesEstado";
import { ChartSolicitudesPlaza } from "@/components/privada/informacion/ChartSolicitudesPlaza";
import { ChartTendenciaMensual } from "@/components/privada/informacion/ChartTendenciaMensual";
import { ChartSexo } from "@/components/privada/informacion/ChartSexo";
import { ChartNivelEscolar } from "@/components/privada/informacion/ChartNivelEscolar";

export default function InformacionPage() {
  const { data, loading } = useEstadisticas();

  if (loading) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Cargando estadísticas...</span></div>;
  }

  if (!data) {
    return <div className="flex justify-center p-8"><span className="text-gray-500">Error al cargar las estadísticas</span></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Información Estadística</h1>

      <CardsResumen cards={data.cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSolicitudesEstado data={data.solicitudesPorEstado} />
        <ChartSolicitudesPlaza data={data.solicitudesPorPlaza} />
        <ChartTendenciaMensual data={data.tendenciaMensual} />
        <ChartSexo data={data.distribucionSexo} />
        <ChartNivelEscolar data={data.nivelEscolar} />
      </div>
    </div>
  );
}
