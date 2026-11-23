-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "keycloakIssuer" TEXT,
    "keycloakSubject" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Admin" ("createdAt", "email", "id", "keycloakIssuer", "keycloakSubject", "name", "passwordHash") SELECT "createdAt", "email", "id", "keycloakIssuer", "keycloakSubject", "name", "passwordHash" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE UNIQUE INDEX "Admin_keycloakIssuer_keycloakSubject_key" ON "Admin"("keycloakIssuer", "keycloakSubject");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

