const { Router } = require('express');
const { employeeRegister } = require('../controller/auth.controller');

const router = Router();

//authentication routes
router.post('/employee/register', employeeRegister)


module.exports = router;