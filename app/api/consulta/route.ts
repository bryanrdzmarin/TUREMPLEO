import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface ConsultaInput {
  ci: string;
  pin: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as ConsultaInput;

    if (!data.ci || !data.pin) {
      return Response.json(
        { error: "CI y PIN son obligatorios" },
        { status: 400 }
      );
    }

    const candidato = await prisma.candidato.findUnique({
      where: { ci: data.ci }
    });

    if (!candidato) {
      return Response.json(
        { error: "No se encontró ninguna solicitud con este CI" },
        { status: 404 }
      );
    }

    const solicitud = await prisma.solicitud.findFirst({
      where: {
        candidatoId: candidato.id,
        pin: data.pin
      },
      include: {
        candidato: true,
        plaza: true,
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    if (!solicitud) {
      return Response.json(
        { error: "PIN incorrecto para este candidato" },
        { status: 404 }
      );
    }

    return Response.json({
      nombre: solicitud.candidato.nombre,
      ci: solicitud.candidato.ci,
      plaza: solicitud.plazaNombre,
      estado: solicitud.estado,
      fecha: solicitud.creadoEn,
    });

  } catch (error) {
    console.error("Error consulting solicitud:", error);
    return Response.json(
      { error: "Error al consultar la solicitud" },
      { status: 500 }
    );
  }
}
