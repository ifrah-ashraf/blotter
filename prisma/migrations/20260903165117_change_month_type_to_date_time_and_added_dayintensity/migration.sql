/*
  Warnings:

  - Added the required column `day_intensity` to the `daily_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `monthly_goals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "daily_logs" ADD COLUMN     "day_intensity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monthly_goals" DROP COLUMN "month",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "monthly_goals_month_key" ON "monthly_goals"("month");
