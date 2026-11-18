-- Create ResearchReport table

CREATE TABLE "ResearchReport" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "researchType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "inputData" JSONB,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchReport_pkey" PRIMARY KEY ("id")
);

-- Create index for efficient report retrieval

CREATE INDEX "ResearchReport_appId_createdAt_idx"
ON "ResearchReport"("appId", "createdAt");

-- Add foreign key relationship to ManagedApp

ALTER TABLE "ResearchReport"
ADD CONSTRAINT "ResearchReport_appId_fkey"
FOREIGN KEY ("appId")
REFERENCES "ManagedApp"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;