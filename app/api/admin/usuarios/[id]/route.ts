/**
 * PATCH /api/admin/usuarios/[id] - Actualiza un usuario existente (solo admin).
 *
 * Recibe el ID en la URL y los campos a actualizar en el body.
 * Si se envía una nueva password, se hashea antes de guardar.
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { hashPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(request);
  if (auth.error) return auth.error;

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { nombre, email, rol, password } = body;
    const userId = parseInt(resolvedParams.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (email && email.toLowerCase() !== usuarioExistente.email.toLowerCase()) {
      const duplicado = await prisma.usuario.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (duplicado) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese email" },
          { status: 409 }
        );
      }
    }

    if (rol && !["admin", "reclutador"].includes(rol)) {
      return NextResponse.json(
        { error: "Rol inválido. Debe ser 'admin' o 'reclutador'" },
        { status: 400 }
      );
    }

    if (rol === "admin" && usuarioExistente.rol !== "admin") {
      const adminCount = await prisma.usuario.count({
        where: { rol: "admin" },
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "No se puede cambiar a admin si hay solo uno existente" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, string> = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email.toLowerCase();
    if (rol) updateData.rol = rol;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
    });

    await logAudit({
      userId: auth.payload!.userId,
      accion: ACCIONES_AUDITORIA.ACTUALIZAR_USUARIO,
      entidad: ENTIDADES_AUDITORIA.USUARIO,
      entidadId: userId,
      detalles: {
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        rol: usuarioActualizado.rol,
        emailAnterior: email ? usuarioExistente.email : undefined,
      },
      request,
    });

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.error("Error en PATCH /api/admin/usuarios/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
