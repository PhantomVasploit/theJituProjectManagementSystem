USE ThejituProjectManagementDatabase;
GO

DROP TABLE IF EXISTS usersTable;

CREATE TABLE usersTable(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(MAX) NOT NULL,
    is_verified BIT DEFAULT 0,
    is_admin BIT DEFAULT 0
)

ALTER TABLE usersTable
ADD CONSTRAINT unique_email UNIQUE(email);


-- Creating admin
-- INSERT INTO usersTable(first_name, last_name, email, is_verified, is_admin)
-- VALUES('Phantom', 'Jinx', 'phantom@gmail.com', 1, 1);

-- SELECT * FROM usersTable;

-- DROP TABLE usersTable;

