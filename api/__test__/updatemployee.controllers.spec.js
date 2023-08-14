const mssql = require('mssql');
const { updateEmployeeAccount } = require('../src/controller/employee.controller');

describe('Update Employee Account', () => { 
    it('should update employee successfully', async () => {
        const updateEmployee = {
            id: 10,
            firstName: 'Emma',
            lastName: 'Jason',
            email: 'emma@gmail.com'
        }
       const req = {
        user: {
            is_admin: true
        },
        params: {
            id: 10
        },
        body: {
            firstName: 'Neema',
            lastName: 'abdal',
            email: 'test@gmail.com'
        }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }
        const next = jest.fn();
        mssql.connect = jest.fn();
        mssql.request = jest.fn(() => ({
            query: jest.fn().mockReturnValue({
                recordset: updateEmployee
            })
        })
        )

        await updateEmployeeAccount(req, res, next);

        // expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Update successful'});
         })
    })