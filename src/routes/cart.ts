import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import {opt_cart_create} from '#schemas/cart.js'
import {Cart, CartItem} from '#interfaces'
import { connect } from 'http2'

export const cart = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/', opt_cart_create, async (req, res) => {
        const {id} = req.user! as {id: string}
        const {productId, quantity} = req.body as CartItem
        try {
            const cart_id = await fastify.prisma.cart.findUnique({
                where: {userId: id},
                select: {id: true}
            })
            const cart_item = await fastify.prisma.cartItem.create({
                data: {
                    cart: {connect: {id: cart_id!.id}},
                    productId: productId,
                    quantity: quantity 
                },
                select: { quantity: true, productId: true}
            })
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
}