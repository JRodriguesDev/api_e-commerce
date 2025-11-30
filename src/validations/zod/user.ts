import {z} from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'

export const user_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
        name: z.string('name is string'),
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

export const user_login_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
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

export const user_password_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
        password: z.string().min(6, 'password is sort'),
    })
    try {
        const data = zod_shema.parse(req.body)
        req.body = data
    } catch (err) {
        return res.status(400).send({message: "Invalid Password", errors: err})
    }
}