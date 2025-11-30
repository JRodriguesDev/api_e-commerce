import { type FastifyInstance } from "fastify";
import {opt_review_create} from '#schemas/review.js'
import {auth_guard} from '#middllewares/authGuard.js'
import cookie from '@fastify/cookie'

export const review =  async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/', opt_review_create, async (req, res) => {
        const {rating, comment, productId} = req.body as {rating: number, comment: string, productId: string}
        const review = await fastify.prisma.reviews.create({
            data: {
                rating,
                comment,
                product: {connect: {id: productId}},
                author: {connect: {id: req.user!.id}}
            },
            select: {
                author: {select: {name: true}}
            }
        })
        return res.status(201).send({body: req.body, id: req.user!.id})
    })
}