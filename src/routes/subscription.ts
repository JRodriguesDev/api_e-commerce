import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_subscription_list} from '#schemas/subscription.js'
import {subscription_list} from '#prisma_routes/subscription.js'

export const subscription = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_subscription_list, async (req, res) => {
        try {    
            const {id} = req.user! as {id: string}
            const subscriptions = await subscription_list(id)
            return res.status(200).send({subscriptions})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}