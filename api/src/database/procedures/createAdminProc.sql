USE ThejituProjectManagementDatabase;
GO

CREATE PROCEDURE createNewAdminPROC(@first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255), @password VARCHAR(MAX))
AS
BEGIN
    INSERT INTO user_table(first_name, last_name, email, password, is_verified, is_admin)
    VALUES(@first_name, @last_name, @email, @password, 1, 1)
END