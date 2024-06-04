-- DropForeignKey
ALTER TABLE "SupplierLocation" DROP CONSTRAINT "SupplierLocation_supplierId_fkey";

-- AddForeignKey
ALTER TABLE "SupplierLocation" ADD CONSTRAINT "SupplierLocation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
