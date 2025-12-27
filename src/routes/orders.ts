import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_order_list} from '#schemas/order.js'
import {order_get} from '#prisma_routes/order.js'

export const orders = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_order_list, async (req, res) => {
        try {
            const {id} = req.user! as {id: string}
            const orders = await order_get(id)
            return res.status(200).send({orders})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
}