/*
  Warnings:

  - You are about to drop the column `colorPelo` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `colorPiel` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `cursos` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `edad` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `especialidad` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `estadoCivil` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `estatura` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `experienciaTurismo` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `fuenteProcedencia` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `haTrabajadoTurismo` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `idiomas` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `licenciaConduccion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `municipio` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `municipioNacimiento` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `nivelEscolar` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `nombreMadre` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `nombrePadre` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `otraFuente` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `profesiones` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `provincia` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `reparto` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `telefonoFamiliar` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `telefonoLaboral` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `telefonoParticular` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `trayectoriaPolitica` on the `Solicitud` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "colorPelo" TEXT,
ADD COLUMN     "colorPiel" TEXT,
ADD COLUMN     "cursos" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "edad" INTEGER,
ADD COLUMN     "especialidad" TEXT,
ADD COLUMN     "estadoCivil" TEXT,
ADD COLUMN     "estatura" DOUBLE PRECISION,
ADD COLUMN     "experienciaTurismo" TEXT,
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
ADD COLUMN     "profesiones" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "reparto" TEXT,
ADD COLUMN     "sexo" TEXT,
ADD COLUMN     "telefonoFamiliar" TEXT,
ADD COLUMN     "telefonoLaboral" TEXT,
ADD COLUMN     "telefonoParticular" TEXT,
ADD COLUMN     "trayectoriaPolitica" TEXT;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "colorPelo",
DROP COLUMN "colorPiel",
DROP COLUMN "cursos",
DROP COLUMN "direccion",
DROP COLUMN "edad",
DROP COLUMN "especialidad",
DROP COLUMN "estadoCivil",
DROP COLUMN "estatura",
DROP COLUMN "experienciaTurismo",
DROP COLUMN "fechaNacimiento",
DROP COLUMN "fuenteProcedencia",
DROP COLUMN "haTrabajadoTurismo",
DROP COLUMN "idiomas",
DROP COLUMN "licenciaConduccion",
DROP COLUMN "municipio",
DROP COLUMN "municipioNacimiento",
DROP COLUMN "nivelEscolar",
DROP COLUMN "nombreMadre",
DROP COLUMN "nombrePadre",
DROP COLUMN "otraFuente",
DROP COLUMN "peso",
DROP COLUMN "profesiones",
DROP COLUMN "provincia",
DROP COLUMN "reparto",
DROP COLUMN "sexo",
DROP COLUMN "telefonoFamiliar",
DROP COLUMN "telefonoLaboral",
DROP COLUMN "telefonoParticular",
DROP COLUMN "trayectoriaPolitica",
ADD COLUMN     "motivoDenegacion" TEXT;

-- CreateTable
CREATE TABLE "InformacionCan" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "titulacion" TEXT,
    "oficios" TEXT,
    "idiomas" TEXT,
    "nivel" TEXT,
    "lugar" TEXT,
    "cursos" TEXT,
    "faltantes" TEXT,
    "licencia" TEXT,
    "comunitaria" TEXT,
    "intrabajo" TEXT,
    "resultado" TEXT,
    "desempeno" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformacionCan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InformacionCan_solicitudId_key" ON "InformacionCan"("solicitudId");

-- AddForeignKey
ALTER TABLE "InformacionCan" ADD CONSTRAINT "InformacionCan_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
