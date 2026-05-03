/**
 * HeaderActions - Encabezado de la página con el checkbox "Ver inactivas"
 * para mostrar todas las plazas (activas + inactivas), el botón "+ Nueva Plaza"
 * que abre el modal de creación y el botón "Exportar PDF" para generar un
 * reporte de las plazas actualmente visibles (respeta el filtro activo).
 */

import { ExportPDFButton } from "@/components/privada/ui/ExportPDFButton";

interface HeaderActionsProps {
  showInactive: boolean;
  setShowInactive: (value: boolean) => void;
  onNewPlaza: () => void;
  onExportPDF: () => void;
  hasPlazas: boolean;
}

export function HeaderActions({ showInactive, setShowInactive, onNewPlaza, onExportPDF, hasPlazas }: HeaderActionsProps) {
  return (
    <div className="flex gap-3">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
          className="rounded text-[#002A8F]"
        />
        Ver inactivas
      </label>
      <button
        onClick={onNewPlaza}
        className="px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001d6e] transition-colors"
      >
        + Nueva Plaza
      </button>
      <ExportPDFButton
        onExport={onExportPDF}
        disabled={!hasPlazas}
      />
    </div>
  );
}
