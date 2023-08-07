USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE fetchUserByEmailPROC(@email VARCHAR(255))
AS
BEGIN
    SELECT * FROM usersTable WHERE email = @email
END
GO

EXEC fetchUserByEmailPROC 'devop047@gmail.com'