"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#002A8F] text-white sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,42,143,0.3)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image
              src="/tur-empleo.jpeg"
              alt="TurEmpleo"
              fill
              className="object-contain rounded-lg shadow-lg bg-white p-0.5"
            />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#60A5FA] transition-colors duration-300 drop-shadow-md">
            TurEmpleo
          </span>
        </button>
        
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto flex-col md:flex-row items-center gap-4 md:gap-6 bg-[#002A8F] md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}>
          <button 
            onClick={() => {
              setMenuOpen(false);
              window.location.href = "/?t=" + Date.now() + "#plazas";
            }}
            className="px-3 py-2 text-base font-medium hover:text-[#60A5FA] transition-all duration-300 relative group text-left"
          >
             Plazas
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#60A5FA] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <Link 
            href="/estado"
            className="px-3 py-2 text-base font-medium hover:text-[#60A5FA] transition-all duration-300 relative group"
            onClick={() => setMenuOpen(false)}
          >
            Consultar Estado
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#60A5FA] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
