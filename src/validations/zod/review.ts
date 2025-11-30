import {z} from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'

export const review_schema = async (req: FastifyRequest, res: FastifyReply) => {
    const zod_shema = z.object({
        rating: z.number('required number'),
        comment: z.string('required string'),
        productId: z.string('required product id')
    })
    try {
        const data = zod_shema.parse(req.body)
        req.body = data
    } catch (err) {
        return res.status(400).send({message: "Invalid Data", errors: err})
    }
}