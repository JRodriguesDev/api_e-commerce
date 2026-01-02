import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_session_create, opt_session_subscription} from '#schemas/session.js'
import {session_product_create, session_subscription_create} from '#prisma_routes/session.js'
import {create_product_session, create_subscription_session} from '#stripe_checkout/checkout.js'
import {set_order_cache} from '#stripe_cache/events.js'
import {order_update} from '#prisma_routes/order.js'
export const session = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/product', opt_session_create, async (req, res) => {
        try {
            const data = await session_product_create(req.user!.id)
            const session = await create_product_session(data.order_data.id, data.user!.stripeProfile!.id, data.line_items)
            await order_update(session.metadata!.orderId, session.id)
            await set_order_cache(data.user!.stripeProfile!.id, {orderId: session.metadata!.orderId, mode: 'payment'})
            return res.status(200).send(session)
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.post('/subscription/:planId', opt_session_subscription, async (req, res) => {
        try {
            const {planId} = req.params as {planId: string}
            const {id} = req.user! as {id: string}
            const data = await session_subscription_create(id, planId)
            const session = await create_subscription_session(data.customerId, data.line_items)
            await set_order_cache(data.customerId, {userId: data.id, planId: data.planId, mode: 'subscription'})
            return res.status(200).send({session})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}