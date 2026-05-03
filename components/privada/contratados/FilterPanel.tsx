/**
 * FilterPanel - Panel de filtros para buscar contratados por rango de fechas
 * (fecha desde/hasta) y plaza. Incluye botón "Buscar" que refetch los datos
 * con los filtros aplicados y botón "Limpiar" que resetea todos los filtros.
 */

interface FilterPanelProps {
  fechaDesde: string;
  setFechaDesde: (value: string) => void;
  fechaHasta: string;
  setFechaHasta: (value: string) => void;
  filtroPlaza: string;
  setFiltroPlaza: (value: string) => void;
  plazas: string[];
  onBuscar: () => void;
  onLimpiar: () => void;
  tieneFiltros: boolean;
}

export function FilterPanel({
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  filtroPlaza,
  setFiltroPlaza,
  plazas,
  onBuscar,
  onLimpiar,
  tieneFiltros,
}: FilterPanelProps) {
  return (
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
          onClick={onBuscar}
          className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors"
        >
          Buscar
        </button>
        <button
          onClick={onLimpiar}
          disabled={!tieneFiltros}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
