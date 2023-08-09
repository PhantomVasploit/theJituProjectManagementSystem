USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE fetchUserByIdPROC(@id INT)
AS
BEGIN
    SELECT * FROM usersTable WHERE id = @id AND is_admin = 0
END
GO

EXEC fetchUserByIdPROC 3
GO

CREATE OR ALTER PROCEDURE fetchAllUsersPROC
AS
BEGIN
    SELECT * FROM usersTable WHERE is_admin = 0
END
GO

CREATE OR ALTER PROCEDURE fetchNewUsersPROC
AS
BEGIN
    SELECT * FROM usersTable WHERE is_admin = 0 AND is_verified = 0
END
GO

CREATE OR ALTER PROCEDURE upgradeUserToAdminPROC(@email VARCHAR(255))
AS
BEGIN
    UPDATE usersTable SET is_admin = 1 WHERE email = @email
END
GO

EXEC upgradeUserToAdminPROC 'devop047@gmail.com'
GO