/**
 * FilterPanel - Panel de 8 filtros para buscar candidatos en la reserva laboral.
 * Incluye: Plaza (select), Titulación (select), Idiomas (texto búsqueda), Nivel (select),
 * Licencia (select), Oficios (texto búsqueda), Cursos (texto búsqueda),
 * Averiguación comunitaria (select) y Averiguación centros de trabajo (select).
 * El botón "Aplicar Filtros" ejecuta el fetch con todos los parámetros.
 */

import { Filtros } from "./hooks/useReserva";

interface FilterPanelProps {
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
  plazas: {id: number, nombre: string}[];
  onAplicar: () => void;
}

const titulaciones = ["Secundaria", "Técnico Medio", "Preuniversitario", "Universitario"];
const niveles = ["básico", "medio", "avanzado", "nativo"];
const licencias = ["A", "A1", "B", "C1", "C", "D1", "D", "E", "F", "FE"];
const resultados = ["aprobado", "rechazado", "pendiente"];

export function FilterPanel({ filtros, setFiltros, plazas, onAplicar }: FilterPanelProps) {
  const update = (field: keyof Filtros, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plaza</label>
          <select
            value={filtros.plaza}
            onChange={(e) => update("plaza", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todas las plazas</option>
            {plazas.map((plaza) => (
              <option key={plaza.id} value={plaza.nombre}>{plaza.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titulación</label>
          <select
            value={filtros.titulacion}
            onChange={(e) => update("titulacion", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todas</option>
            {titulaciones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas (buscar)</label>
          <input
            type="text"
            value={filtros.idiomas}
            onChange={(e) => update("idiomas", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            placeholder="Buscar en idiomas..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Idiomas</label>
          <select
            value={filtros.nivel}
            onChange={(e) => update("nivel", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todos</option>
            {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
          <select
            value={filtros.licencia}
            onChange={(e) => update("licencia", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todas</option>
            {licencias.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Oficios (buscar)</label>
          <input
            type="text"
            value={filtros.oficios}
            onChange={(e) => update("oficios", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            placeholder="Buscar en oficios..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cursos (buscar)</label>
          <input
            type="text"
            value={filtros.cursos}
            onChange={(e) => update("cursos", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
            placeholder="Buscar en cursos..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resultado averiguación comunidad</label>
          <select
            value={filtros.comunitaria}
            onChange={(e) => update("comunitaria", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todos</option>
            {resultados.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resultado centros trabajo</label>
          <select
            value={filtros.intrabajo}
            onChange={(e) => update("intrabajo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent"
          >
            <option value="">Todos</option>
            {resultados.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={onAplicar}
        className="px-6 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors"
      >
        Aplicar Filtros
      </button>
    </>
  );
}
