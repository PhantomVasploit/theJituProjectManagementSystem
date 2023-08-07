USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE createNewAdminPROC(
    @first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255), @password VARCHAR(MAX))
AS
BEGIN
    INSERT INTO usersTable(first_name, last_name, email, password, is_verified, is_admin)
    VALUES(@first_name, @last_name, @email, @password, 1, 1)
END
GO


CREATE OR ALTER PROCEDURE upgradeUserToAdminPROC(@user_id INT)
AS
BEGIN
    UPDATE usersTable
    SET is_admin = 1
    WHERE id = @user_id
END
GO

CREATE OR ALTER PROCEDURE downgradeAdminToUserPROC(@user_id INT)
AS
BEGIN
    UPDATE usersTable
    SET is_admin = 0
    WHERE id = @user_id
END
GO

CREATE OR ALTER PROCEDURE upgradeUserToAdminUsingEmailPROC(@email VARCHAR)
AS
BEGIN
    UPDATE usersTable
    SET is_admin = 1
    WHERE email = @email
END
GO

EXEC upgradeUserToAdminUsingEmailPROC @email = 'devop047@gmail.com';