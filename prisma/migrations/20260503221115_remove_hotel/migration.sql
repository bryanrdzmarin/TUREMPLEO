/*
  Warnings:

  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualizadoEn` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plaza" ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "archivado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "citadoDesdeReserva" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Hotel";
