/*
  Warnings:

  - You are about to drop the column `category` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;


UPDATE "campaigns" SET "categoryId" = 0 WHERE "categoryId" IS NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_categoryId_idx" ON "campaigns"("categoryId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
