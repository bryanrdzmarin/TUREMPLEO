/**
 * routeRoles.ts - Mapeo de rutas privadas a roles permitidos.
 * Define qué roles pueden acceder a cada página del panel.
 *
 * Se usa en RoleGuard para bloquear acceso directo a rutas restringidas.
 */

export const routeRoleMap: Record<string, string[]> = {
  "/plazas": ["admin", "reclutador"],
  "/solicitudes": ["admin", "reclutador"],
  "/candidatos": ["admin", "reclutador"],
  "/reserva": ["admin", "reclutador"],
  "/contratados": ["admin", "reclutador"],
  "/informacion": ["admin", "reclutador"],
  "/admin/usuarios": ["admin"],
  "/admin/auditoria": ["admin"],
};

export function getRequiredRoles(pathname: string): string[] | undefined {
  if (routeRoleMap[pathname]) {
    return routeRoleMap[pathname];
  }

  for (const [route, roles] of Object.entries(routeRoleMap)) {
    if (pathname.startsWith(route + "/")) {
      return roles;
    }
  }

  return undefined;
}
