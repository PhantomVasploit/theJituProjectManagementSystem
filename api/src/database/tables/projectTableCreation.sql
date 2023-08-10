USE ThejituProjectManagementDatabase;

DROP TABLE IF EXISTS projectsTable;

BEGIN TRY
    CREATE TABLE projectsTable (
        id VARCHAR(255) PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        project_description VARCHAR(255) NOT NULL,
        project_status VARCHAR(255) NOT NULL,
        is_allocated BIT DEFAULT 0,
        is_completed BIT DEFAULT 0,
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
END TRY
BEGIN CATCH
    PRINT 'Error while creating projectsTable';
END CATCH;
GO

DROP TABLE IF EXISTS projectUserTable;

BEGIN TRY
    CREATE TABLE projectUserTable (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        date_allocated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projectsTable(id),
        FOREIGN KEY (user_id) REFERENCES usersTable(id)
    )
END TRY
BEGIN CATCH
    PRINT 'Error while creating projectUserTable';
END CATCH;
GO





