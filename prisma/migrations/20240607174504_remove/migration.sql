/*
  Warnings:

  - You are about to drop the column `chefId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `chefId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Chef` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chef" DROP CONSTRAINT "Chef_userId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_chefId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_chefId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "chefId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "chefId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Chef";

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
