import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCitaEmail } from "@/lib/email";

interface CitaInput {
  solicitudId: number;
  fechaCita: string;
  requisitos: string;
  direccion: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data: CitaInput = await request.json();

    if (!data.solicitudId || !data.fechaCita || !data.requisitos || !data.direccion) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    const fechaCitaDate = new Date(data.fechaCita);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCitaDate < hoy) {
      return new Response(
        JSON.stringify({ error: "La fecha de la cita debe ser futura" }),
        { status: 400 }
      );
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: data.solicitudId },
      include: {
        candidato: true,
        plaza: true
      }
    });

    if (!solicitud) {
      return new Response(
        JSON.stringify({ error: "Solicitud no encontrada" }),
        { status: 404 }
      );
    }

    if (!solicitud.candidato.email) {
      return new Response(
        JSON.stringify({ error: "El candidato no tiene email registrado" }),
        { status: 400 }
      );
    }

    if (solicitud.citado) {
      return new Response(
        JSON.stringify({ error: "Esta solicitud ya tiene una cita asignada" }),
        { status: 400 }
      );
    }

    const cita = await prisma.cita.create({
      data: {
        solicitudId: data.solicitudId,
        fechaCita: data.fechaCita,
        requisitos: data.requisitos,
        direccion: data.direccion
      }
    });

    await prisma.solicitud.update({
      where: { id: data.solicitudId },
      data: { citado: true }
    });

    const emailSent = await sendCitaEmail(
      solicitud.candidato.email,
      solicitud.candidato.nombre,
      solicitud.plazaNombre,
      data.fechaCita,
      data.requisitos,
      data.direccion
    );

    if (!emailSent) {
      await prisma.cita.delete({ where: { id: cita.id } });
      await prisma.solicitud.update({
        where: { id: data.solicitudId },
        data: { citado: false }
      });

      return new Response(
        JSON.stringify({ error: "No se pudo enviar el email de cita" }),
        { status: 500 }
      );
    }

    return Response.json({ ...cita, emailSent: true });
  } catch (error) {
    console.error("Error creando cita:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear cita" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const data: CitaInput = await request.json();

    if (!data.solicitudId || !data.fechaCita || !data.requisitos || !data.direccion) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    const fechaCitaDate = new Date(data.fechaCita);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCitaDate < hoy) {
      return new Response(
        JSON.stringify({ error: "La fecha de la cita debe ser futura" }),
        { status: 400 }
      );
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: data.solicitudId },
      include: {
        candidato: true,
        plaza: true
      }
    });

    if (!solicitud) {
      return new Response(
        JSON.stringify({ error: "Solicitud no encontrada" }),
        { status: 404 }
      );
    }

    if (!solicitud.citado) {
      return new Response(
        JSON.stringify({ error: "Esta solicitud no tiene cita asignada" }),
        { status: 400 }
      );
    }

    if (!solicitud.candidato.email) {
      return new Response(
        JSON.stringify({ error: "El candidato no tiene email registrado" }),
        { status: 400 }
      );
    }

    const cita = await prisma.cita.update({
      where: { solicitudId: data.solicitudId },
      data: {
        fechaCita: data.fechaCita,
        requisitos: data.requisitos,
        direccion: data.direccion
      }
    });

    const emailSent = await sendCitaEmail(
      solicitud.candidato.email,
      solicitud.candidato.nombre,
      solicitud.plazaNombre,
      data.fechaCita,
      data.requisitos,
      data.direccion
    );

    return Response.json({ ...cita, emailSent });
  } catch (error) {
    console.error("Error actualizando cita:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar cita" }),
      { status: 500 }
    );
  }
}
