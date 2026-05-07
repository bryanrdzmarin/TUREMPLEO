/**
 * POST /api/auth/login - Autentica un usuario y devuelve un token en cookie httpOnly.
 * Recibe nombreUsuario y password en el body. Verifica las credenciales contra la DB.
 * Si son correctas, genera un JWT y lo envía como cookie segura.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-server";
import { generateToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreUsuario, password } = body;

    if (!nombreUsuario || !password) {
      return NextResponse.json(
        { error: "Nombre de usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { nombreUsuario: nombreUsuario.toLowerCase() }
    });

    if (!usuario) {
      await logAudit({
        accion: ACCIONES_AUDITORIA.INTENTO_LOGIN_FALLIDO,
        entidad: ENTIDADES_AUDITORIA.SISTEMA,
        detalles: { nombreUsuario, motivo: "Usuario no encontrado" },
        request,
      });
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const passwordValida = await verifyPassword(password, usuario.password);

    if (!passwordValida) {
      await logAudit({
        accion: ACCIONES_AUDITORIA.INTENTO_LOGIN_FALLIDO,
        entidad: ENTIDADES_AUDITORIA.SISTEMA,
        detalles: { nombreUsuario: usuario.nombreUsuario, motivo: "Contraseña incorrecta" },
        request,
      });
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const token = await generateToken({
      userId: usuario.id,
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol
      }
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
