const { Router } = require('express');
const { employeeRegister, employeeLogin, adminLogin, adminRegister } = require('../controller/auth.controller');
const { get_projects } = require('../controller/projectsController');

const router = Router();

//authentication routes
router.post('/employee/login', employeeLogin)
router.post('/employee/register', employeeRegister)

router.post('/admin/login', adminLogin)
router.post('/admin/register', adminRegister)

router.get('/projects', get_projects)




module.exports = router;