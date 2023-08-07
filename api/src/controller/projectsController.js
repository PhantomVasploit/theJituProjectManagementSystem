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

        // validate if project name is not empty
        if (project_name === '') {
            return res.status(400).json({
                message: 'Project name is required'
            });
        }

        // validate if project description is not empty
        if (project_description === '') {
            return res.status(400).json({
                message: 'Project description is required'
            });
        }

        // validate if project status is not empty
        if (project_status === '') {
            return res.status(400).json({
                message: 'Project status is required'
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
                message: 'Access denied',
                status: 401
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
                message: 'Project not found',
                status: 404
            });
        }

        return res.status(200).json({
            message: 'Project retrieved successfully',
            project: project.recordset[0],
            status: 200
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

        // validate if project name is not empty
        if (project_name === '') {
            return res.status(400).json({
                message: 'Project name is required'
            });
        }

        // validate if project description is not empty
        if (project_description === '') {
            return res.status(400).json({
                message: 'Project description is required'
            });
        }

        // validate if project status is not empty
        if (project_status === '') {
            return res.status(400).json({
                message: 'Project status is required'
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

        return res.status(200).json({
            message: 'Project updated successfully',
            project: updated_project.recordset[0]
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
        const deleted_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('sp_deleteProject');

        return res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting project',
            error: error
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

        const { id } = req.params;
        const { user_id } = req.body;

        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, user_id)
            .execute('sp_getUserById');

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

        // check if user is already assigned to project
        const user_project = await pool.request()
            .input('user_id', mssql.VarChar, user_id)
            .input('project_id', mssql.VarChar, id)
            .execute('sp_getUserProject');

        if (user_project.recordset.length > 0) {
            return res.status(400).json({
                message: 'User is already assigned to this project'
            });
        }

        // assign user to project
        const assigned_user_project = await pool.request()
            .input('user_id', mssql.VarChar, user_id)
            .input('project_id', mssql.VarChar, id)
            .execute('sp_assignUserProject');

        return res.status(200).json({
            message: 'User assigned to project successfully',
            user_project: assigned_user_project.recordset[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error assigning user to project',
            error: error
        });
    }
}

const getAllProjectEverAssigned = async (req, res) => {
    try {
        // user can view all projects assigned to him/her
        const { id } = req.params;
        const { user_id } = req.user;

        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, user_id)
            .execute('sp_getUserById');

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

        // check if user is assigned to project
        const get_user_projects = await pool.request()
            .input('user_id', mssql.VarChar, user_id)
            .input('project_id', mssql.VarChar, id)
            .execute('AllProjectsByUserProc');

        if (get_user_projects.recordset.length === 0) {
            return res.status(404).json({
                message: 'User is not assigned to this project'
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

        

module.exports = {
    createProject,
    get_projects,
    projectDetails,
    updateProject,
    deleteProject,
    assignUserProject,
    getAllProjectEverAssigned
}