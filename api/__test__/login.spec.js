import mssql from 'mssql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const { login } = require("../src/controller/auth.controller")

describe("User login controller test suite", ()=>{
    
    it('should fail when the request body is missing', async()=>{
        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: 'The request body can not be empty'})
    })

    it('should fail if email is not registered', async()=>{
        
        const req = {
            body: {
                email: "paul@gmail.com",
                password: "pajoy9903"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [ 0 ]})
        })

        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error: 'This email is not registred'})
    })

    it('should fail if the password is invalid', async()=>{
        const req = {
            body: {
                email: "paul@gmail.com",
                password: "pajoy9903"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [ 1 ]})
        })
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
    })
})