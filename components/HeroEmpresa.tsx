"use client";

import { useState, useRef, useEffect } from "react";

interface Plaza {
  id: number;
  nombre: string;
}

export default function HeroEmpresa({ plazas }: { plazas: Plaza[] }) {
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState<Plaza[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (texto: string) => {
    setQuery(texto);
    if (texto.length > 0) {
      const filtradas = plazas.filter(p => 
        p.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setSugerencias(filtradas);
      setMostrarSugerencias(true);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.length > 0) {
      setMostrarSugerencias(false);
      window.location.href = `/?busqueda=${encodeURIComponent(query)}`;
    }
  };

  return (
    <section className="relative bg-[#002A8F] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Bienvenido a <span className="text-white">TurEmpleo</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-4">
            <strong>TurEmpleo</strong> es el portal oficial de empleo del sector turístico cubano, 
            impulsado por el <span className="text-white font-semibold">Ministerio de Turismo (Mintur)</span>. 
            Conectamos talento humano con las mejores oportunidades en hoteles y establecimientos turísticos de Cuba.
          </p>
          <p className="text-base md:text-lg text-white/80 mb-8">
            Nuestra misión es facilitar el proceso de búsqueda de empleo en el turismo, 
            brindando una plataforma moderna, eficiente y accesible para candidatos y empleadores.
          </p>

          <div className="max-w-xl mx-auto relative" ref={inputRef}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => query.length > 0 && setMostrarSugerencias(true)}
                placeholder="Buscar plaza..."
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#60A5FA] text-base md:text-lg border-2 border-white"
              />
            </div>

            {mostrarSugerencias && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {sugerencias.length > 0 ? (
                  <>
                    {sugerencias.map((plaza) => (
                      <button
                        key={plaza.id}
                        type="button"
                        className="block w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setQuery(plaza.nombre);
                          setMostrarSugerencias(false);
                          window.location.href = `/?busqueda=${encodeURIComponent(plaza.nombre)}`;
                        }}
                      >
                        {plaza.nombre}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    Plaza no encontrada
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
