"use client";

import { useState } from "react";
import Link from "next/link";

interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
  funciones: string;
  activo: boolean;
}

const getIconoPlaza = (nombre: string) => {
  const nombreLower = nombre.toLowerCase();
  
  if (nombreLower.includes("mantenimiento") || nombreLower.includes("electricista") || nombreLower.includes("mecánico") || nombreLower.includes("climatización") || nombreLower.includes("refrigeración")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <path d="M40 24L28 36L32 40L44 28" stroke="#002A8F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="40" r="4" fill="#60A5FA"/>
        <circle cx="40" cy="24" r="4" fill="#60A5FA"/>
      </svg>
    );
  }
  
  if (nombreLower.includes("cocinero") || nombreLower.includes("cocina")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <path d="M20 40C20 36 24 32 32 32C40 32 44 36 44 40" stroke="#002A8F" strokeWidth="3" strokeLinecap="round"/>
        <rect x="18" y="28" width="28" height="12" rx="2" fill="#60A5FA"/>
        <circle cx="32" cy="34" r="4" fill="#002A8F"/>
      </svg>
    );
  }
  
  if (nombreLower.includes("auxiliar") || nombreLower.includes("servicio") || nombreLower.includes("sereno") || nombreLower.includes("limpieza")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <path d="M32 20V44M20 32H44" stroke="#002A8F" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24 24L40 40M40 24L24 40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  
  if (nombreLower.includes("contador") || nombreLower.includes("secretaria") || nombreLower.includes("técnico") || nombreLower.includes("especialista") || nombreLower.includes("asesor") || nombreLower.includes("gestión") || nombreLower.includes("balance")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <rect x="16" y="20" width="32" height="24" rx="2" stroke="#002A8F" strokeWidth="3"/>
        <line x1="16" y1="30" x2="48" y2="30" stroke="#60A5FA" strokeWidth="2"/>
        <line x1="24" y1="36" x2="40" y2="36" stroke="#002A8F" strokeWidth="2"/>
        <line x1="24" y1="40" x2="36" y2="40" stroke="#60A5FA" strokeWidth="2"/>
      </svg>
    );
  }
  
  if (nombreLower.includes("jardinero") || nombreLower.includes("jardín")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <path d="M32 44V24" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="20" r="8" fill="#22c55e"/>
        <circle cx="24" cy="28" r="6" fill="#22c55e"/>
        <circle cx="40" cy="28" r="6" fill="#22c55e"/>
      </svg>
    );
  }
  
  if (nombreLower.includes("coordinador") || nombreLower.includes("dependiente") || nombreLower.includes("transportador")) {
    return (
      <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
        <rect x="20" y="24" width="24" height="16" rx="2" fill="#60A5FA"/>
        <circle cx="32" cy="18" r="4" fill="#002A8F"/>
        <path d="M16 40H48" stroke="#002A8F" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="24" cy="44" r="3" fill="#60A5FA"/>
        <circle cx="40" cy="44" r="3" fill="#60A5FA"/>
      </svg>
    );
  }
  
  return (
    <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#002A8F" fillOpacity="0.1"/>
      <circle cx="32" cy="24" r="8" fill="#60A5FA"/>
      <path d="M20 46C20 38 25 32 32 32C39 32 44 38 44 46" stroke="#002A8F" strokeWidth="3"/>
    </svg>
  );
};

function PlazaCard({ plaza, onVerMas }: { plaza: Plaza; onVerMas: (plaza: Plaza) => void }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col items-center text-center group hover:-translate-y-1 h-full min-h-[200px]">
      <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
        {getIconoPlaza(plaza.nombre)}
      </div>
      <h3 className="font-semibold text-[#002A8F] mb-4 text-sm min-h-[2.5rem] flex items-center justify-center">
        {plaza.nombre}
      </h3>
      <div className="flex gap-2 mt-auto w-full">
        <button 
          onClick={() => onVerMas(plaza)}
          className="flex-1 px-3 py-2 text-xs font-medium text-[#002A8F] bg-blue-50 hover:bg-[#002A8F] hover:text-white rounded-lg transition-all duration-300"
        >
          Ver más
        </button>
        <Link 
          href={`/solicitar?id=${plaza.id}`}
          className="flex-1 px-3 py-2 text-xs font-medium text-[#002A8F] bg-blue-50 hover:bg-[#002A8F] hover:text-white rounded-lg transition-all duration-300 text-center"
        >
          Solicitar
        </Link>
      </div>
    </div>
  );
}

function ModalPlaza({ plaza, onClose }: { plaza: Plaza; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002A8F] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-center">{plaza.nombre}</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-[#002A8F] text-lg mb-2 border-b-2 border-[#002A8F] inline-block pb-1">
              Requisitos
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{plaza.requisitos}</p>
          </div>
          <div>
            <h3 className="font-bold text-[#002A8F] text-lg mb-2 border-b-2 border-[#002A8F] inline-block pb-1">
              Funciones
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{plaza.funciones}</p>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-4">
          <Link 
            href={`/solicitar?id=${plaza.id}`}
            className="flex-1 px-6 py-3 text-center text-white font-semibold bg-[#002A8F] hover:bg-[#003a99] rounded-lg transition-colors"
          >
            Solicitar esta Plaza
          </Link>
          <button 
            onClick={onClose}
            className="px-6 py-3 text-[#002A8F] font-semibold border-2 border-[#002A8F] hover:bg-blue-50 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlazaSection({ plazas, busquedaInicial }: { plazas: Plaza[]; busquedaInicial?: string }) {
  const [paginaActual, setPaginaActual] = useState(0);
  const [plazaSeleccionada, setPlazaSeleccionada] = useState<Plaza | null>(null);
  const [busqueda, setBusqueda] = useState(busquedaInicial || "");
  
  const plazasFiltradas = busqueda 
    ? plazas.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : plazas;
  
  const plazasPorPagina = 12;
  const totalPaginas = Math.ceil(plazasFiltradas.length / plazasPorPagina);
  const inicio = paginaActual * plazasPorPagina;
  const plazasPagina = plazasFiltradas.slice(inicio, inicio + plazasPorPagina);

  const paginaAnterior = () => {
    if (paginaActual > 0) setPaginaActual(paginaActual - 1);
  };

  const siguientePagina = () => {
    if (paginaActual < totalPaginas - 1) setPaginaActual(paginaActual + 1);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setPaginaActual(0);
    window.location.href = "/#plazas";
  };

  if (plazasFiltradas.length === 0) {
    return (
      <section id="plazas" className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002A8F] mb-3">
            Plazas
          </h2>
          <p className="text-gray-500">No se encontraron plazas.</p>
          {busqueda && (
            <button 
              onClick={limpiarBusqueda}
              className="mt-4 px-4 py-2 text-[#002A8F] hover:underline"
            >
              ← Volver a todas las plazas
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="plazas" className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          {busqueda ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#002A8F]">
                Resultados para: "{busqueda}"
              </h2>
              <button 
                onClick={limpiarBusqueda}
                className="text-sm text-[#002A8F] hover:underline flex items-center gap-1"
              >
                ← Ver todas las plazas
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#002A8F] mb-3">
                Plazas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Únete a nuestra reserva laboral
              </p>
            </>
          )}
        </div>
        
        <div className="relative mx-4">
          {totalPaginas > 1 && (
            <button 
              onClick={paginaAnterior}
              disabled={paginaActual === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 rounded-full bg-[#002A8F] text-white flex items-center justify-center shadow-lg hover:bg-[#003a99] transition-colors ${paginaActual === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {plazasPagina.map((plaza) => (
              <PlazaCard 
                key={plaza.id} 
                plaza={plaza} 
                onVerMas={setPlazaSeleccionada}
              />
            ))}
          </div>

          {totalPaginas > 1 && (
            <button 
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 rounded-full bg-[#002A8F] text-white flex items-center justify-center shadow-lg hover:bg-[#003a99] transition-colors ${paginaActual === totalPaginas - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPaginas }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaActual(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === paginaActual ? 'bg-[#002A8F]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Mostrando {inicio + 1}-{Math.min(inicio + plazasPorPagina, plazas.length)} de {plazas.length} plazas
        </p>
      </div>

      {plazaSeleccionada && (
        <ModalPlaza 
          plaza={plazaSeleccionada} 
          onClose={() => setPlazaSeleccionada(null)} 
        />
      )}
    </section>
  );
}
