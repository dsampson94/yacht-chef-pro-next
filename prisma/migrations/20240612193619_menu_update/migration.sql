-- DropForeignKey
ALTER TABLE "MenuRecipe" DROP CONSTRAINT "MenuRecipe_menuId_fkey";

-- DropForeignKey
ALTER TABLE "MenuRecipe" DROP CONSTRAINT "MenuRecipe_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "MenuRecipe" ADD CONSTRAINT "MenuRecipe_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRecipe" ADD CONSTRAINT "MenuRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
