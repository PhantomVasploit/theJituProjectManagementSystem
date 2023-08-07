CREATE PROCEDURE fetchAllUser
AS
BEGIN
    SELECT * FROM usersTable WHERE is_admin = 0;
END