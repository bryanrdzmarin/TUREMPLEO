import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

async function getAuthUserId(request: NextRequest): Promise<number | undefined> {
  const payload = await getUserFromRequest(request);
  return payload?.userId;
}

export async function GET(): Promise<Response> {
  try {
    const plazas = await prisma.plaza.findMany({
      where: { eliminado: false },
      orderBy: { id: "desc" }
    });
    return Response.json(plazas);
  } catch (error) {
    console.error("Error fetching plazas:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener plazas" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as { nombre: string; requisitos: string; funciones: string };
    
    if (!data.nombre || !data.requisitos || !data.funciones) {
      return new Response(
        JSON.stringify({ error: "Nombre, requisitos y funciones son obligatorios" }),
        { status: 400 }
      );
    }

    const plaza = await prisma.plaza.create({
      data: {
        nombre: data.nombre,
        requisitos: data.requisitos,
        funciones: data.funciones,
        activo: true
      }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.CREAR_PLAZA,
      entidad: ENTIDADES_AUDITORIA.PLAZA,
      entidadId: plaza.id,
      detalles: { nombre: plaza.nombre, requisitos: plaza.requisitos, funciones: plaza.funciones },
      request,
    });

    return Response.json(plaza);
  } catch (error) {
    console.error("Error creating plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear plaza" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as { id: number; nombre: string; requisitos: string; funciones: string; activo: boolean };
    
    if (!data.id || !data.nombre || !data.requisitos || !data.funciones) {
      return new Response(
        JSON.stringify({ error: "ID, nombre, requisitos y funciones son obligatorios" }),
        { status: 400 }
      );
    }

    const plazaExistente = await prisma.plaza.findUnique({ where: { id: data.id } });

    const plaza = await prisma.plaza.update({
      where: { id: data.id },
      data: {
        nombre: data.nombre,
        requisitos: data.requisitos,
        funciones: data.funciones,
        activo: data.activo
      }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.ACTUALIZAR_PLAZA,
      entidad: ENTIDADES_AUDITORIA.PLAZA,
      entidadId: plaza.id,
      detalles: {
        nombre: plaza.nombre,
        activo: plaza.activo,
        cambios: {
          nombreAnterior: plazaExistente?.nombre,
          activoAnterior: plazaExistente?.activo,
        },
      },
      request,
    });

    return Response.json(plaza);
  } catch (error) {
    console.error("Error updating plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar plaza" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID es obligatorio" }),
        { status: 400 }
      );
    }

    const numericId = parseInt(id);

    const solicitudesActivas = await prisma.solicitud.findMany({
      where: { 
        plazaId: numericId, 
        archivado: false,
        estado: { in: ["pendiente", "aprobado"] }
      }
    });

    if (solicitudesActivas.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "No se puede eliminar esta plaza porque tiene solicitudes activas",
          tieneSolicitudes: true,
          cantidad: solicitudesActivas.length,
          detalles: solicitudesActivas.map(s => ({ id: s.id, estado: s.estado }))
        }),
        { status: 400 }
      );
    }

    await prisma.plaza.update({
      where: { id: numericId },
      data: { eliminado: true }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.ELIMINAR_PLAZA,
      entidad: ENTIDADES_AUDITORIA.PLAZA,
      entidadId: numericId,
      request,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar la plaza", detalles: String(error) }),
      { status: 500 }
    );
  }
}