import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_create_session, opt_create_subscription_session} from '#schemas/session.js'
import {db_session_product_create, db_session_subscription_create} from '#prisma_routes/session.js'
import {create_product_session, create_subscription_session} from '#stripe_checkout/checkout.js'
import {set_order_cache} from '#stripe_cache/events.js'
import {db_order_update} from '#prisma_routes/order.js'
import {RequestUser} from '#interfaces/request.js'

export const session = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/product', opt_create_session, async (req, res) => {
        try {
            const data = await db_session_product_create(req.user!.id)
            const session = await create_product_session(data.order_data.id, data.user!.stripeProfile!.id, data.line_items)
            await db_order_update(session.metadata!.orderId, session.id)
            await set_order_cache(data.user!.stripeProfile!.id, {orderId: session.metadata!.orderId, mode: 'payment'})
            return res.status(200).send({state: 'sucess', session})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.post('/subscription/:planId', opt_create_subscription_session, async (req, res) => {
        try {
            const {planId} = req.params as {planId: string}
            const {id} = req.user! as Pick<RequestUser, 'id'>
            const data = await db_session_subscription_create(id, planId)
            const session = await create_subscription_session(data.customerId, data.line_items)
            await set_order_cache(data.customerId, {userId: data.id, planId: data.planId, mode: 'subscription'})
            return res.status(200).send({state: 'sucess', session})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}