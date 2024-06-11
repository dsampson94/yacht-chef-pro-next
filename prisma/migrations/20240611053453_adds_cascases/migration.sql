-- DropForeignKey
ALTER TABLE "SupplierIngredient" DROP CONSTRAINT "SupplierIngredient_ingredientId_fkey";

-- AddForeignKey
ALTER TABLE "SupplierIngredient" ADD CONSTRAINT "SupplierIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
