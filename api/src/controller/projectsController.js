const mssql = require('mssql');
const {v4} = require('uuid');
const { sqlConfig } = require('../config/database.connection.config');

const createProject = async (req, res) => {
    try {
        const {
            project_name, project_description, project_status,
            start_date, end_date
        } = req.body;

        const id = v4();

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
        const new_project = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('project_name', mssql.VarChar, project_name)
            .input('project_description', mssql.VarChar, project_description)
            .input('project_status', mssql.VarChar, project_status)
            .input('start_date', mssql.Date, start_date)
            .input('end_date', mssql.Date, end_date)
            .execute('sp_createProject');

        return res.status(200).json({
            message: 'Project created successfully',
            project: new_project.recordset[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating project',
            error: error
        });
    }
}


const get_projects = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const projects = await pool.request()
            .execute('sp_getAllProjects');

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
            .execute('sp_updateProject');

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


module.exports = {
    createProject,
    get_projects,
    projectDetails,
    updateProject
}