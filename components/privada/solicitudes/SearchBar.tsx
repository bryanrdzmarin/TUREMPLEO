/**
 * SearchBar - Barra de búsqueda que filtra solicitudes por nombre del candidato,
 * CI o nombre de la plaza. Actualiza el estado de búsqueda en tiempo real.
 */

interface SearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function SearchBar({ busqueda, setBusqueda }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre, CI o plaza..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent text-sm w-full md:w-64"
    />
  );
}
