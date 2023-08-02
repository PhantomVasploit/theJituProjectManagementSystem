USE ThejituProjectManagementDatabase;
GO


CREATE OR ALTER PROCEDURE deleteUserProc(@id INT)
AS
BEGIN
    DELETE
    FROM usersTable
    WHERE id = @id
END;