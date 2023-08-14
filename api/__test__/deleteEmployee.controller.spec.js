const mssql = require('mssql');
const {deleteEmployeeAccount} = require('../src/controller/employee.controller');
     
describe('delete an employee successfully', () => {
    it('should delete an employee successfully', async () => {
        const request = {
            user : {
                is_admin : true
            },
            params: {
                id : 1
            }
        }
        const response = {
            status: jest.fn(() => response),
            json: jest.fn()
        }
        mssql.query = jest.fn().mockResolvedValueOnce({
            recordset : [
                {
                    id: 10,
            first_name: 'emma',
            last_name: 'jason',
            email: 'test2@gmail.com'
                }
            ]
        })

        await deleteEmployeeAccount(request, response);
        expect(response.status).toHaveBeenCalledWith(200);
        
})
})
