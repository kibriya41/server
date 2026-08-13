-- AlterTable: Add slug to categories
ALTER TABLE "categories" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable: Add createdAt/updatedAt to order_items
ALTER TABLE "order_items" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Add slug to products
ALTER TABLE "products" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable: Make comment NOT NULL on reviews (set existing NULLs to empty string first)
UPDATE "reviews" SET "comment" = '' WHERE "comment" IS NULL;
ALTER TABLE "reviews" ALTER COLUMN "comment" SET NOT NULL;

-- CreateIndex: Unique slug on categories
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex: Index on categories name
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex: Index on categories slug
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex: Index on categories isDeleted
CREATE INDEX "categories_isDeleted_idx" ON "categories"("isDeleted");

-- CreateIndex: Index on orders isDeleted
CREATE INDEX "orders_isDeleted_idx" ON "orders"("isDeleted");

-- CreateIndex: Index on products name
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex: Index on products isDeleted
CREATE INDEX "products_isDeleted_idx" ON "products"("isDeleted");

-- CreateIndex: Index on reviews isDeleted
CREATE INDEX "reviews_isDeleted_idx" ON "reviews"("isDeleted");

-- CreateIndex: Unique constraint on reviews userId+productId
CREATE UNIQUE INDEX "reviews_userId_productId_key" ON "reviews"("userId", "productId");

-- CreateIndex: Index on users role
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex: Index on users isDeleted
CREATE INDEX "users_isDeleted_idx" ON "users"("isDeleted");
