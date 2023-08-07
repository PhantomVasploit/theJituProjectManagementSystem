USE ThejituProjectManagementDatabase;
GO

CREATE PROCEDURE fetchUserByEmailPROC(@email VARCHAR(255))
AS
BEGIN
    SELECT * FROM user_table WHERE email = @email
END