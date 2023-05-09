/*
  Warnings:

  - You are about to drop the column `isQuest` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `manaCost` on the `Card` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Card] DROP COLUMN [isQuest],
[manaCost];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
