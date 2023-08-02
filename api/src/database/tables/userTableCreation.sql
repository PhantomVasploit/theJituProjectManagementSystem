USE ThejituProjectManagementDatabase;
GO

<<<<<<< HEAD
BEGIN TRY
    CREATE TABLE usersTable(
        id INT IDENTITY(1, 1) PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        is_verified BIT DEFAULT 0,
        is_admin BIT DEFAULT 0
    )
END TRY
BEGIN CATCH
    PRINT 'Error while creating usersTable';
END CATCH;
=======

CREATE TABLE usersTable(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(MAX) NOT NULL,
    is_verified BIT DEFAULT 0,
    is_admin BIT DEFAULT 0
)
>>>>>>> 5135f9c057e15895db2ef4e473fa4103a936df85

-- Creating admin
-- INSERT INTO usersTable(first_name, last_name, email, is_verified, is_admin)
-- VALUES('Phantom', 'Jinx', 'phantom@gmail.com', 1, 1);

-- SELECT * FROM usersTable;

-- DROP TABLE usersTable;
