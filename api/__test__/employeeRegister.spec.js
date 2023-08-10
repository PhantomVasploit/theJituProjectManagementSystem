import mssql from 'mssql'
import jwt from 'jsonwebtoken'
import { employeeRegister } from '../src/controller/auth.controller'
const token = require('../src/utils/token.gen')
const hash = require('../src/utils/hash')


describe("Employee register controller test suite", ()=>{

    it('should fail when the request body is empty', ()=>{
        const request = {}
        
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        employeeRegister(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({error: 'The request body can not be empty'})
    })

    it('should fail if email provided is already registered', async()=>{
        
        const request={
            body : {
                firstName: "Maki",
                lastName: "Senpai",
                email: "maki@gmail.com",
                password: "pajoy9903"
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [ 1 ]})
        })

        await employeeRegister(request, response)
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({error: 'Account creation failed! This email is already registered'})
    })

    it('should create a new account when email is not registered and request body is not empty', async()=>{
        
        const request = {
            body : {
                firstName: "Maki",
                lastName: "Senpai",
                email: "maki@gmail.com",
                password: "pajoy9903"
            }          
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [0]})
        })

        jest.spyOn(hash, 'hashPassword').mockResolvedValue('hashedPassword123');
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('sampleToken123');

        await employeeRegister(request, response)

        expect(response.status).toHaveBeenCalledWith(201)
        expect(response.json).toHaveBeenCalledWith({
            message: 'Account created successfully',
            token: 'sampleToken123',
            user: { firstName: "Maki", lastName: "Senpai", email: "maki@gmail.com", is_admin: 0 }
        })
    })

})