import {z} from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'

export const create_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
        name: z.string().min(3, 'Minum 3 letters'),
        email: z.string().email('email invalid'),
        password: z.string().min(6, 'password is sort'),
    })
    try {
        const data = zod_shema.parse(req.body)
        req.body = data
    } catch (err) {
        return res.status(400).send({message: "Invalid Data", errors: err})
    }
}

export const login_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_schema = z.object({
        email: z.string().email('email invalid'),
        password: z.string().min(6, 'password is sort')
    })
        try {
        const data = zod_schema.parse(req.body)
        req.body = data
    } catch (err) {
        return res.status(400).send({message: "Invalid Data", errors: err})
    }
}