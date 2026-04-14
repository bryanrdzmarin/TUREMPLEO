/*
  Warnings:

  - You are about to drop the `TokenSeguimiento` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ci]` on the table `Candidato` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[candidatoId,plazaId]` on the table `Solicitud` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ci` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plazaNombre` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TokenSeguimiento" DROP CONSTRAINT "TokenSeguimiento_candidatoId_fkey";

-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "ci" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "citado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "colorPelo" TEXT,
ADD COLUMN     "colorPiel" TEXT,
ADD COLUMN     "cursos" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "edad" INTEGER,
ADD COLUMN     "entrevistaPasada" BOOLEAN,
ADD COLUMN     "especialidad" TEXT,
ADD COLUMN     "estadoCivil" TEXT,
ADD COLUMN     "estatura" DOUBLE PRECISION,
ADD COLUMN     "experienciaTurismo" TEXT,
ADD COLUMN     "fechaEvaluacion" TIMESTAMP(3),
ADD COLUMN     "fechaNacimiento" TEXT,
ADD COLUMN     "fuenteProcedencia" TEXT,
ADD COLUMN     "haTrabajadoTurismo" BOOLEAN,
ADD COLUMN     "idiomas" TEXT,
ADD COLUMN     "licenciaConduccion" TEXT,
ADD COLUMN     "municipio" TEXT,
ADD COLUMN     "municipioNacimiento" TEXT,
ADD COLUMN     "nivelEscolar" TEXT,
ADD COLUMN     "nombreMadre" TEXT,
ADD COLUMN     "nombrePadre" TEXT,
ADD COLUMN     "otraFuente" TEXT,
ADD COLUMN     "peso" DOUBLE PRECISION,
ADD COLUMN     "pin" TEXT,
ADD COLUMN     "plazaNombre" TEXT NOT NULL,
ADD COLUMN     "profesiones" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "reparto" TEXT,
ADD COLUMN     "requisitosCumplidos" TEXT,
ADD COLUMN     "sexo" TEXT,
ADD COLUMN     "telefonoFamiliar" TEXT,
ADD COLUMN     "telefonoLaboral" TEXT,
ADD COLUMN     "telefonoParticular" TEXT,
ADD COLUMN     "trayectoriaPolitica" TEXT;

-- DropTable
DROP TABLE "TokenSeguimiento";

-- CreateTable
CREATE TABLE "Cita" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "fechaCita" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cita_solicitudId_key" ON "Cita"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_ci_key" ON "Candidato"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_candidatoId_plazaId_key" ON "Solicitud"("candidatoId", "plazaId");

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
