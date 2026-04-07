-- CreateTable
CREATE TABLE "TokenSeguimiento" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "expiracion" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenSeguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenSeguimiento_token_key" ON "TokenSeguimiento"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSeguimiento_candidatoId_key" ON "TokenSeguimiento"("candidatoId");

-- AddForeignKey
ALTER TABLE "TokenSeguimiento" ADD CONSTRAINT "TokenSeguimiento_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
