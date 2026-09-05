/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `daily_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_date_key" ON "daily_logs"("date");
