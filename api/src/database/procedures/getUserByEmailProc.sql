USE ThejituProjectManagementDatabase;
GO


CREATE OR ALTER PROCEDURE getUserByEmailProc(@email VARCHAR(255))
AS
BEGIN
    SELECT *
    FROM usersTable
    WHERE email = @email
END;

-- EXEC getUserByEmailProc 'phantom@gmail.com';