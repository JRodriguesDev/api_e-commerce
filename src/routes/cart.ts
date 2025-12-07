import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import {opt_cart_create, opt_cart_update, opt_cart_delete, opt_cart_get} from '#schemas/cart.js'
import {Cart, CartItem} from '#interfaces'

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
    fastify.patch('/:cartId', opt_cart_update, async (req, res) => {
        const {id} = req.user! as {id: string} 
        const {cartId} = req.params as {cartId: string}
        const {quantity} = req.body as {quantity: number}
        try {
            const cart_item = await fastify.prisma.cartItem.update({
                where: {id: cartId},
                data: {
                    quantity
                },
                select: {quantity: true, productId: true}
            })
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/:cartId', opt_cart_delete, async (req, res) => {
        const {cartId} = req.params as {cartId: string}
        try {
            const cart_item = await fastify.prisma.cartItem.delete({
                where: {id: cartId},
                select: {productId: true}
            })
            return res.status(200).send({cart_item})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.get('/', opt_cart_get, async (req, res) => {
        const {id} = req.user! as {id: string}
        try {
            const cart = await fastify.prisma.cart.findUnique({
                where: {userId: id},
                include: {
                    items: {select: {cartId: true, productId: true, quantity: true}}
                }
            })
            const products = await fastify.prisma.product.findMany({
                where: {id: {
                    in: cart?.items.map(el => el.productId)
                }},
                select: {
                    id: true,
                    thumbnail: true,
                    title: true,
                    price: true,
                }
            })
            const data = products.map(product => {
                const item = cart?.items.find(i => i.productId === product.id)
                return {...product, quantity: item?.quantity}
            })
            return res.status(200).send({data})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
}