import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const plaza = searchParams.get("plaza");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    const fechaDesdeParsed = fechaDesde ? new Date(fechaDesde) : null;
    const fechaHastaParsed = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

    const whereClause: any = {
      estado: "contratado",
      archivado: true
    };

    if (fechaDesdeParsed || fechaHastaParsed) {
      whereClause.actualizadoEn = {};
      if (fechaDesdeParsed) whereClause.actualizadoEn.gte = fechaDesdeParsed;
      if (fechaHastaParsed) whereClause.actualizadoEn.lte = fechaHastaParsed;
    }

    const solicitudesContratadas = await prisma.solicitud.findMany({
      where: whereClause,
      include: {
        candidato: true,
        plaza: true
      },
      orderBy: { actualizadoEn: "desc" }
    });

    const candidatosMap = new Map<number, any>();

    for (const solicitud of solicitudesContratadas) {
      const candidatoId = solicitud.candidatoId;
      
      let includeThisPlaza = true;
      if (plaza && solicitud.plazaNombre) {
        includeThisPlaza = solicitud.plazaNombre.toLowerCase().includes(plaza.toLowerCase());
      }

      if (!candidatosMap.has(candidatoId)) {
        candidatosMap.set(candidatoId, {
          candidato: {
            id: solicitud.candidato.id,
            ci: solicitud.candidato.ci,
            nombre: solicitud.candidato.nombre,
            telefono: solicitud.candidato.telefono,
            email: solicitud.candidato.email
          },
          plazas: [],
          fechaContratacion: solicitud.actualizadoEn
        });
      }

      if (includeThisPlaza) {
        candidatosMap.get(candidatoId).plazas.push({
          plazaNombre: solicitud.plazaNombre,
          fechaContratacion: solicitud.actualizadoEn
        });
      }
    }

    const candidatosFiltrados = Array.from(candidatosMap.values()).filter(
      c => c.plazas.length > 0
    );

    return Response.json(candidatosFiltrados);
  } catch (error) {
    console.error("Error fetching contratados:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener los contratados" }),
      { status: 500 }
    );
  }
}