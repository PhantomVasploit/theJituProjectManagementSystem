const mssql = require('mssql');
const { updateEmployeeAccount } = require('../src/controller/employee.controller');

describe('Update Employee Account', () => { 
    it('should update employee successfully', async () => {
        const updateEmployee ={
            id: 10,
            first_name: 'emma',
            last_name: 'jason',
            email: 'rachaelmuga2@gmail.com'
        }
        const req = {
            params: {
                id: 10
            },
            body: updateEmployee
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
        mssql.connect = jest.fn().mockResolvedValue({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({
                recordset: updateEmployee
            })
        });

        await updateEmployeeAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    })

    // it('should return 404 if employee is not found', async () => {})
})

    
