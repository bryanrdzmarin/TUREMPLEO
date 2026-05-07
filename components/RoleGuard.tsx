"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRequiredRoles } from "@/lib/routeRoles";

interface RoleGuardProps {
  children: ReactNode;
  userRole: string | undefined;
}

export default function RoleGuard({ children, userRole }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!userRole) return;

    const requiredRoles = getRequiredRoles(pathname);

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      router.push("/plazas");
    }
  }, [userRole, pathname, router]);

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles && !requiredRoles.includes(userRole || "")) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Acceso denegado
          </h1>
          <p className="text-gray-500 mb-6">
            No tienes permisos para ver esta página.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Redirigiendo a /plazas...
          </p>
          <button
            onClick={() => router.push("/plazas")}
            className="px-6 py-3 bg-[#002A8F] text-white rounded-lg hover:bg-[#001F5C] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
