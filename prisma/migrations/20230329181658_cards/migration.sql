BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[MinionType] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [MinionType_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [MinionType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MinionType_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Card] (
    [id] INT NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [health] INT NOT NULL,
    [attack] INT,
    [manaCost] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [tier] INT,
    [isHero] BIT NOT NULL,
    [isQuest] BIT NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Card_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [Card_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Card_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TypesOnCards] (
    [cardId] INT NOT NULL,
    [minionTypeId] INT NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [TypesOnCards_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [TypesOnCards_pkey] PRIMARY KEY CLUSTERED ([cardId],[minionTypeId])
);

-- AddForeignKey
ALTER TABLE [dbo].[TypesOnCards] ADD CONSTRAINT [TypesOnCards_cardId_fkey] FOREIGN KEY ([cardId]) REFERENCES [dbo].[Card]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TypesOnCards] ADD CONSTRAINT [TypesOnCards_minionTypeId_fkey] FOREIGN KEY ([minionTypeId]) REFERENCES [dbo].[MinionType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
