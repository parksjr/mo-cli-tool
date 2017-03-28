-- ================================================
-- Template generated from the mo-cli-tool for 
-- postgrator. https://github.com/parksjr/mo-cli-tool
--
-- This file has placeholder CRUD procedures, 
-- specifically for getOne, getAll, createOne, 
-- updateOne, and deleteOne.
--
-- Make the necessary changes to fulfill your needs.
--
-- Dont forget to enter the undo sql commands in the 
-- matching undo file.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================


-- CREATE ONE
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>_createOne
	-- Add the parameters for the stored procedure here
	@param1 int,
  @param2 int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  -- sql statements go here
	insert into table_name (
    col1,
    col2
  )
  values (
    @param1,
    @param2
  )
END
GO

-- GET ONE
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>_getOne
	-- Add the parameters for the stored procedure here
  @id_param
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  -- sql statements go here
  select id_col, col1, col2 from table_name where id_col = @id_param

END
GO

-- GET ALL
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>_getAll
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  -- sql statements go here
  select id_col, col1, col2 from table_name
  
END
GO

-- UPDATE ONE
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>_updateOne
	-- Add the parameters for the stored procedure here
	@param1,
	@param2,
  @id_param
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  -- sql statements go here
  update table_name set 
    col1 = @param1,
    col2 = @param2
  where id_col = @id_param
END
GO

-- DELETE ONE
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>_deleteOne
	-- Add the parameters for the stored procedure here
	@id_param
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  -- sql statements go here
  delete from table_name
  where id_col = @id_param
END
GO