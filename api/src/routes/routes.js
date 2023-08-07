const { Router } = require('express');

const { adminAuthorization } = require('../middleware/admin.authorization');
const { authorization } = require('../middleware/authorization.middleware');
const { getAllEmployees, getEmployeeById, updateEmployeeAccount, deleteEmployeeAccount } = require('../controller/employee.controller');
const { employeeRegister, adminRegister, login } = require('../controller/auth.controller');
const { get_projects, createProject, projectDetails, updateProject, deleteProject, assignUserProject } = require('../controller/projectsController');
const { verifyToken } = require('../middleware/verifyToken');

const router = Router();

//authentication routes
router.post('/login', login)
router.post('/employee/register', employeeRegister)
router.post('/admin/register', adminRegister)

router.get('/projects', verifyToken, get_projects)
router.post('/projects', verifyToken, createProject)
router.get('/project/:id', verifyToken, projectDetails)
router.put('/project/:id', verifyToken, updateProject)
router.delete('/project/:id', verifyToken, deleteProject)
router.put('/project/:id/assign', verifyToken, assignUserProject)

// employee routes
router.get('/employees', adminAuthorization, getAllEmployees)
router.get('/employee/:id', authorization, getEmployeeById)
router.put('/employee/:id', authorization, updateEmployeeAccount)
router.delete('/employee/:id', adminAuthorization, deleteEmployeeAccount)

module.exports = router;