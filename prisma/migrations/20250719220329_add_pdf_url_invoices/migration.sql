/*
  Warnings:

  - Added the required column `pdf_url` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "pdf_url" VARCHAR(500) NOT NULL;
