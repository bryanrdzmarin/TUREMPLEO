import { prisma } from './prisma';

export async function getPlazasActivas() {
  const plazas = await prisma.plaza.findMany({
    where: { 
      activo: true,
      eliminado: false
    }
  });
  return plazas;
}
