import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

async function getAuthUserId(request: NextRequest): Promise<number | undefined> {
  const payload = await getUserFromRequest(request);
  return payload?.userId;
}

interface InformacionCanInput {
  solicitudId: number;
  titulacion?: string;
  oficios?: string;
  idiomas?: string;
  nivel?: string;
  lugar?: string;
  cursos?: string;
  faltantes?: string;
  licencia?: string;
  comunitaria?: string;
  intrabajo?: string;
  desempeno?: string;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const solicitudId = searchParams.get("solicitudId");

    if (!solicitudId) {
      return new Response(
        JSON.stringify({ error: "Se requiere solicitudId" }),
        { status: 400 }
      );
    }

    const informacion = await prisma.informacionCan.findUnique({
      where: { solicitudId: parseInt(solicitudId) }
    });

    if (!informacion) {
      return new Response(
        JSON.stringify({ error: "No se encontró información para esta solicitud" }),
        { status: 404 }
      );
    }

    return Response.json(informacion);
  } catch (error) {
    console.error("Error fetching informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener información" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as InformacionCanInput;

    if (!data.solicitudId) {
      return new Response(
        JSON.stringify({ error: "solicitudId es obligatorio" }),
        { status: 400 }
      );
    }

    const existe = await prisma.informacionCan.findUnique({
      where: { solicitudId: data.solicitudId }
    });

    if (existe) {
      return new Response(
        JSON.stringify({ error: "Ya existe información para esta solicitud. Use PUT para actualizar." }),
        { status: 400 }
      );
    }

    const informacion = await prisma.informacionCan.create({
      data: {
        solicitudId: data.solicitudId,
        titulacion: data.titulacion || null,
        oficios: data.oficios || null,
        idiomas: data.idiomas || null,
        nivel: data.nivel || null,
        lugar: data.lugar || null,
        cursos: data.cursos || null,
        faltantes: data.faltantes || null,
        licencia: data.licencia || null,
        comunitaria: data.comunitaria || null,
        intrabajo: data.intrabajo || null,
        desempeno: data.desempeno || null,
      }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.CREAR_EVALUACION,
      entidad: ENTIDADES_AUDITORIA.EVALUACION,
      entidadId: informacion.id,
      detalles: { solicitudId: data.solicitudId, titulacion: data.titulacion },
      request,
    });

    return Response.json(informacion);
  } catch (error) {
    console.error("Error creating informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear información" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID es obligatorio" }),
        { status: 400 }
      );
    }

    const data = await request.json() as Partial<InformacionCanInput>;

    const informacionAnterior = await prisma.informacionCan.findUnique({ where: { id: parseInt(id) } });

    const informacion = await prisma.informacionCan.update({
      where: { id: parseInt(id) },
      data: {
        titulacion: data.titulacion !== undefined ? data.titulacion : undefined,
        oficios: data.oficios !== undefined ? data.oficios : undefined,
        idiomas: data.idiomas !== undefined ? data.idiomas : undefined,
        nivel: data.nivel !== undefined ? data.nivel : undefined,
        lugar: data.lugar !== undefined ? data.lugar : undefined,
        cursos: data.cursos !== undefined ? data.cursos : undefined,
        faltantes: data.faltantes !== undefined ? data.faltantes : undefined,
        licencia: data.licencia !== undefined ? data.licencia : undefined,
        comunitaria: data.comunitaria !== undefined ? data.comunitaria : undefined,
        intrabajo: data.intrabajo !== undefined ? data.intrabajo : undefined,
        desempeno: data.desempeno !== undefined ? data.desempeno : undefined,
      }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.ACTUALIZAR_EVALUACION,
      entidad: ENTIDADES_AUDITORIA.EVALUACION,
      entidadId: informacion.id,
      detalles: { solicitudId: informacion.solicitudId },
      request,
    });

    return Response.json(informacion);
  } catch (error) {
    console.error("Error updating informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar información" }),
      { status: 500 }
    );
  }
}