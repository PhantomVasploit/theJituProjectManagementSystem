USE ThejituProjectManagementDatabase;
GO

CREATE OR ALTER PROCEDURE sp_createProjectProc
    @id VARCHAR(255),
    @project_name VARCHAR(255),
    @project_description VARCHAR(255),
    @project_status VARCHAR(255),
    @start_date DATETIME,
    @end_date DATETIME
AS
BEGIN
    INSERT INTO projectsTable (id, project_name, project_description, project_status, start_date, end_date)
    VALUES (@id, @project_name, @project_description, @project_status, @start_date, @end_date)
END
GO

-- procedure to get all projects
CREATE OR ALTER PROCEDURE sp_getAllProjectsProc
AS
BEGIN
    SELECT * FROM projectsTable
END
GO


-- procedure to get a project by id
CREATE OR ALTER PROCEDURE getProjectById
    @id VARCHAR(255)
AS
BEGIN
    SELECT * FROM projectsTable WHERE id = @id
END
GO

-- procedure to update a project
CREATE OR ALTER PROCEDURE sp_updateProjectProc
    @id VARCHAR(255),
    @project_name VARCHAR(255),
    @project_description VARCHAR(255),
    @project_status VARCHAR(255),
    @is_allocated BIT,
    @is_completed BIT,
    @start_date DATETIME,
    @end_date DATETIME
AS
BEGIN
    UPDATE projectsTable SET project_name = @project_name, project_description = @project_description, project_status = @project_status, is_allocated = @is_allocated, is_completed = @is_completed, start_date = @start_date, end_date = @end_date WHERE id = @id
END
GO

-- procedure to delete a project
CREATE OR ALTER PROCEDURE deleteProject
    @id VARCHAR(255)
AS
BEGIN
    DELETE FROM projectsTable WHERE id = @id
END
GO


-- procedure to allocate a user to a project

CREATE OR ALTER PROCEDURE assignUserToProject
    @id VARCHAR(255),
    @project_id VARCHAR(255),
    @user_id INT
AS
BEGIN
    INSERT INTO projectUserTable (id, project_id, user_id)
    VALUES (@id, @project_id, @user_id)
END
GO

CREATE OR ALTER PROCEDURE getProjectUsers
    @project_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM projectUserTable WHERE project_id = @project_id
END
GO

CREATE OR ALTER PROCEDURE removeUserFromProject
    @id VARCHAR(255)
AS
BEGIN
    DELETE FROM projectUserTable WHERE id = @id
END
GO

CREATE OR ALTER PROCEDURE checkAvailabileUsers
    @project_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM usersTable WHERE id NOT IN (
        SELECT user_id FROM projectUserTable WHERE project_id = @project_id)
END
GO


CREATE OR ALTER PROCEDURE markProjectAsCompleted
    @id VARCHAR(255)
AS
BEGIN
    UPDATE projectsTable SET is_completed = 1, project_status = 'Completed' WHERE id = @id
END
GO