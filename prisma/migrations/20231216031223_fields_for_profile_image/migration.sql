/*
  Warnings:

  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profileImageKey" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
