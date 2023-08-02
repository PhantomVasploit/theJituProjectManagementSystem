const { Router } = require('express');
const { employeeRegister, employeeLogin, adminLogin, adminRegister } = require('../controller/auth.controller');

const router = Router();

//authentication routes
router.post('/employee/login', employeeLogin)
router.post('/employee/register', employeeRegister)

router.post('/admin/login', adminLogin)
router.post('/admin/register', adminRegister)


module.exports = router;