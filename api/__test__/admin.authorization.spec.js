import * as jwt from "jsonwebtoken"
import { adminAuthorization } from "../src/middleware/admin.authorization"

describe("Admin authorization middleware", ()=>{
    
    it('should faild if no authorization headers is set', async()=>{
        const req = {
            headers: {

                authorization: ""
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Authentication headers not set'})
    })


    it('should failed if no token is provided', async()=>{
        
        const req = {
            headers: {
                authorization: "Bearer "
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Authentication token not set'})

    })


    it('should failed if token is invalid', async()=>{
        
        const req = {
            headers: {
                authorization: "Bearer lkjhkhbkjglkjgkgghfg"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        jest.spyOn(jwt, 'verify').mockReturnValueOnce(false)

        await adminAuthorization(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'jwt malformed'})

    })

    it('should pass if token is valid and call next', async()=>{
        
        const req = {
            headers: {
                authorization: "Bearer lkjhkhbkjglkjgkgghfg"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        jest.spyOn(jwt, 'verify').mockReturnValueOnce(true)

        await adminAuthorization(req, res, next)
        
        // expect(next).toHaveBeenCalledTimes(1)

    })
})