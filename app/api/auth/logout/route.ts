/**
 * POST /api/auth/logout - Elimina la cookie de token para cerrar sesión.
 * No requiere autenticación previa (simplemente borra la cookie).
 */

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });

  return response;
}
