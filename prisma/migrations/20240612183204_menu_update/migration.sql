/*
  Warnings:

  - You are about to drop the column `menuId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_menuId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "menuId";

-- CreateTable
CREATE TABLE "MenuRecipe" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "meal" TEXT NOT NULL,

    CONSTRAINT "MenuRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuRecipe_menuId_recipeId_day_meal_key" ON "MenuRecipe"("menuId", "recipeId", "day", "meal");

-- AddForeignKey
ALTER TABLE "MenuRecipe" ADD CONSTRAINT "MenuRecipe_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRecipe" ADD CONSTRAINT "MenuRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
