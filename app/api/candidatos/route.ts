import { prisma } from "@/lib/prisma";
import { sendAprobacionEmail } from "@/lib/email";
import { getUserFromRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { ACCIONES_AUDITORIA, ENTIDADES_AUDITORIA } from "@/lib/audit-constants";

async function getAuthUserId(request: Request): Promise<number | undefined> {
  const payload = await getUserFromRequest(request as any);
  return payload?.userId;
}

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

    const solicitudActual = await prisma.solicitud.findUnique({
      where: { id },
      include: {
        candidato: {
          select: {
            nombre: true,
            email: true
          }
        }
      }
    });

    if (!solicitudActual) {
      return new Response(
        JSON.stringify({ error: "Solicitud no encontrada" }),
        { status: 404 }
      );
    }

    const candidato = await prisma.solicitud.update({
      where: { id },
      data: { 
        entrevistaPasada,
        fechaEvaluacion: new Date()
      }
    });

    if (entrevistaPasada && solicitudActual.candidato.email) {
      const emailEnviado = await sendAprobacionEmail(
        solicitudActual.candidato.email,
        solicitudActual.candidato.nombre,
        solicitudActual.plazaNombre
      );
      
      if (!emailEnviado) {
        console.warn("No se pudo enviar el email de aprobación al candidato:", solicitudActual.candidato.email);
      }
    }

    const userId = await getAuthUserId(request);
    await logAudit({
      userId,
      accion: entrevistaPasada ? ACCIONES_AUDITORIA.MARCAR_ENTREVISTA_PASADA : ACCIONES_AUDITORIA.MARCAR_ENTREVISTA_RECHAZADA,
      entidad: ENTIDADES_AUDITORIA.SOLICITUD,
      entidadId: id,
      detalles: { candidato: solicitudActual.candidato.nombre, plaza: solicitudActual.plazaNombre },
      request,
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
