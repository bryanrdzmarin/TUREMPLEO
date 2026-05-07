/**
 * API /api/admin/auditoria - Registro de auditoría (solo admin).
 *
 * GET → Lista logs con filtros y paginación
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const accion = searchParams.get("accion");
    const entidad = searchParams.get("entidad");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const busqueda = searchParams.get("busqueda");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: Record<string, unknown> = {};

    if (userId) {
      where.usuarioId = parseInt(userId);
    }

    if (accion) {
      where.accion = accion;
    }

    if (entidad) {
      where.entidad = entidad;
    }

    if (desde || hasta) {
      const dateFilter: Record<string, unknown> = {};
      if (desde) dateFilter.gte = new Date(desde);
      if (hasta) {
        const hastaEnd = new Date(hasta);
        hastaEnd.setHours(23, 59, 59, 999);
        dateFilter.lte = hastaEnd;
      }
      where.creadoEn = dateFilter;
    }

    if (busqueda) {
      where.OR = [
        { detalles: { contains: busqueda } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nombreUsuario: true,
              nombre: true,
              rol: true,
            },
          },
        },
        orderBy: { creadoEn: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombreUsuario: true,
        nombre: true,
        rol: true,
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      usuarios,
    });
  } catch (error) {
    console.error("Error en GET /api/admin/auditoria:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
