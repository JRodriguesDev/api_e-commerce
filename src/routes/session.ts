import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_session_create} from '#schemas/session.js'
import {session_create} from '#prisma_routes/session.js'
import {create_session} from '../services/stripe/session/product.js'
import {order_update} from '#prisma_routes/order.js'

export const session = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_session_create, async (req, res) => {
        try {
            const data = await session_create(req.user!.id)
            const session = await create_session(data.order_data.id, data.user!.stripeProfile!.id, data.line_items)
            await order_update(session.metadata!.orderId, session.id)
            return res.status(200).send(session)
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}