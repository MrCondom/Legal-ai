CREATE TABLE "AiRequestUsage" (
    "id" BIGSERIAL NOT NULL,
    "application" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRequestUsage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiRequestUsage_application_createdAt_idx"
ON "AiRequestUsage" ("application", "createdAt");