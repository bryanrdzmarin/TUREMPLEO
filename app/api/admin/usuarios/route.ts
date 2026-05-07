/**
 * API /api/admin/usuarios - CRUD de usuarios (solo admin).
 *
 * GET    → Lista todos los usuarios
 * POST   → Crea un nuevo usuario
 * DELETE → Elimina un usuario por ID
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { hashPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,30}$/;

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

export async function GET(request: NextRequest) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombreUsuario: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error en GET /api/admin/usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { nombreUsuario, nombre, email, password, rol } = body;

    if (!nombreUsuario || !nombre || !email || !password || !rol) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (!USERNAME_REGEX.test(nombreUsuario)) {
      return NextResponse.json(
        { error: "El nombre de usuario debe tener entre 5 y 30 caracteres, solo letras, números y guión bajo" },
        { status: 400 }
      );
    }

    if (!["admin", "reclutador"].includes(rol)) {
      return NextResponse.json(
        { error: "Rol inválido. Debe ser 'admin' o 'reclutador'" },
        { status: 400 }
      );
    }

    const emailExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 }
      );
    }

    const usernameExistente = await prisma.usuario.findUnique({
      where: { nombreUsuario: nombreUsuario.toLowerCase() },
    });

    if (usernameExistente) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese nombre de usuario" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreUsuario: nombreUsuario.toLowerCase(),
        nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol,
      },
      select: {
        id: true,
        nombreUsuario: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
    });

    await logAudit({
      userId: auth.payload!.userId,
      accion: ACCIONES_AUDITORIA.CREAR_USUARIO,
      entidad: ENTIDADES_AUDITORIA.USUARIO,
      entidadId: nuevoUsuario.id,
      detalles: { nombreUsuario: nuevoUsuario.nombreUsuario, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      request,
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/admin/usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const adminCount = await prisma.usuario.count({
      where: { rol: "admin" },
    });

    if (usuario.rol === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { error: "No se puede eliminar el único administrador" },
        { status: 400 }
      );
    }

    await prisma.usuario.delete({
      where: { id },
    });

    await logAudit({
      userId: auth.payload!.userId,
      accion: ACCIONES_AUDITORIA.ELIMINAR_USUARIO,
      entidad: ENTIDADES_AUDITORIA.USUARIO,
      entidadId: id,
      detalles: { nombreUsuario: usuario.nombreUsuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/admin/usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiraEn = new Date(Date.now() + 3600000);

    await prisma.tokenResetPassword.create({
      data: {
        usuarioId: usuario.id,
        token,
        expiraEn,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const emailSent = await sendResetPasswordEmail(
      usuario.email,
      usuario.nombre,
      resetUrl
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: "Error al enviar el email de reset" },
        { status: 500 }
      );
    }

    await logAudit({
      userId: auth.payload!.userId,
      accion: ACCIONES_AUDITORIA.RESETEAR_CONTRASEÑA_EMAIL,
      entidad: ENTIDADES_AUDITORIA.USUARIO,
      entidadId: usuario.id,
      detalles: { nombreUsuario: usuario.nombreUsuario, email: usuario.email },
      request,
    });

    return NextResponse.json({ success: true, message: "Email de reset enviado" });
  } catch (error) {
    console.error("Error en PATCH /api/admin/usuarios (force-reset):", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
