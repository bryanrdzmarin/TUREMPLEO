-- CreateTable
CREATE TABLE "Plaza" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'abierta',
    "hotelId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plaza_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plaza" ADD CONSTRAINT "Plaza_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
