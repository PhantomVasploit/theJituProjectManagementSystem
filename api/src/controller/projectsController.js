const mssql = require('mssql');
const {v4} = require('uuid');
const { sqlConfig } = require('../config/database.connection.config');


const createProject = async (req, res) => {
    try {
        // verify if user is admin given the token provided
        const { is_admin } = req.user;
        if (is_admin === 0) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }


        const { project_name, project_description, project_status, start_date, end_date } = req.body;

        // validate if all required fields are provided
        if (!project_name || !project_description || !project_status || !start_date || !end_date) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }
        
        const id = v4();

        const pool = await mssql.connect(sqlConfig);
        const new_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('project_name', mssql.VarChar, project_name)
            .input('project_description', mssql.VarChar, project_description)
            .input('project_status', mssql.VarChar, project_status)
            .input('start_date', mssql.Date, start_date)
            .input('end_date', mssql.Date, end_date)
            .execute('sp_createProjectProc');

        return res.status(201).json({
            message: 'Project created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating project',
            error: error.message
        });
    }
}


const get_projects = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const pool = await mssql.connect(sqlConfig);
        const projects = await pool.request()
            .execute('sp_getAllProjectsProc');

        return res.status(200).json({
            message: 'Projects retrieved successfully',
            projects: projects.recordset
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving projects',
            error: error
        });
    }
}

const projectDetails = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const { id } = req.params;

        const pool = await mssql.connect(sqlConfig);
        const project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('getProjectById');

        if (project.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        return res.status(200).json({
            message: 'Project retrieved successfully',
            project: project.recordset[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving project',
            error: error,
            status: 500
        });
    }
}


const updateProject = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }
        
        const { id } = req.params;
        const {
            project_name, 
            project_description, 
            project_status,
            start_date,
            end_date
        } = req.body;

        // validate all required fields are provided
        if (!project_name || !project_description || !project_status || !start_date || !end_date) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        const pool = await mssql.connect(sqlConfig);
        const updated_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('project_name', mssql.VarChar, project_name)
            .input('project_description', mssql.VarChar, project_description)
            .input('project_status', mssql.VarChar, project_status)
            .input('start_date', mssql.Date, start_date)
            .input('end_date', mssql.Date, end_date)
            .execute('sp_updateProjectProc');

        if (updated_project.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        // get updated project
        const project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('getProjectById');

        return res.status(200).json({
            message: 'Project updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating project',
            error: error
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const { id } = req.params;

        const pool = await mssql.connect(sqlConfig);
        const get_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('getProjectById');

        if (get_project.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const deleted_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('sp_deleteProjectProc');

        if (deleted_project.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        return res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting project',
            error: error.message
        });
    }
}

const assignUserProject = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const { id, user_id } = req.params;
        console.log(id, user_id);

        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, user_id)
            .execute('fetchUserByIdPROC');

        if (user.recordset.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // check if project exists
        const project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('getProjectById');

        if (project.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const queried_user = user.recordset[0];

        // check if user is already assigned to project
        if (queried_user.is_assigned) {
            return res.status(400).json({
                message: 'User is currently assigned to a project'
            });
        }

        const proj_user_id = v4();

        // assign user to project
        const assigned_user_project = await pool.request()
            .input('id', mssql.VarChar, proj_user_id)
            .input('user_id', mssql.VarChar, user_id)
            .input('project_id', mssql.VarChar, id)
            .execute('assignUserToProject');

        return res.status(200).json({
            message: 'User assigned to project successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error assigning user to project',
            error: error.message
        });
    }
}

const getAllProjectEverAssigned = async (req, res) => {
    try {
        // user can view all projects assigned to him/her
        const { user_id } = req.params;
        const {is_admin} = req.user;
        const authenticated_user_id = req.user;

        if (is_admin === false) {
            if (authenticated_user_id !== user_id) {
                {
                    return res.status(401).json({
                        message: 'Access denied'
                    });
                }
            }
        }


        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, user_id)
            .execute('fetchUserByIdPROC');

        if (user.recordset.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const queried_user = user.recordset[0];



        // check if user is assigned to project
        const get_user_projects = await pool.request()
            .input('user_id', mssql.VarChar, user_id)
            .execute('AllProjectsByUserProc');

        if (get_user_projects.recordset.length === 0) {
            return res.status(404).json({
                message: 'User is not assigned to any project'
            });
        }

        return res.status(200).json({
            message: 'User projects retrieved successfully',
            user_projects: get_user_projects.recordset
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving user projects',
            error: error
        });

    }
}


const markProjectAsCompleted = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const { id } = req.params;

        const pool = await mssql.connect(sqlConfig);
        const project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('getProjectById');

        if (project.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const queried_project = project.recordset[0];

        const updated_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('markProjectAsCompleted');

        if (updated_project.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        } else {
            return res.status(200).json({
                message: 'Project marked as completed successfully'
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Error marking project as completed',
            error: error
        });
    }
}

const getAllFreeUsers = async (req, res) => {
    try {
        const { is_admin } = req.user;
        if (is_admin === false) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        const pool = await mssql.connect(sqlConfig);
        const free_users = await pool.request()
            .execute('checkAllFreeUsers');

        return res.status(200).json({
            message: 'Free users retrieved successfully',
            free_users: free_users.recordset
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving free users',
            error: error
        });
    }
}

        

module.exports = {
    createProject,
    get_projects,
    projectDetails,
    updateProject,
    deleteProject,
    assignUserProject,
    getAllProjectEverAssigned,
    markProjectAsCompleted,
    getAllFreeUsers
}