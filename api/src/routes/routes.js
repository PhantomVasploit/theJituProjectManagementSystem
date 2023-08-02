const { Router } = require('express');

const { adminAuthorization } = require('../middleware/admin.authorization');
const { authorization } = require('../middleware/authorization.middleware');
const { getAllEmployees, getEmployeeById, updateEmployeeAccount, deleteEmployeeAccount } = require('../controller/employee.controller');
const { employeeRegister, employeeLogin, adminLogin, adminRegister } = require('../controller/auth.controller');
const { get_projects } = require('../controller/projectsController');

const router = Router();

//authentication routes
router.post('/employee/login', employeeLogin)
router.post('/employee/register', employeeRegister)

router.post('/admin/login', adminLogin)
router.post('/admin/register', adminRegister)

router.get('/projects', get_projects)




// employee routes
router.get('/employees', adminAuthorization, getAllEmployees)
router.get('/employee/:id', authorization, getEmployeeById)
router.put('/employee/:id', authorization, updateEmployeeAccount)
router.delete('/employee/:id', adminAuthorization, deleteEmployeeAccount)

module.exports = router;