CREATE OR ALTER PROCEDURE getUserByEmailProc(@email VARCHAR(255))
AS
BEGIN
    SELECT first_name, last_name, email
    FROM usersTable
    WHERE email = @email
END;