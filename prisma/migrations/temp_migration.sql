-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" SERIAL NOT NULL,
    "ci" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaNacimiento" TEXT,
    "edad" INTEGER,
    "sexo" TEXT,
    "colorPiel" TEXT,
    "colorPelo" TEXT,
    "peso" DOUBLE PRECISION,
    "estatura" DOUBLE PRECISION,
    "estadoCivil" TEXT,
    "municipioNacimiento" TEXT,
    "nombrePadre" TEXT,
    "nombreMadre" TEXT,
    "direccion" TEXT,
    "reparto" TEXT,
    "municipio" TEXT,
    "provincia" TEXT,
    "telefonoParticular" TEXT,
    "telefonoLaboral" TEXT,
    "telefonoFamiliar" TEXT,
    "nivelEscolar" TEXT,
    "especialidad" TEXT,
    "profesiones" TEXT,
    "idiomas" TEXT,
    "cursos" TEXT,
    "licenciaConduccion" TEXT,
    "haTrabajadoTurismo" BOOLEAN,
    "experienciaTurismo" TEXT,
    "fuenteProcedencia" TEXT,
    "otraFuente" TEXT,
    "trayectoriaPolitica" TEXT,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plaza" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "funciones" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Plaza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "plazaId" INTEGER NOT NULL,
    "plazaNombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "requisitosCumplidos" TEXT,
    "motivoDenegacion" TEXT,
    "pin" TEXT,
    "citado" BOOLEAN NOT NULL DEFAULT false,
    "entrevistaPasada" BOOLEAN,
    "fechaEvaluacion" TIMESTAMP(3),
    "citadoDesdeReserva" BOOLEAN NOT NULL DEFAULT false,
    "archivado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "TokenResetPassword" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" INTEGER,
    "detalles" TEXT,
    "ip" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_ci_key" ON "Candidato"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_candidatoId_plazaId_key" ON "Solicitud"("candidatoId", "plazaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cita_solicitudId_key" ON "Cita"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "InformacionCan_solicitudId_key" ON "InformacionCan"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenResetPassword_token_key" ON "TokenResetPassword"("token");

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_plazaId_fkey" FOREIGN KEY ("plazaId") REFERENCES "Plaza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformacionCan" ADD CONSTRAINT "InformacionCan_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenResetPassword" ADD CONSTRAINT "TokenResetPassword_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

