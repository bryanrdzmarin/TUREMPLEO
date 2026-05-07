/**
 * GET /api/auth/reset-password?token=xxx - Valida un token de reset.
 * POST /api/auth/reset-password - Cambia la contraseña usando un token válido.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      );
    }

    const tokenRecord = await prisma.tokenResetPassword.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 404 }
      );
    }

    if (tokenRecord.usado) {
      return NextResponse.json(
        { error: "Este token ya fue usado" },
        { status: 400 }
      );
    }

    if (new Date() > tokenRecord.expiraEn) {
      return NextResponse.json(
        { error: "Este token ha expirado" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: tokenRecord.usuario.email,
      nombre: tokenRecord.usuario.nombre,
    });
  } catch (error) {
    console.error("Error validando token:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token y nueva contraseña son obligatorios" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const tokenRecord = await prisma.tokenResetPassword.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 404 }
      );
    }

    if (tokenRecord.usado) {
      return NextResponse.json(
        { error: "Este token ya fue usado" },
        { status: 400 }
      );
    }

    if (new Date() > tokenRecord.expiraEn) {
      return NextResponse.json(
        { error: "Este token ha expirado" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.usuario.update({
      where: { id: tokenRecord.usuarioId },
      data: { password: hashedPassword },
    });

    await prisma.tokenResetPassword.update({
      where: { id: tokenRecord.id },
      data: { usado: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
