/**
 * VistaTabs - Botones de navegación para alternar entre la vista "Reserva"
 * (candidatos aprobados sin citar) y "Citados" (candidatos ya citados).
 * Persiste la selección en localStorage para mantenerla entre recargas.
 */

import { VistaActiva } from "./hooks/useReserva";

interface VistaTabsProps {
  vistaActiva: VistaActiva;
  setVista: (vista: VistaActiva) => void;
}

export function VistaTabs({ vistaActiva, setVista }: VistaTabsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setVista("reserva")}
        className={`px-4 py-2 rounded-lg font-medium ${vistaActiva === "reserva" ? "bg-[#002A8F] text-white" : "bg-gray-100 text-gray-700"}`}
      >
        Reserva
      </button>
      <button
        onClick={() => setVista("citados")}
        className={`px-4 py-2 rounded-lg font-medium ${vistaActiva === "citados" ? "bg-[#002A8F] text-white" : "bg-gray-100 text-gray-700"}`}
      >
        Citados
      </button>
    </div>
  );
}
