
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "keycloakIssuer" TEXT;
ALTER TABLE "Admin" ADD COLUMN "keycloakSubject" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_keycloakIssuer_keycloakSubject_key"
ON "Admin"("keycloakIssuer", "keycloakSubject");
