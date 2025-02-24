/*
  Warnings:

  - Changed the type of `voteType` on the `CommentVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "voteType",
ADD COLUMN     "voteType" "TypeOfVote" NOT NULL;
