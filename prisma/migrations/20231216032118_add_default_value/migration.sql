/*
  Warnings:

  - Made the column `profileImageUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImageUrl" SET NOT NULL,
ALTER COLUMN "profileImageUrl" SET DEFAULT 'https://th.bing.com/th/id/OIP.hcRhDT8KVqzySjYJmBhlzgHaHa?rs=1&pid=ImgDetMain';
