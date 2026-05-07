/**
 * POST /api/admin/usuarios/[id]/reset - Genera contraseña aleatoria y envía por email.
 *
 * El admin NO ve la contraseña. El sistema la genera, la guarda hasheada en la BD
 * y envía un email al usuario con su nueva contraseña.
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { hashPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { sendPasswordChangedEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

async function checkAdmin(request: NextRequest) {
  const payload = await getUserFromRequest(request);
  if (!payload) {
    return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }), payload: null };
  }
  if (payload.rol !== "admin") {
    return { error: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }), payload: null };
  }
  return { error: null, payload };
}

function generarPasswordAleatoria(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const nuevaPassword = generarPasswordAleatoria();
    const hashedPassword = await hashPassword(nuevaPassword);

    await prisma.usuario.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    const emailSent = await sendPasswordChangedEmail(
      usuario.email,
      usuario.nombre,
      nuevaPassword
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: "Error al enviar el email de notificación" },
        { status: 500 }
      );
    }

    await logAudit({
      userId: auth.payload!.userId,
      accion: ACCIONES_AUDITORIA.GENERAR_CONTRASEÑA,
      entidad: ENTIDADES_AUDITORIA.USUARIO,
      entidadId: userId,
      detalles: { nombreUsuario: usuario.nombreUsuario, email: usuario.email },
      request,
    });

    return NextResponse.json({ success: true, message: "Contraseña generada y enviada por email" });
  } catch (error) {
    console.error("Error en POST /api/admin/usuarios/[id]/reset:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
