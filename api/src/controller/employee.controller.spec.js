const mssql = require('mssql');
const {getAllEmployees, getEmployeeById, updateEmployeeAccount} = require('../controller/employee.controller');

describe('Getting all Employees Test', () => {
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


describe('Getting Employee by Id Test', () => {
    it('should return employee by id', async () => {
        const mockEmployee = {
            id: 10,
            first_name: 'emma',
            last_name: 'jason',
            email: 'rachaelmuga2@gmail.com'
        }
        const req = {
            params: {
            id: 10
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [mockEmployee]
        })
        
    })

    await getEmployeeById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message: 'Fetch successful', employee: mockEmployee})
}),

it('should return error if it does not get employee by id', async () => {
    const req = {
        params: {
        id: 10
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValueOnce(new Error('Error'))
    })

    await getEmployeeById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'})
})
})