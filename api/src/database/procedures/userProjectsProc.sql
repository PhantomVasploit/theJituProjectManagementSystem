USE ThejituProjectManagementDatabase;
GO

CREATE PROCEDURE AllProjectsByUserProc
    @user_id INT
AS
BEGIN
    SELECT * FROM projectsTable WHERE id IN (
        SELECT project_id FROM projectUserTable WHERE user_id = @user_id
    )
END
GO
