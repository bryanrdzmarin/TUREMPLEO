import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface InformacionCanInput {
  candidatoId: number;
  titulacion?: string;
  oficios?: string;
  idiomas?: string;
  idioma?: string;
  nivel?: string;
  lugar?: string;
  cursos?: string;
  faltantes?: string;
  licencia?: string;
  comunitaria?: string;
  familiar?: string;
  resultado?: string;
  desempeno?: string;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const candidatoId = searchParams.get("candidatoId");
    const ci = searchParams.get("ci");

    let whereCondition: any = {};

    if (candidatoId) {
      whereCondition = { candidatoId: parseInt(candidatoId) };
    } else if (ci) {
      const candidato = await prisma.candidato.findUnique({
        where: { ci: ci }
      });
      if (!candidato) {
        return new Response(
          JSON.stringify({ error: "No se encontró candidato con este CI" }),
          { status: 404 }
        );
      }
      whereCondition = { candidatoId: candidato.id };
    } else {
      return new Response(
        JSON.stringify({ error: "Se requiere candidatoId o ci" }),
        { status: 400 }
      );
    }

    const informacion = await prisma.informacionCan.findUnique({
      where: whereCondition
    });

    if (!informacion) {
      return new Response(
        JSON.stringify({ error: "No se encontró información para este candidato" }),
        { status: 404 }
      );
    }

    return Response.json(informacion);
  } catch (error) {
    console.error("Error fetching informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener información del candidato" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as InformacionCanInput;

    if (!data.candidatoId) {
      return new Response(
        JSON.stringify({ error: "candidatoId es obligatorio" }),
        { status: 400 }
      );
    }

    const existe = await prisma.informacionCan.findUnique({
      where: { candidatoId: data.candidatoId }
    });

    if (existe) {
      return new Response(
        JSON.stringify({ error: "Ya existe información para este candidato. Use PUT para actualizar." }),
        { status: 400 }
      );
    }

    const informacion = await prisma.informacionCan.create({
      data: {
        candidatoId: data.candidatoId,
        titulacion: data.titulacion || null,
        oficios: data.oficios || null,
        idiomas: data.idiomas || null,
        idioma: data.idioma || null,
        nivel: data.nivel || null,
        lugar: data.lugar || null,
        cursos: data.cursos || null,
        faltantes: data.faltantes || null,
        licencia: data.licencia || null,
        comunitaria: data.comunitaria || null,
        familiar: data.familiar || null,
        resultado: data.resultado || null,
        desempeno: data.desempeno || null,
      }
    });

    return Response.json(informacion);
  } catch (error) {
    console.error("Error creating informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear información del candidato" }),
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

    const informacion = await prisma.informacionCan.update({
      where: { id: parseInt(id) },
      data: {
        titulacion: data.titulacion !== undefined ? data.titulacion : undefined,
        oficios: data.oficios !== undefined ? data.oficios : undefined,
        idiomas: data.idiomas !== undefined ? data.idiomas : undefined,
        idioma: data.idioma !== undefined ? data.idioma : undefined,
        nivel: data.nivel !== undefined ? data.nivel : undefined,
        lugar: data.lugar !== undefined ? data.lugar : undefined,
        cursos: data.cursos !== undefined ? data.cursos : undefined,
        faltantes: data.faltantes !== undefined ? data.faltantes : undefined,
        licencia: data.licencia !== undefined ? data.licencia : undefined,
        comunitaria: data.comunitaria !== undefined ? data.comunitaria : undefined,
        familiar: data.familiar !== undefined ? data.familiar : undefined,
        resultado: data.resultado !== undefined ? data.resultado : undefined,
        desempeno: data.desempeno !== undefined ? data.desempeno : undefined,
      }
    });

    return Response.json(informacion);
  } catch (error) {
    console.error("Error updating informacionCan:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar información del candidato" }),
      { status: 500 }
    );
  }
}