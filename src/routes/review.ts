import { type FastifyInstance } from "fastify";
import {opt_review_create, opt_review_update, opt_review_delete} from '../validations/schemas/review.js'
import cookie from '@fastify/cookie'
import { Review } from "#interfaces";

export const review =  async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/', opt_review_create, async (req, res) => {
        const {rating, comment, productId} = req.body as Review
        try {
            const review = await fastify.prisma.reviews.create({
                data: {
                    rating,
                    comment,
                    product: {connect: {id: productId}},
                    author: {connect: {id: req.user!.id}}
                },
                select: {
                    comment: true,
                    date: true,
                    rating: true,
                    id: true,
                    author: {select: {name: true, id: true}}
                }
            })
            return res.status(201).send({review})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error`})
        }
    })
    fastify.patch('/:id', opt_review_update, async (req, res) => {
        const {id}  = req.params as {id: string}
        const body = req.body as Pick<Review, 'comment' | 'rating'>
        try {
            const review = await fastify.prisma.reviews.update({
                where: {id: id, authorId: req.user!.id},
                data: {...body},
                select: {
                    comment: true,
                    date: true,
                    rating: true,
                    id: true,
                    author: {select: {name: true, id: true}}
                }
            })
            return res.status(200).send({review})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
    fastify.delete('/:id', opt_review_delete, async (req, res) => {
        const {id} = req.params as {id: string}
        try {
            const review = await fastify.prisma.reviews.delete({
                where: {id: id, authorId: req.user!.id}
            })
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
}