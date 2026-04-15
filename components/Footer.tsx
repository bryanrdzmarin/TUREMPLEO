"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-gradient-to-r from-[#002A8F] to-[#003a99] text-white mt-auto shadow-[0_-4px_20px_rgba(0,42,143,0.2)]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/tur-empleo.jpeg"
                  alt="TurEmpleo"
                  fill
                  className="object-contain rounded-lg shadow-md bg-white p-0.5"
                />
              </div>
              <span className="text-lg font-bold">TurEmpleo</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs md:text-sm text-center md:text-left">
            <div className="space-y-1">
              <h4 className="font-bold text-sm border-b border-[#3B82F6] inline-block pb-0.5">
                Contenido
              </h4>
              <div className="flex flex-col gap-0.5 opacity-90">
                <button 
                  onClick={() => window.location.href = "/#plazas"}
                  className="text-left hover:text-[#60A5FA] transition-colors duration-200"
                >
                   Plazas
                </button>
                <Link href="/estado" className="hover:text-[#60A5FA] transition-colors duration-200">
                  Consultar Estado de Solicitud
                </Link>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-bold text-sm border-b border-[#3B82F6] inline-block pb-0.5">
                Contacto
              </h4>
              <div className="flex flex-col gap-0.5 opacity-90">
                <p>Calle Principal #123, La Habana</p>
                <p>contacto@turempleo.cu</p>
                <p>+53 7 1234567 / +53 5 9876543</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-4 pt-3 text-center">
          <p className="text-xs opacity-70">
            © {currentYear} <span className="font-semibold text-[#60A5FA]">TurEmpleo</span>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
