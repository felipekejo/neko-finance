/*
  Warnings:

  - You are about to drop the column `create_at` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `subcategories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `subcategories` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `subcategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_owner_id_fkey";

-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "create_at",
DROP COLUMN "owner_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "create_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "create_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "subcategories" DROP COLUMN "create_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "create_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
