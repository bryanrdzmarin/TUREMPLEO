import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    const candidatosAprobados = await prisma.solicitud.findMany({
      where: {
        estado: "aprobado"
      },
      select: {
        id: true,
        candidato: {
          select: {
            ci: true,
            nombre: true,
            telefono: true,
            email: true
          }
        },
        plazaNombre: true
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    return Response.json(candidatosAprobados);
  } catch (error) {
    console.error("Error fetching candidatos aprobados:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener candidatos aprobados" }),
      { status: 500 }
    );
  }
}
