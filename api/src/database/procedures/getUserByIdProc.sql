CREATE PROCEDURE fetchUserByIdPROC(@id INT)
AS
BEGIN
    SELECT * FROM user_table WHERE id = @id AND is_admin = 0
END