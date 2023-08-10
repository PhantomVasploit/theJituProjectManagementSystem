import mssql from 'mssql'
const bcrypt = require('bcrypt')
import jwt from 'jsonwebtoken'
const { login } = require("../src/controller/auth.controller")

// jest.mock("bcrypt")

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
        // const hashedPwd = 'trdsfgchjgb;gjihkmn.klhj;k'

        // bcrypt.compare.mockResolvedValueOnce(false)

        const mockRecordSet = {
                firstName: "Paul",
                lastName: "Sanga",
                email: "paul@gmail.com",
                password: "trdsfgchjgb;gjihkmn.klhj;k"
        }
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
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [ 1 ], recordset: [mockRecordSet]})
        })
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false); // Mocking bcrypt.compare


        await login(req, res);

        // expect(bcrypt.compare).toHaveBeenCalledWith("pajoy9903", hashedPwd);
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid login credentials'})
    })

    it('should login in user if password and email are valid', async()=>{
        
        const mockRecordSet = {
                firstName: "Paul",
                lastName: "Sanga",
                email: "paul@gmail.com",
                password: "trdsfgchjgb;gjihkmn.klhj;k"
        }

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
            execute: jest.fn().mockResolvedValueOnce({rowsAffected: [ 1 ], recordset: [mockRecordSet]})
        })
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true); // Mocking bcrypt.compare
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('sampleToken123');

        await login(req, res);
        expect(jwt.sign).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            token: 'sampleToken123',
            user: {
                firstName: "Paul",
                lastName: "Sanga",
                email: "paul@gmail.com",
            }
        })
    })
})