/*
  Warnings:

  - You are about to drop the column `files` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "files",
ADD COLUMN     "file" TEXT;
