/*
  Warnings:

  - You are about to drop the column `draftsUsed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "draftsUsed",
ADD COLUMN     "everSubscribed" BOOLEAN NOT NULL DEFAULT false;