"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/plazas", label: "Plazas" },
  { href: "/solicitudes", label: "Solicitudes" },
  { href: "/candidatos", label: "Candidatos" },
  { href: "/reserva", label: "Reserva" },
  { href: "/contratados", label: "Contratados" },
];

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#002A8F] text-white transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:h-screen md:overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold">TurEmpleo</h2>
            <p className="text-sm text-white/70">Panel Admin</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              className="w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-semibold text-gray-800">TurEmpleo</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}