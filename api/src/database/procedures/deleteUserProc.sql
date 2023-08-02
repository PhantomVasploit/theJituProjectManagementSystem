CREATE PROCEDURE deleteUserAccount(@id INT)
AS
BEGIN
    DELETE FROM user_table WHERE id = @id
END;