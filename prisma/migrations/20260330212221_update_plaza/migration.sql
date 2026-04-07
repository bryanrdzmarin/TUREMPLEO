/*
  Warnings:

  - You are about to drop the column `creadoEn` on the `Plaza` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Plaza` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Plaza` table. All the data in the column will be lost.
  - You are about to drop the column `hotelId` on the `Plaza` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Plaza` table. All the data in the column will be lost.
  - You are about to drop the column `plazaId` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `funciones` to the `Plaza` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Plaza` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requisitos` to the `Plaza` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plaza" DROP CONSTRAINT "Plaza_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_plazaId_fkey";

-- AlterTable
ALTER TABLE "Plaza" DROP COLUMN "creadoEn",
DROP COLUMN "descripcion",
DROP COLUMN "estado",
DROP COLUMN "hotelId",
DROP COLUMN "titulo",
ADD COLUMN     "funciones" TEXT NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "requisitos" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "plazaId";
