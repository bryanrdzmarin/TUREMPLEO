/**
 * EstadoTabs - Botones de filtro por estado de solicitud: Todas, Pendientes,
 * Aprobados y Rechazados. Resalta el tab activo con el color de la marca.
 */

const estados = [
  { value: "todos", label: "Todas" },
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobado", label: "Aprobados" },
  { value: "rechazado", label: "Rechazados" },
];

interface EstadoTabsProps {
  filtroEstado: string;
  setFiltroEstado: (value: string) => void;
}

export function EstadoTabs({ filtroEstado, setFiltroEstado }: EstadoTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {estados.map((e) => (
        <button
          key={e.value}
          onClick={() => setFiltroEstado(e.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroEstado === e.value
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}
