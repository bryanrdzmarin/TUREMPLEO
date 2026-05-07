/**
 * POST /api/auth/forgot-password - Genera un token de reset y envía email.
 *
 * Recibe { email }. Si el email existe, genera un token único, lo guarda en la BD
 * con expiración de 1 hora, y envía un email con el link de reset.
 *
 * Siempre responde 200 por seguridad (no revelar si el email existe).
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email es obligatorio" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario) {
      // Por seguridad, no revelamos si el email existe
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomUUID();
    const expiraEn = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.tokenResetPassword.create({
      data: {
        usuarioId: usuario.id,
        token,
        expiraEn,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendResetPasswordEmail(usuario.email, usuario.nombre, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
