import { useState, useEffect, useCallback } from "react";

export interface EstadisticasData {
  cards: {
    totalPlazasActivas: number;
    totalSolicitudes: number;
    totalCandidatos: number;
    citasPendientes: number;
    enReserva: number;
    totalContratados: number;
  };
  solicitudesPorEstado: { estado: string; total: number }[];
  solicitudesPorPlaza: { nombre: string; total: number }[];
  tendenciaMensual: { mes: string; total: number }[];
  distribucionSexo: { sexo: string; total: number }[];
  nivelEscolar: { nivel: string; total: number }[];
}

/**
 * useEstadisticas - Custom hook que obtiene todas las estadísticas agregadas
 * desde el endpoint /api/estadisticas. Devuelve loading state y los datos
 * listos para ser consumidos por los componentes de gráficos y tarjetas.
 */
export function useEstadisticas() {
  const [data, setData] = useState<EstadisticasData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEstadisticas = useCallback(async () => {
    try {
      const res = await fetch("/api/estadisticas");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        console.error("Error fetching estadisticas:", json);
      }
    } catch (error) {
      console.error("Error fetching estadisticas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  return { data, loading, refetch: fetchEstadisticas };
}
