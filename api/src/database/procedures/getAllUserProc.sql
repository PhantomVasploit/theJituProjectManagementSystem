USE ThejituProjectManagementDatabase;
GO

CREATE PROCEDURE fetchAllUsers
AS
BEGIN
    SELECT * FROM usersTable WHERE is_admin = 0;
END

SELECT * FROM usersTable;
