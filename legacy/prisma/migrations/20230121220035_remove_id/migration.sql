/*
  Warnings:

  - The primary key for the `Chatter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Chatter` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Chatter] DROP CONSTRAINT [Chatter_id_key];

-- AlterTable
ALTER TABLE [dbo].[Chatter] DROP CONSTRAINT [Chatter_pkey];
ALTER TABLE [dbo].[Chatter] DROP COLUMN [id];
ALTER TABLE [dbo].[Chatter] ADD CONSTRAINT Chatter_pkey PRIMARY KEY CLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
