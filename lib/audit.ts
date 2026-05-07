import { prisma } from "@/lib/prisma";
import { AccionAuditoria } from "@/lib/audit-constants";

interface LogAuditParams {
  userId?: number;
  accion: AccionAuditoria;
  entidad: string;
  entidadId?: number;
  detalles?: Record<string, unknown>;
  request?: Request;
}

function extractIP(request?: Request): string | null {
  if (!request) return null;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return null;
}

export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    const { userId, accion, entidad, entidadId, detalles, request } = params;
    const ip = extractIP(request);

    await prisma.auditLog.create({
      data: {
        usuarioId: userId ?? null,
        accion,
        entidad,
        entidadId: entidadId ?? null,
        detalles: detalles ? JSON.stringify(detalles) : null,
        ip,
      },
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
}
