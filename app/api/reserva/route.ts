import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCitaEmail } from "@/lib/email";
import { getUserFromRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

async function getAuthUserId(request: NextRequest): Promise<number | undefined> {
  const payload = await getUserFromRequest(request);
  return payload?.userId;
}

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
    const vista = searchParams.get("vista");

    const solicitudesAprobadas = await prisma.solicitud.findMany({
      where: {
        estado: "aprobado",
        citado: true,
        entrevistaPasada: true,
        citadoDesdeReserva: vista === "citados" ? true : false,
        ...(vista !== "citados"
          ? { candidato: { NOT: { solicitudes: { some: { citadoDesdeReserva: true } } } } }
          : {})
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

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as {
      email: string;
      nombre: string;
      plazaNombre: string;
      fechaCita: string;
      direccion: string;
      requisitos: string;
      solicitudId: number;
    };

    if (!data.email || !data.nombre || !data.plazaNombre || !data.fechaCita || !data.direccion || !data.requisitos) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    const emailSent = await sendCitaEmail(
      data.email,
      data.nombre,
      data.plazaNombre,
      data.fechaCita,
      data.requisitos,
      data.direccion
    );

    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: "No se pudo enviar el email de cita" }),
        { status: 500 }
      );
    }

    const solicitudExists = await prisma.solicitud.findUnique({
      where: { id: data.solicitudId },
      select: { id: true }
    });

    if (!solicitudExists) {
      return new Response(
        JSON.stringify({ error: "Solicitud no encontrada" }),
        { status: 404 }
      );
    }

    await prisma.solicitud.update({
      where: { id: data.solicitudId },
      data: { citadoDesdeReserva: true }
    });

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: ACCIONES_AUDITORIA.CITAR_DESDE_RESERVA,
      entidad: ENTIDADES_AUDITORIA.SOLICITUD,
      entidadId: data.solicitudId,
      detalles: { candidato: data.nombre, plaza: data.plazaNombre, fechaCita: data.fechaCita },
      request,
    });

    return Response.json({ success: true, message: "Cita enviada exitosamente" });
  } catch (error) {
    console.error("Error sending cita email:", error);
    return new Response(
      JSON.stringify({ error: "Error al enviar el email de cita" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as { solicitudId?: number; candidatoId?: number; accion: string };

    if (!data.accion || (!data.solicitudId && !data.candidatoId)) {
      return new Response(
        JSON.stringify({ error: "solicitudId o candidatoId, y accion son requeridos" }),
        { status: 400 }
      );
    }

    if (data.accion === "denegar") {
      if (data.solicitudId) {
        await prisma.solicitud.update({
          where: { id: data.solicitudId },
          data: { citadoDesdeReserva: false }
        });
      } else if (data.candidatoId) {
        await prisma.solicitud.updateMany({
          where: { candidatoId: data.candidatoId, citadoDesdeReserva: true },
          data: { citadoDesdeReserva: false }
        });
      }

      const userId = await getAuthUserId(request);
      await logAudit({
        userId,
        accion: ACCIONES_AUDITORIA.DENEGAR_DESDE_RESERVA,
        entidad: ENTIDADES_AUDITORIA.SOLICITUD,
        entidadId: data.solicitudId ?? undefined,
        detalles: { candidatoId: data.candidatoId },
        request,
      });

      return Response.json({ success: true, message: "Candidato devuelto a la reserva" });
    }

    if (data.accion === "aprobar") {
      if (data.candidatoId) {
        const solicitudesDelCandidato = await prisma.solicitud.findMany({
          where: { candidatoId: data.candidatoId }
        });

        const plazasArchivadas = solicitudesDelCandidato.map(s => s.plazaId);

        const resultado = await prisma.solicitud.updateMany({
          where: { candidatoId: data.candidatoId },
          data: { 
            estado: "contratado",
            citadoDesdeReserva: false,
            archivado: true
          }
        });

        const plazasDesbloqueadas: number[] = [];
        for (const plazaId of plazasArchivadas) {
          const solicitudesActivas = await prisma.solicitud.count({
            where: {
              plazaId,
              archivado: false,
              estado: { in: ["pendiente", "aprobado"] }
            }
          });
          if (solicitudesActivas === 0) {
            plazasDesbloqueadas.push(plazaId);
          }
        }

        const userId = await getAuthUserId(request);
        await logAudit({
          userId,
          accion: ACCIONES_AUDITORIA.CONTRATAR_DESDE_RESERVA,
          entidad: ENTIDADES_AUDITORIA.SOLICITUD,
          entidadId: undefined,
          detalles: { candidatoId: data.candidatoId, solicitudesArchivadas: resultado.count, plazasDesbloqueadas },
          request,
        });

        return Response.json({ 
          success: true, 
          message: `${resultado.count} solicitudes archivadas`,
          plazasDesbloqueadas
        });
      }
      return new Response(
        JSON.stringify({ error: "Para aprobar se requiere candidatoId" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Accion no valida. Use 'denegar' o 'aprobar'" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Error al procesar solicitud:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud" }),
      { status: 500 }
    );
  }
}