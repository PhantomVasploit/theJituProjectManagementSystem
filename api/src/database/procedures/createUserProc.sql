USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE createNewUserPROC(@first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255), @password VARCHAR(MAX))
AS
BEGIN
    INSERT INTO usersTable(first_name, last_name, email, password)
    VALUES(@first_name, @last_name, @email, @password)
END
GO