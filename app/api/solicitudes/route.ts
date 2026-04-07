import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface SolicitudInput {
  ci: string;
  nombre: string;
  telefono: string;
  email: string;
  plazaId: number;
  plazaNombre: string;
  fechaNacimiento?: string;
  edad?: number;
  sexo?: string;
  colorPiel?: string;
  colorPelo?: string;
  peso?: number;
  estatura?: number;
  estadoCivil?: string;
  municipioNacimiento?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  direccion?: string;
  reparto?: string;
  municipio?: string;
  provincia?: string;
  telefonoParticular?: string;
  telefonoLaboral?: string;
  telefonoFamiliar?: string;
  nivelEscolar?: string;
  especialidad?: string;
  profesiones?: string;
  idiomas?: string;
  cursos?: string;
  licenciaConduccion?: string;
  haTrabajadoTurismo?: boolean;
  experienciaTurismo?: string;
  fuenteProcedencia?: string;
  otraFuente?: string;
  trayectoriaPolitica?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as SolicitudInput;

    if (!data.ci || !data.nombre || !data.plazaId || !data.plazaNombre) {
      return new Response(
        JSON.stringify({ error: "CI, nombre, plazaId y plazaNombre son obligatorios" }),
        { status: 400 }
      );
    }

    let candidato = await prisma.candidato.findUnique({
      where: { ci: data.ci }
    });

    if (!candidato) {
      candidato = await prisma.candidato.create({
        data: {
          ci: data.ci,
          nombre: data.nombre,
          telefono: data.telefono || null,
          email: data.email || null,
        }
      });
    }

    const solicitudExistente = await prisma.solicitud.findUnique({
      where: {
        candidatoId_plazaId: {
          candidatoId: candidato.id,
          plazaId: data.plazaId,
        }
      }
    });

    if (solicitudExistente) {
      return new Response(
        JSON.stringify({ error: "Ya existe una solicitud para esta plaza" }),
        { status: 400 }
      );
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        candidatoId: candidato.id,
        plazaId: data.plazaId,
        plazaNombre: data.plazaNombre,
        estado: "pendiente",
        fechaNacimiento: data.fechaNacimiento || null,
        edad: data.edad || null,
        sexo: data.sexo || null,
        colorPiel: data.colorPiel || null,
        colorPelo: data.colorPelo || null,
        peso: data.peso || null,
        estatura: data.estatura || null,
        estadoCivil: data.estadoCivil || null,
        municipioNacimiento: data.municipioNacimiento || null,
        nombrePadre: data.nombrePadre || null,
        nombreMadre: data.nombreMadre || null,
        direccion: data.direccion || null,
        reparto: data.reparto || null,
        municipio: data.municipio || null,
        provincia: data.provincia || null,
        telefonoParticular: data.telefonoParticular || null,
        telefonoLaboral: data.telefonoLaboral || null,
        telefonoFamiliar: data.telefonoFamiliar || null,
        nivelEscolar: data.nivelEscolar || null,
        especialidad: data.especialidad || null,
        profesiones: data.profesiones || null,
        idiomas: data.idiomas || null,
        cursos: data.cursos || null,
        licenciaConduccion: data.licenciaConduccion || null,
        haTrabajadoTurismo: data.haTrabajadoTurismo || false,
        experienciaTurismo: data.experienciaTurismo || null,
        fuenteProcedencia: data.fuenteProcedencia || null,
        otraFuente: data.otraFuente || null,
        trayectoriaPolitica: data.trayectoriaPolitica || null,
      }
    });

    return Response.json(solicitud);
  } catch (error) {
    console.error("Error creating solicitud:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return new Response(
      JSON.stringify({ error: "Error al crear solicitud: " + errorMessage }),
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      include: {
        candidato: true,
        plaza: true,
      },
      orderBy: {
        creadoEn: "desc",
      }
    });
    return Response.json(solicitudes);
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener solicitudes" }),
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

    const data = await request.json() as { estado?: string };
    
    if (!data.estado || !["pendiente", "aprobado", "rechazado"].includes(data.estado)) {
      return new Response(
        JSON.stringify({ error: "Estado inválido" }),
        { status: 400 }
      );
    }

    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: { estado: data.estado }
    });

    return Response.json(solicitud);
  } catch (error) {
    console.error("Error updating solicitud:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar solicitud" }),
      { status: 500 }
    );
  }
}
