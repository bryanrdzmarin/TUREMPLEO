/**
 * auth.ts - Funciones de autenticación compatibles con Edge Runtime.
 * Usa solo la librería 'jose' para JWT (no bcryptjs).
 * Este archivo SÍ puede ser importado desde middleware.ts.
 */

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_change_me"
);

export interface JwtPayload {
  userId: number;
  email: string;
  nombreUsuario: string;
  rol: string;
}

/**
 * generateToken - Crea un JWT firmado con la información del usuario.
 * El token expira en 8 horas por defecto.
 */
export async function generateToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    nombreUsuario: payload.nombreUsuario,
    rol: payload.rol,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

/**
 * verifyToken - Verifica la firma de un JWT y devuelve el payload.
 * Retorna null si el token es inválido o expiró.
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      nombreUsuario: payload.nombreUsuario as string,
      rol: payload.rol as string,
    };
  } catch {
    return null;
  }
}

/**
 * getUserFromRequest - Extrae el usuario autenticado desde las cookies de una request.
 * Busca la cookie "token", la verifica y devuelve el payload o null si no es válido.
 */
export async function getUserFromRequest(request: Request): Promise<JwtPayload | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  const token = cookies["token"];
  if (!token) return null;

  return verifyToken(token);
}
