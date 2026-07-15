-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "clientId" TEXT;

-- AlterTable
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProductCategories_AB_unique";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
