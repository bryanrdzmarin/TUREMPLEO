/**
 * auth-server.ts - Funciones de autenticación que requieren Node.js.
 * Usa bcryptjs que NO es compatible con Edge Runtime.
 * SOLO importar en API routes y scripts (nunca en middleware.ts).
 */

import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 10;

/**
 * hashPassword - Encripta una contraseña en texto plano usando bcrypt.
 * El hash resultante se almacena en la base de datos (nunca texto plano).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * verifyPassword - Compara una contraseña en texto plano con un hash almacenado.
 * Retorna true si coinciden, false si no.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
