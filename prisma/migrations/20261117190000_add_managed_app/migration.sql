CREATE TABLE "ManagedApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "playStoreUrl" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "targetAudience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedApp_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ManagedApp_packageName_key"
ON "ManagedApp"("packageName");

CREATE INDEX "ManagedApp_name_idx"
ON "ManagedApp"("name");