import { type FastifyInstance } from "fastify";
import cookie from '@fastify/cookie'

import {opt_create_review, opt_update_review, opt_delete_review} from '../validations/schemas/review.js'
import {db_review_create, db_review_update, db_review_delete} from '#prisma_routes/review.js'
import {product_perfil_reset} from '#db_cache/product.js'
import { Review } from "#interfaces/review.js";
import {RequestUser} from '#interfaces/request.js'

export const review =  async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_create_review, async (req, res) => {
        try {
            const {comment, productId} = req.body as Review
            const {id} = req.user as Pick<RequestUser, 'id'>
            await db_review_create(id, productId, comment)
            await product_perfil_reset(productId)
            return res.status(201).send({status: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error`})
        }
    })
    fastify.patch('/:reviewId', opt_update_review, async (req, res) => {
        try {
            const {reviewId}  = req.params as {reviewId: string}
            const {id} = req.user as Pick<RequestUser, 'id'>
            const body = req.body as Pick<Review, 'comment'>
            const review = await db_review_update(reviewId, id, body)
            await product_perfil_reset(review.productId)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
    fastify.delete('/:reviewId', opt_delete_review, async (req, res) => {
        try {
            const {reviewId} = req.params as {reviewId: string}
            const {id} = req.user as Pick<RequestUser, 'id'>
            const review = await db_review_delete(reviewId, id)
            await product_perfil_reset(review.productId)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(404).send({message: 'Review not found or Unauthorized'})
        }
    })
}