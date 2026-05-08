import { prisma } from "@/lib/prisma";

/**
 * /api/estadisticas - Endpoint que devuelve todas las estadísticas agregadas
 * para el dashboard de información estadística en una sola llamada.
 * Incluye: cards resumen, solicitudes por estado, solicitudes por plaza,
 * tendencia mensual, distribución por sexo y nivel escolar.
 */
export async function GET(): Promise<Response> {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const [
      totalPlazasActivas,
      totalSolicitudes,
      totalCandidatos,
      pendienteCita,
      citasPendientes,
      enReserva,
      citadosEntrevista,
      totalContratados,
      solicitudesPorEstado,
      solicitudesPorPlaza,
      tendenciaMensual,
      distribucionSexo,
      nivelEscolar,
    ] = await Promise.all([
      prisma.plaza.count({
        where: { activo: true, eliminado: false }
      }),

      prisma.solicitud.count({
        where: { archivado: false }
      }),

      prisma.candidato.count(),

      prisma.solicitud.count({
        where: { estado: "aprobado", citado: false, archivado: false }
      }),

      prisma.solicitud.count({
        where: { citado: true, entrevistaPasada: null, archivado: false }
      }),

      prisma.solicitud.count({
        where: { estado: "aprobado", entrevistaPasada: true, citado: true, citadoDesdeReserva: false, archivado: false }
      }),

      prisma.solicitud.count({
        where: { estado: "aprobado", citado: true, entrevistaPasada: true, citadoDesdeReserva: true, archivado: false }
      }),

      prisma.solicitud.count({
        where: { estado: "contratado", archivado: true }
      }),

      prisma.solicitud.groupBy({
        by: ["estado"],
        where: { archivado: false },
        _count: { estado: true }
      }),

      (async () => {
        const solicitudes = await prisma.solicitud.findMany({
          where: { archivado: false },
          select: { plazaId: true, plazaNombre: true }
        });

        const plazaMap = new Map<string, number>();
        solicitudes.forEach((s) => {
          const nombre = s.plazaNombre || "Sin nombre";
          plazaMap.set(nombre, (plazaMap.get(nombre) || 0) + 1);
        });

        return Array.from(plazaMap.entries())
          .map(([nombre, total]) => ({ nombre, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 8);
      })(),

      (async () => {
        const solicitudes = await prisma.solicitud.findMany({
          where: {
            creadoEn: { gte: twelveMonthsAgo },
          },
          select: { creadoEn: true }
        });

        const meses = [
          "Ene", "Feb", "Mar", "Abr", "May", "Jun",
          "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];

        const mesCount = new Map<string, number>();

        for (let i = 0; i < 12; i++) {
          const d = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
          const key = `${meses[d.getMonth()]} ${d.getFullYear()}`;
          mesCount.set(key, 0);
        }

        solicitudes.forEach((s) => {
          const fecha = new Date(s.creadoEn);
          const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
          if (mesCount.has(key)) {
            mesCount.set(key, mesCount.get(key)! + 1);
          }
        });

        return Array.from(mesCount.entries()).map(([mes, total]) => ({ mes, total }));
      })(),

      (async () => {
        const candidatos = await prisma.candidato.findMany({
          where: { sexo: { not: null } },
          select: { sexo: true }
        });

        const sexoMap = new Map<string, number>();
        candidatos.forEach((c) => {
          const key = c.sexo || "No especificado";
          sexoMap.set(key, (sexoMap.get(key) || 0) + 1);
        });

        return Array.from(sexoMap.entries()).map(([sexo, total]) => ({ sexo, total }));
      })(),

      (async () => {
        const candidatos = await prisma.candidato.findMany({
          where: { nivelEscolar: { not: null } },
          select: { nivelEscolar: true }
        });

        const nivelMap = new Map<string, number>();
        candidatos.forEach((c) => {
          const key = c.nivelEscolar || "No especificado";
          nivelMap.set(key, (nivelMap.get(key) || 0) + 1);
        });

        return Array.from(nivelMap.entries())
          .map(([nivel, total]) => ({ nivel, total }))
          .sort((a, b) => b.total - a.total);
      })(),
    ]);

    return Response.json({
      cards: {
        totalPlazasActivas,
        totalSolicitudes,
        totalCandidatos,
        pendienteCita,
        citasPendientes,
        enReserva,
        citadosEntrevista,
        totalContratados,
      },
      solicitudesPorEstado: solicitudesPorEstado.map((s) => ({
        estado: s.estado,
        total: s._count.estado
      })),
      solicitudesPorPlaza,
      tendenciaMensual,
      distribucionSexo,
      nivelEscolar,
    });
  } catch (error) {
    console.error("Error fetching estadisticas:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener estadísticas" }),
      { status: 500 }
    );
  }
}
