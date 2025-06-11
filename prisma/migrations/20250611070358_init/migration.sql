-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITOYEN', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('BROUILLON', 'SOUMISE', 'RECUE', 'EN_TRAITEMENT', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "Urgence" AS ENUM ('FAIBLE', 'NORMALE', 'ELEVEE', 'CRITIQUE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITOYEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administration" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "adresse" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Administration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAdministration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "administrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAdministration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeAudience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "administrationId" TEXT NOT NULL,
    "objet" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateSouhaitee" TIMESTAMP(3),
    "statut" "StatutDemande" NOT NULL DEFAULT 'BROUILLON',
    "urgence" "Urgence" NOT NULL DEFAULT 'NORMALE',
    "numeroReference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccuseReception" (
    "id" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    "dateAccuse" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL,
    "generatedAutomatically" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AccuseReception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traitement" (
    "id" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    "treatedById" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "dateDecision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,
    "dateAudienceFixee" TIMESTAMP(3),
    "lieuAudience" TEXT,

    CONSTRAINT "Traitement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAdministration_userId_administrationId_key" ON "AdminAdministration"("userId", "administrationId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeAudience_numeroReference_key" ON "DemandeAudience"("numeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "AccuseReception_demandeId_key" ON "AccuseReception"("demandeId");

-- CreateIndex
CREATE UNIQUE INDEX "AccuseReception_reference_key" ON "AccuseReception"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Traitement_demandeId_key" ON "Traitement"("demandeId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- AddForeignKey
ALTER TABLE "Administration" ADD CONSTRAINT "Administration_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAdministration" ADD CONSTRAINT "AdminAdministration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAdministration" ADD CONSTRAINT "AdminAdministration_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAudience" ADD CONSTRAINT "DemandeAudience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAudience" ADD CONSTRAINT "DemandeAudience_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccuseReception" ADD CONSTRAINT "AccuseReception_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "DemandeAudience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traitement" ADD CONSTRAINT "Traitement_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "DemandeAudience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traitement" ADD CONSTRAINT "Traitement_treatedById_fkey" FOREIGN KEY ("treatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "DemandeAudience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformSetting" ADD CONSTRAINT "PlatformSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
