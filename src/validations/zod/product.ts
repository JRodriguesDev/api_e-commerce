import {z} from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'

export const product_create_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
        title: z.string('required string'),
        description: z.string('required string'),
        category: z.string('required string'),
        price: z.number('required string'),
        rating: z.number('required string'),
        stock: z.number('required string'),
        thumbnail: z.string('required string'),
    })
    try {
        const data = zod_shema.parse(req.body)
        req.body = data
    } catch (err) {
        return res.status(400).send({message: "Invalid Data", errors: err})
    }
}