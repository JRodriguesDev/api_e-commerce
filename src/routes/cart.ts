import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_cart_create, opt_cart_update, opt_cart_delete, opt_cart_get} from '#schemas/cart.js'
import {create_cart, update_cart, delete_cart_item, get_cart} from '#prisma_routes/cart.js'
import {Cart, CartItem} from '#interfaces/cart.js'

export const cart = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_cart_create, async (req, res) => {
        try {
            const {id} = req.user! as {id: string}
            const {productId, quantity} = req.body as CartItem
            const cart_item = await create_cart(id, productId, quantity)
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: `ser Not Found or Unauthorized ${err}`})
        }
    })
    fastify.patch('/:cartId', opt_cart_update, async (req, res) => {
        try {
            const {id} = req.user! as {id: string} 
            const {cartId} = req.params as {cartId: string}
            const {quantity} = req.body as {quantity: number}
            const cart_item = await update_cart(cartId, quantity)
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/:cartId', opt_cart_delete, async (req, res) => {
        try {
            const {cartId} = req.params as {cartId: string}
            const cart_item = await delete_cart_item(cartId)
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.get('/', opt_cart_get, async (req, res) => {
        try {
            const {id} = req.user! as {id: string}
            const cart = await get_cart(id)
            
            return res.status(200).send({cart})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}