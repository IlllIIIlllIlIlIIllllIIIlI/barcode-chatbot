/*
  Warnings:

  - You are about to drop the `TypesOnCards` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TypesOnCards] DROP CONSTRAINT [TypesOnCards_cardId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TypesOnCards] DROP CONSTRAINT [TypesOnCards_minionTypeId_fkey];

-- DropTable
DROP TABLE [dbo].[TypesOnCards];

-- CreateTable
CREATE TABLE [dbo].[_CardToMinionType] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CardToMinionType_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CardToMinionType_B_index] ON [dbo].[_CardToMinionType]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_CardToMinionType] ADD CONSTRAINT [_CardToMinionType_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Card]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CardToMinionType] ADD CONSTRAINT [_CardToMinionType_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[MinionType]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
