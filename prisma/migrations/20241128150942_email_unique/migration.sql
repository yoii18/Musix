/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserSchema` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_email_key" ON "UserSchema"("email");
