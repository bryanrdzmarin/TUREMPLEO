/**
 * middleware.ts - Protege todas las rutas del panel privado.
 * Si el usuario NO tiene un token válido en las cookies, lo redirige a /login.
 * Si tiene token válido, lo deja pasar a la ruta solicitada.
 *
 * No protege rutas públicas: /, /login, /estado, /solicitar, /api/consulta, etc.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Rutas que NO necesitan autenticación
const publicPaths = [
  "/",
  "/login",
  "/estado",
  "/solicitar",
  "/api/consulta",
];

// Prefijos de API que son públicos
const publicApiPrefixes = ["/api/consulta", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso a rutas públicas
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Permitir acceso a APIs públicas
  for (const prefix of publicApiPrefixes) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }

  // Permitir acceso a assets estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar token en cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurar qué rutas protege el middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
