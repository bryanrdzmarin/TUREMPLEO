/**
 * TabButtons - Renderiza los botones de navegación para filtrar candidatos por estado:
 * Pendientes a Citar, Citados, Aprobados y Rechazados. Muestra el contador de cada
 * categoría y resalta el tab activo con el color de la marca.
 */

type TabType = "pendientes" | "citados" | "aprobados" | "rechazados";

interface TabButtonsProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
  counts: {
    pendientes: number;
    citados: number;
    aprobados: number;
    rechazados: number;
  };
}

const tabs: { key: TabType; label: string }[] = [
  { key: "pendientes", label: "Pendientes a Citar" },
  { key: "citados", label: "Citados" },
  { key: "aprobados", label: "Aprobados" },
  { key: "rechazados", label: "Rechazados" },
];

export function TabButtons({ tab, setTab, counts }: TabButtonsProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === key
              ? "bg-[#002A8F] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {label} ({counts[key]})
        </button>
      ))}
    </div>
  );
}
