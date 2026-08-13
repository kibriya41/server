-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "slug" DROP DEFAULT;
