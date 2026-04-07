import { prisma } from './prisma';

export async function getPlazasActivas() {
  const plazas = await prisma.plaza.findMany({
    where: { activo: true }
  });
  return plazas;
}
