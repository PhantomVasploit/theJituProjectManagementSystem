const { Router } = require('express');

const { adminAuthorization } = require('../middleware/admin.authorization');
const { authorization } = require('../middleware/authorization.middleware');
const { getAllEmployees, getEmployeeById, updateEmployeeAccount, deleteEmployeeAccount, getEmployeeProjects } = require('../controller/employee.controller');
const { employeeRegister, adminRegister, login, deactivateAccount, reactivateAccount } = require('../controller/auth.controller');
const { get_projects, createProject, projectDetails, updateProject, deleteProject, 
        assignUserProject, markProjectAsCompleted, getAllFreeUsers, getAllProjectEverAssigned 
    } = require('../controller/projectsController');
const { verifyToken } = require('../middleware/verifyToken');

const router = Router();

//authentication routes
router.post('/login', login)
router.post('/employee/register', employeeRegister)
router.post('/admin/register', adminRegister)


router.get('/projects', verifyToken, get_projects)
router.post('/projects', verifyToken, createProject)
router.get('/project/:id',  projectDetails)
router.put('/project/:id', verifyToken, updateProject)
router.delete('/project/:id', verifyToken, deleteProject)
router.put('/project/:id/mark-complete', verifyToken, markProjectAsCompleted)
router.get('/projects/get-free-employees', verifyToken, getAllFreeUsers)
router.post('/projects/:id/:user_id/assign', verifyToken, assignUserProject)

router.get('/projects/:user_id/all', verifyToken, getAllProjectEverAssigned)

// employee routes
router.get('/employee/:id', authorization, getEmployeeById)
router.get('/employees', adminAuthorization, getAllEmployees)
router.put('/employee/:id', authorization, updateEmployeeAccount)
router.get('/employee/projects/:id', authorization, getEmployeeProjects)
router.delete('/employee/:id', adminAuthorization, deleteEmployeeAccount)
router.post('/employee/deactivate-account', authorization, deactivateAccount)
router.post('/employee/reactivate-account', reactivateAccount)

module.exports = router;