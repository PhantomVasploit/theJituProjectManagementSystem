const mssql = require('mssql');
const { updateEmployeeAccount } = require('../src/controller/employee.controller');

describe('Update Employee Account', () => { 
    it('should delete employee successfully', async () => {
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

        jest.spyOn(mssql, 'ConnectionPool').mockResolvedValue({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({
                rowsAffected: [1]
            })
        })
        await updateEmployeeAccount(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    })
})

    
