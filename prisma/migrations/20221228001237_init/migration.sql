BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Chatter] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [failedPyramids] INT NOT NULL,
    [successfulPyramids] INT NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Chatter_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [Chatter_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Chatter_username_key] UNIQUE NONCLUSTERED ([username])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
