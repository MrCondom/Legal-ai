-- CreateTable
CREATE TABLE "CreditPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purchaseToken" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditPurchase_purchaseToken_key"
ON "CreditPurchase"("purchaseToken");

-- CreateIndex
CREATE INDEX "CreditPurchase_userId_idx"
ON "CreditPurchase"("userId");

-- AddForeignKey
ALTER TABLE "CreditPurchase"
ADD CONSTRAINT "CreditPurchase_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;