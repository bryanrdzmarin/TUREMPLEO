/**
 * seed-admin.ts - Crea el primer usuario admin en la base de datos.
 * Ejecutar con: pnpm seed
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth-server";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@turempleo.cu";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NOMBRE = "Administrador";

async function main() {
  const existente = await prisma.usuario.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existente) {
    if (!existente.nombreUsuario) {
      console.log("Actualizando admin existente con nombreUsuario y contraseña...");
    } else {
      console.log("Actualizando contraseña del admin...");
    }
    const hash = await hashPassword(ADMIN_PASSWORD);
    await prisma.usuario.update({
      where: { id: existente.id },
      data: {
        nombreUsuario: ADMIN_USERNAME,
        password: hash,
      },
    });
    console.log("  Usuario:", ADMIN_USERNAME);
    console.log("  Email:", ADMIN_EMAIL);
    console.log("  Password:", ADMIN_PASSWORD);
    return;
  }

  const hash = await hashPassword(ADMIN_PASSWORD);

  await prisma.usuario.create({
    data: {
      nombre: ADMIN_NOMBRE,
      nombreUsuario: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hash,
      rol: "admin",
    },
  });

  console.log("Usuario admin creado exitosamente");
  console.log(`   Usuario: ${ADMIN_USERNAME}`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log("   Cambia la contraseña despues de tu primer login");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
