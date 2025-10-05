-- DropForeignKey
ALTER TABLE "public"."DailyEarning" DROP CONSTRAINT "DailyEarning_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "DailyEarning" ADD CONSTRAINT "DailyEarning_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
