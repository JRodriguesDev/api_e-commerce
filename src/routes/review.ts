import { type FastifyInstance } from "fastify";
import cookie from '@fastify/cookie'

import {opt_review_create, opt_review_update, opt_review_delete} from '../validations/schemas/review.js'
import {review_create, review_update, review_delete} from '#prisma_routes/review.js'
import {product_perfil_reset} from '#db_cache/product.js'
import { Review } from "#interfaces/review.js";

export const review =  async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/', opt_review_create, async (req, res) => {
        try {
            const {rating, comment, productId} = req.body as Review
            const review = await review_create(req.user!.id, productId, rating, comment)
            await product_perfil_reset(productId)
            return res.status(201).send({review})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error`})
        }
    })
    fastify.patch('/:id', opt_review_update, async (req, res) => {
        try {
            const {id}  = req.params as {id: string}
            const body = req.body as Pick<Review, 'comment' | 'rating'>
            const review = await review_update(id, req.user!.id, body)
            await product_perfil_reset(review.productId)
            return res.status(200).send({review})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
    fastify.delete('/:id', opt_review_delete, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const review = await review_delete(id, req.user!.id)
            await product_perfil_reset(review.productId)
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
}