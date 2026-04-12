import { prisma } from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const citadoParam = searchParams.get("citado");
    const entrevistaParam = searchParams.get("entrevistaPasada");

    let candidatos;

    if (citadoParam === "false") {
      candidatos = await prisma.solicitud.findMany({
        where: {
          estado: "aprobado",
          citado: false,
          entrevistaPasada: null
        },
        select: {
          id: true,
          estado: true,
          citado: true,
          entrevistaPasada: true,
          candidato: {
            select: {
              ci: true,
              nombre: true,
              telefono: true,
              email: true
            }
          },
          plazaNombre: true,
          plaza: {
            select: {
              requisitos: true
            }
          },
          cita: {
            select: {
              id: true,
              fechaCita: true,
              requisitos: true,
              direccion: true
            }
          }
        },
        orderBy: {
          creadoEn: "desc"
        }
      });
    } else if (citadoParam === "true") {
      candidatos = await prisma.solicitud.findMany({
        where: {
          estado: "aprobado",
          citado: true,
          entrevistaPasada: null
        },
        select: {
          id: true,
          estado: true,
          citado: true,
          entrevistaPasada: true,
          candidato: {
            select: {
              ci: true,
              nombre: true,
              telefono: true,
              email: true
            }
          },
          plazaNombre: true,
          plaza: {
            select: {
              requisitos: true
            }
          },
          cita: {
            select: {
              id: true,
              fechaCita: true,
              requisitos: true,
              direccion: true
            }
          }
        },
        orderBy: {
          creadoEn: "desc"
        }
      });
    } else if (entrevistaParam === "true") {
      candidatos = await prisma.solicitud.findMany({
        where: {
          estado: "aprobado",
          citado: true,
          entrevistaPasada: true
        },
        select: {
          id: true,
          estado: true,
          citado: true,
          entrevistaPasada: true,
          candidato: {
            select: {
              ci: true,
              nombre: true,
              telefono: true,
              email: true
            }
          },
          plazaNombre: true,
          plaza: {
            select: {
              requisitos: true
            }
          },
          cita: {
            select: {
              id: true,
              fechaCita: true,
              requisitos: true,
              direccion: true
            }
          }
        },
        orderBy: {
          fechaEvaluacion: "desc"
        }
      });
    } else if (entrevistaParam === "false") {
      candidatos = await prisma.solicitud.findMany({
        where: {
          estado: "aprobado",
          citado: true,
          entrevistaPasada: false
        },
        select: {
          id: true,
          estado: true,
          citado: true,
          entrevistaPasada: true,
          candidato: {
            select: {
              ci: true,
              nombre: true,
              telefono: true,
              email: true
            }
          },
          plazaNombre: true,
          plaza: {
            select: {
              requisitos: true
            }
          },
          cita: {
            select: {
              id: true,
              fechaCita: true,
              requisitos: true,
              direccion: true
            }
          }
        },
        orderBy: {
          fechaEvaluacion: "desc"
        }
      });
    } else {
      candidatos = await prisma.solicitud.findMany({
        where: { estado: "aprobado" },
        select: {
          id: true,
          estado: true,
          citado: true,
          entrevistaPasada: true,
          candidato: {
            select: {
              ci: true,
              nombre: true,
              telefono: true,
              email: true
            }
          },
          plazaNombre: true,
          plaza: {
            select: {
              requisitos: true
            }
          },
          cita: {
            select: {
              id: true,
              fechaCita: true,
              requisitos: true,
              direccion: true
            }
          }
        },
        orderBy: {
          creadoEn: "desc"
        }
      });
    }

    return Response.json(candidatos);
  } catch (error) {
    console.error("Error fetching candidatos:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener candidatos" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { id, entrevistaPasada } = body;

    if (id === undefined || entrevistaPasada === undefined) {
      return new Response(
        JSON.stringify({ error: "Se requiere id y entrevistaPasada" }),
        { status: 400 }
      );
    }

    if (typeof entrevistaPasada !== "boolean") {
      return new Response(
        JSON.stringify({ error: "entrevistaPasada debe ser true o false" }),
        { status: 400 }
      );
    }

    const candidato = await prisma.solicitud.update({
      where: { id },
      data: { 
        entrevistaPasada,
        fechaEvaluacion: new Date()
      }
    });

    return Response.json(candidato);
  } catch (error) {
    console.error("Error updating candidato:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar candidato" }),
      { status: 500 }
    );
  }
}
