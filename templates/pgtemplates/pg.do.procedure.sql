-- ================================================
-- Template generated from the mo-cli-tool for 
-- postgrator. https://github.com/parksjr/mo-cli-tool
--
-- This file is a placeholder for creating a new
-- stored procedure.
--
-- Make the necessary changes to fulfill your needs.
--
-- Dont forget to enter the undo sql commands in the 
-- matching undo file.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <ProcedureName>
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