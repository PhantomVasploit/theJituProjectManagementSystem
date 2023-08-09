const mssql = require('mssql');
const { v4 } = require('uuid');
const { sqlConfig } = require('../config/database.connection.config');
const { createProject, get_projects } = require('../controller/projectsController');

// Mocking Express Request and Response
const req = {
    user: {
      is_admin: 1 // Assuming admin for testing
    },
    body: {
      project_name: 'Test Project',
      project_description: 'This is a test project',
      project_status: 'In Progress',
      start_date: '2023-08-10',
      end_date: '2023-08-20'
    }
  };

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
}

describe('Project Controller', () => {
    it('Shouuld Create a project Successfully', async () => {
        // Mocking mssql pool and request methods
        const mockedInput = jest.fn().mockReturnValue();
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

        const mockedRequest = {
            input : mockedInput,
            execute: mockedExecute
        }

        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };

        // Mocking mssql connection pool
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // calling the controller
        await createProject(req, res);

        req.user = {
            is_admin: 1
        }

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Project created successfully'
        });

        expect(mockedExecute).toHaveBeenCalledWith('sp_createProjectProc');
        expect(mockedInput).toHaveBeenCalledWith('id', expect.any(String));

    });

    it('should return an error response on database error', async () => {
      // Mocking mssql.connect to throw an error
      jest.spyOn(mssql, 'connect').mockRejectedValue(new Error('Database connection error'));
  
      // Call the function
      await createProject(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating project',
        error: 'Database connection error'
      });
    });
});


describe("Getting projects", () => {
    it("should return all projects", async () => {
        const mockProjects =  [
            {
                "id": "395a2471-c79f-4753-ae5c-891323b94c56",
                "project_name": "UI project Update",
                "project_description": "We will be wirking on The UI of the assigned project",
                "project_status": "Active",
                "is_allocated": false,
                "is_completed": false,
                "start_date": "2023-08-10T00:00:00.000Z",
                "end_date": "2023-08-11T00:00:00.000Z",
                "created_at": "2023-08-09T15:58:29.477Z",
                "updated_at": "2023-08-09T15:58:29.477Z"
            },
            {
                "id": "3ae2f5e4-e741-43a9-9743-296f127e234f",
                "project_name": "UI project Update",
                "project_description": "We will be wirking on The UI of the assigned project",
                "project_status": "Completed",
                "is_allocated": false,
                "is_completed": true,
                "start_date": "2023-08-10T00:00:00.000Z",
                "end_date": "2023-08-11T00:00:00.000Z",
                "created_at": "2023-08-09T15:58:27.460Z",
                "updated_at": "2023-08-09T15:58:27.460Z"
            }
        ];

        const req = {}

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({ 
                recordset: mockProjects
            })
        });

        // simulate user is admin
        req.user = {
            is_admin: 1
        }

        await get_projects(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Projects retrieved successfully',
            projects: mockProjects
        });
    });

    it("should return an error if user is not admin", async () => {
        const req = {}

        req.user = {
            is_admin: 0
        }

        await get_projects(req, res);

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: []
            })
        });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access Denied'
        });
    });
});