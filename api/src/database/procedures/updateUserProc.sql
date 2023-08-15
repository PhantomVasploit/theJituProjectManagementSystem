USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE updateUserAccountPROC(@id INT, @first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255))
AS
BEGIN
    UPDATE usersTable SET first_name = @first_name, last_name = @last_name, email = @email WHERE id = @id AND is_admin = 0
END
GO

CREATE OR ALTER PROCEDURE approveUserAccountPROC(@id INT)
AS
BEGIN
    UPDATE usersTable SET is_verified = 1 WHERE id = @id
END