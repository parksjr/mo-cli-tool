-- ================================================
-- Template generated from the mo-cli-tool for 
-- postgrator. https://github.com/parksjr/mo-cli-tool
--
-- This file is a placeholder for creating a table.
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

CREATE TABLE table_name (
  id_col int IDENTITY(1,1) NOT NULL,
  col1 int NULL,
  col2 int NULL,
  CONSTRAINT PK_table_name PRIMARY KEY CLUSTERED 
  (
	  id ASC
  )
  WITH 
  (
    PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON
  ) 
  ON [PRIMARY]
) 
ON [PRIMARY]

GO


