const mssql = require('mssql');
const {getAllEmployees, getEmployeeById} = require('../controller/employee.controller');

describe('Employee Controller', () => {
    it ('should return all employees', async () => {
        const req = {body: {}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

         jest.spyOn(mssql, 'connect').mockImplementation(() => {
        return {
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: []
        })
      }
    })
        await getAllEmployees(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({employees: []})
    }), 

    it('should return error if it does not get all employees', async () => {
        const req = {body: {}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValueOnce(new Error('Error'))
            }
        })

        await getAllEmployees(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:'Internal server error'})
    })
})

       


