-- AlterTable: Add nombreUsuario with a temporary default for existing rows
ALTER TABLE "Usuario" ADD COLUMN "nombreUsuario" TEXT NOT NULL DEFAULT 'usuario_001';

-- Set unique nombreUsuario for existing users based on their name
UPDATE "Usuario" SET "nombreUsuario" = LOWER(REPLACE("nombre", ' ', '_')) WHERE "nombreUsuario" = 'usuario_001';

-- Now enforce uniqueness
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- CreateTable: TokenResetPassword
CREATE TABLE "TokenResetPassword" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenResetPassword_token_key" ON "TokenResetPassword"("token");

-- AddForeignKey
ALTER TABLE "TokenResetPassword" ADD CONSTRAINT "TokenResetPassword_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
