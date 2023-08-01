const { Router } = require('express');
const { employeeRegister, employeeLogin } = require('../controller/auth.controller');

const router = Router();

//authentication routes
router.post('/employee/login', employeeLogin)
router.post('/employee/register', employeeRegister)


module.exports = router;