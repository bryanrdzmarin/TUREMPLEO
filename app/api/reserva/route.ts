import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    
    const plaza = searchParams.get("plaza");
    const titulacion = searchParams.get("titulacion");
    const idiomas = searchParams.get("idiomas");
    const nivel = searchParams.get("nivel");
    const licencia = searchParams.get("licencia");
    const oficios = searchParams.get("oficios");
    const cursos = searchParams.get("cursos");
    const comunitaria = searchParams.get("comunitaria");
    const intrabajo = searchParams.get("intrabajo");

    const solicitudesAprobadas = await prisma.solicitud.findMany({
      where: {
        estado: "aprobado",
        citado: true,
        entrevistaPasada: true
      },
      include: {
        candidato: true,
        plaza: true,
        informacionCan: true
      }
    });

    const candidatosMap = new Map<number, any>();

    for (const solicitud of solicitudesAprobadas) {
      const candidatoId = solicitud.candidatoId;
      
      let includeThisPlaza = true;
      
      if (plaza && solicitud.plazaNombre) {
        includeThisPlaza = solicitud.plazaNombre.toLowerCase().includes(plaza.toLowerCase());
      }
      if (includeThisPlaza && titulacion && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.titulacion?.toLowerCase().includes(titulacion.toLowerCase()) || false;
      }
      if (includeThisPlaza && idiomas && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.idiomas?.toLowerCase().includes(idiomas.toLowerCase()) || false;
      }
      if (includeThisPlaza && nivel && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.nivel === nivel;
      }
      if (includeThisPlaza && licencia && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.licencia === licencia;
      }
      if (includeThisPlaza && oficios && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.oficios?.toLowerCase().includes(oficios.toLowerCase()) || false;
      }
      if (includeThisPlaza && cursos && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.cursos?.toLowerCase().includes(cursos.toLowerCase()) || false;
      }
      if (includeThisPlaza && comunitaria && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.comunitaria === comunitaria;
      }
      if (includeThisPlaza && intrabajo && solicitud.informacionCan) {
        includeThisPlaza = solicitud.informacionCan.intrabajo === intrabajo;
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
          plazasAprobadas: []
        });
      }

      if (includeThisPlaza) {
        candidatosMap.get(candidatoId).plazasAprobadas.push({
          solicitudId: solicitud.id,
          plazaId: solicitud.plazaId,
          plazaNombre: solicitud.plazaNombre,
          fechaEvaluacion: solicitud.fechaEvaluacion,
          evaluacion: solicitud.informacionCan ? {
            titulacion: solicitud.informacionCan.titulacion,
            oficios: solicitud.informacionCan.oficios,
            idiomas: solicitud.informacionCan.idiomas,
            nivel: solicitud.informacionCan.nivel,
            lugar: solicitud.informacionCan.lugar,
            cursos: solicitud.informacionCan.cursos,
            faltantes: solicitud.informacionCan.faltantes,
            licencia: solicitud.informacionCan.licencia,
            comunitaria: solicitud.informacionCan.comunitaria,
            intrabajo: solicitud.informacionCan.intrabajo,
            desempeno: solicitud.informacionCan.desempeno
          } : null
        });
      }
    }

    const candidatosFiltrados = Array.from(candidatosMap.values()).filter(
      c => c.plazasAprobadas.length > 0
    );

    return Response.json(candidatosFiltrados);
  } catch (error) {
    console.error("Error fetching reserva:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener la reserva" }),
      { status: 500 }
    );
  }
}