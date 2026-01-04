import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_create_cart, opt_update_cart, opt_delete_cart, opt_get_cart} from '#schemas/cart.js'
import {db_create_cart, db_update_cart, db_delete_cart_item, db_get_cart} from '#prisma_routes/cart.js'
import {Cart, CartItem} from '#interfaces/cart.js'
import {RequestUser} from '#interfaces/request.js'

export const cart = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_create_cart, async (req, res) => {
        try {
            const {id} = req.user! satisfies Pick<RequestUser, 'id'>
            const {productId, quantity} = req.body as Pick<CartItem, 'productId' | 'quantity'>
            const cart = await db_create_cart(id, productId, quantity)
            return res.status(200).send({status: 'sucess', cart})
        } catch (err) {
            return res.status(401).send({status: `ser Not Found or Unauthorized ${err}`})
        }
    })
    fastify.patch('/:cartId', opt_update_cart, async (req, res) => {
        try {
            const {cartId} = req.params as {cartId: string}
            const {quantity} = req.body as {quantity: number}
            const cart = await db_update_cart(cartId, quantity)
            return res.status(200).send({status: 'sucess', cart})
        } catch (err) {
            return res.status(401).send({status: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.delete('/:cartId', opt_delete_cart, async (req, res) => {
        try {
            const {cartId} = req.params as {cartId: string}
            await db_delete_cart_item(cartId)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({status: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.get('/', opt_get_cart, async (req, res) => {
        try {
            const {id} = req.user! satisfies Pick<RequestUser, 'id'>
            const cart = await db_get_cart(id)
            return res.status(200).send({status: 'sucess', cart})
        } catch (err) {
            return res.status(401).send({status: `User Not Found or Unauthorized ${err}`})
        }
    })
}