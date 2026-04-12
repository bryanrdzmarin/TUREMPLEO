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
        cita: true,
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

    let mensaje = "";
    let estadoMostrar = "";

    if (solicitud.entrevistaPasada === true) {
      estadoMostrar = "entrevista_aprobada";
      mensaje = "Has aprobado la entrevista presencial. Ya formas parte de la reserva laboral de turempleo. Seguiremos aquí hasta que haya vacantes disponibles.";
    } else if (solicitud.entrevistaPasada === false) {
      estadoMostrar = "entrevista_rechazada";
      mensaje = `Has sido rechazado en la entrevista presencial para la plaza ${solicitud.plazaNombre}. La entidad se reserva los motivos del rechazo.`;
    } else if (solicitud.estado === "pendiente") {
      estadoMostrar = "pendiente";
      mensaje = "Su solicitud está siendo revisada. Le notificaremos cuando haya una actualización.";
    } else if (solicitud.estado === "rechazado") {
      estadoMostrar = "rechazado";
      mensaje = "Lamentamos informarle que su solicitud no ha sido aprobada en esta ocasión.";
    } else if (solicitud.estado === "aprobado") {
      if (solicitud.citado && solicitud.cita) {
        estadoMostrar = "citado";
        const fechaFormateada = new Date(solicitud.cita.fechaCita).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
        mensaje = `Tiene cita para entrevista presencial el día ${fechaFormateada}. Debe dirigirse a ${solicitud.cita.direccion} y traer: ${solicitud.cita.requisitos}`;
      } else {
        estadoMostrar = "aprobado";
        mensaje = "Su solicitud ha sido aprobada. Pendiente de citar para entrevista presencial.";
      }
    }

    return Response.json({
      nombre: solicitud.candidato.nombre,
      ci: solicitud.candidato.ci,
      plaza: solicitud.plazaNombre,
      estado: estadoMostrar,
      mensaje: mensaje,
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
