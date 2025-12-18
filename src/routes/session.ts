import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import {opt_session_create} from '#schemas/session.js'
import {create_session} from '#stripe_checkout/product.js'
import {StripeLineItem} from '#interfaces'
import {set_cahce} from '#stripe_cahce/orders.js'


export const session = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_session_create, async (req, res) => {
        try {
            const user = await fastify.prisma.user.findUnique({
                where: {id: req.user!.id},
                omit: {password: true, role: true},
                include: {
                    stripeProfile: {select: {id: true}},
                    cart: {include: {items: true}}
                }
            })
            const items = user!.cart!.items
            const line_items = items.map(item => {
            const unitAmountCents = Math.round(item.price * 100);
                return {
                    quantity: item.quantity,
                    price_data: {
                        currency: 'brl',
                        unit_amount: unitAmountCents,
                        product_data: {
                            name: item.title,
                            description: item.description,
                            images: item.images
                        }
                    }
                } satisfies StripeLineItem
            })
            const order_data = await fastify.prisma.$transaction(async (prisma) => {
                const new_order = await prisma.order.create({
                    data: {
                        userId: user!.id,
                    }
                })
                await Promise.all(
                    items.map(item => prisma.orderItem.create({
                        data: {
                            orderId: new_order.id,
                            productId: item.productId,
                            productName: item.title,
                            quantity: item.quantity,
                            unitPriceAtPurchase: item.price
                        }
                    }))
                )
                return new_order
            })
            await set_cahce('order', order_data.id)
            const session = await create_session(order_data.id, user!.stripeProfile!.id, line_items)
            await fastify.prisma.order.update({
                where: {id: session.metadata!.orderId},
                data: {stripeSessionId: session.id}
            })
            return res.status(200).send(session)
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}