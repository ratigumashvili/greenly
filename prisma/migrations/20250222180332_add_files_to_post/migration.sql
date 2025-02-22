-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imagesUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];
