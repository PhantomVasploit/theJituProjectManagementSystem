USE ThejituProjectManagementDatabase;
GO

CREATE PROCEDURE deleteUserAccount(@id INT)
AS
BEGIN
    DELETE FROM usersTable WHERE id = @id
END;