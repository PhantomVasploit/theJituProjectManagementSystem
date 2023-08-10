const mssql = require('mssql');
const { v4 } = require('uuid');
const { sqlConfig } = require('../src/controller/projectsController');
const { createProject, get_projects, projectDetails, updateProject, deleteProject } = require('../src/controller/projectsController');

// Mocking Express Request and Response
const req = {
        user: {
            is_admin: 1 // Assuming admin for testing
        },
        body: {
            project_name: 'Test Project Gift',
            project_description: 'This is a test project',
            project_status: 'In Progress',
            start_date: '2023-08-10',
            end_date: '2023-08-20'
        }
  };

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe('Testing Project Controller', () => {
    describe('Project Create', () => {
        it('Should Return an error if user is not admin', async () => {
            // Mocking Express Request and Response
            const req = {
                user: {
                    is_admin: 0 // Assuming admin for testing
                },
                body: {
                    project_name: 'Test Project',
                    project_description: 'This is a test project',
                    project_status: 'In Progress',
                    start_date: '2023-08-10',
                    end_date: '2023-08-20'
                }
            };
            // Call the function
            await createProject(req, res);
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });
    
        it('should return an error if all required fields are not provided', async () => {
            // Mocking Express Request and Response
            const req = {
                user: {
                    is_admin: 1 // Assuming admin for testing
                },
    
                body: {
                    project_name: '',
                    project_description: 'This is a test project',
                    project_status: 'In Progress',
                    start_date: '2023-08-10',
                    end_date: '2023-08-20'
                }
            };
    
            // Call the function
            await createProject(req, res);
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All fields are required'
            });
        });
    
        it('should create a project successfully', async () => {
            // Mocking mssql.connect to return a mock object
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            });
    
            // Call the function
            await createProject(req, res);
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project created successfully'
            });
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
        it("should return an error if user is not admin", async () => {
            const req = {}
    
            // simulate user is not admin
            req.user = {
                is_admin: 0
            }
    
            await get_projects(req, res);
    
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });
    
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
    
        it("should return an error response on database error", async () => {
            const req = {}
    
            // simulate user is admin
            req.user = {
                is_admin: 1
            }
    
            jest.spyOn(mssql, 'connect').mockRejectedValue(new Error('Database connection error'));
    
            await get_projects(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error retrieving projects',
                error: expect.anything()
            });
        });
        
    });

    describe("Getting a Single Project", () => {
        it("should return 401 if user is not admin", async () => {
            const req = {
                user: {
                    is_admin: 0
                },
            }
    
            await projectDetails(req, res);
    
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });

        it("should return 404 if project is not found", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ 
                    recordset: []
                })
            });
    
            await projectDetails(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project not found'
            });
        });

        it("should return project details", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                }
            }

            const mockProject =  {
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
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ 
                    recordset: [mockProject]
                })
            });
    
            await projectDetails(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project retrieved successfully',
                project: mockProject
            });
        });
    });

    describe("Updating a Project", () => {
        it("should return 401 if user is not admin", async () => {
            const req = {
                user: {
                    is_admin: 0
                },
            }
    
            await updateProject(req, res);
    
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });

        it("should return 400 if fields are provided", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                },
                body: {
                    project_name: 'UI project Update',
                    project_description: '',
                    project_status: 'Active',
                    is_allocated: false,
                    is_completed: false,
                    start_date: '2023-08-10T00:00:00.000Z',
                    end_date: '2023-08-11T00:00:00.000Z'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await updateProject(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing required fields'
            });
        });

        it("should return 404 if project is not found", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ 
                    recordset: []
                })
            });
    
            await updateProject(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project not found'
            });
        });

        it("should update project details", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                },
                body: {
                    project_name: 'UI project Update',
                    project_description: 'We will be wirking on The UI of the assigned project',
                    project_status: 'Active',
                    is_allocated: false,
                    is_completed: false,
                    start_date: '2023-08-10T00:00:00.000Z',
                    end_date: '2023-08-11T00:00:00.000Z'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            });

            await updateProject(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.json).toHaveBeenCalledWith({
            //     message: 'Project updated successfully'
            // });        
        });

        it("should return 500 if error occurs", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                },
                body: {
                    project_name: 'UI project Update',
                    project_description: 'We will be wirking on The UI of the assigned project',
                    project_status: 'Active',
                    is_allocated: false,
                    is_completed: false,
                    start_date: '2023-08-10T00:00:00.000Z',
                    end_date: '2023-08-11T00:00:00.000Z'
                }
            }

            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error('Error occurred'));
    
            await updateProject(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error updating project',
                error: expect.anything()
            });
        });
    });

    describe("Deleting a Project", () => {
        it("should return 401 if user is not admin", async () => {
            const req = {
                user: {
                    is_admin: 0
                },
            }
    
            await deleteProject(req, res);
    
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });

        it("should return 404 if project is not found", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project not found'
            });
        });

        it("should delete project", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-8913b94c56'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            });

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Project deleted successfully'
            });
        });

        it("should return 500 if error occurs", async () => {
            const req = {
                user: {
                    is_admin: 1
                },
                params: {
                    id: '395a2471-c79f-4753-ae5c-891323b94c56'
                }
            }

            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error('Error occurred'));
    
            await deleteProject(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error deleting project',
                error: expect.anything()
            });
        });
    });

});