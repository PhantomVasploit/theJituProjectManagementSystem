CREATE OR ALTER PROCEDURE getUserByIDProc(@id INT)
AS
BEGIN
    SELECT first_name, last_name, email
    FROM usersTable
    WHERE id = @id
END;