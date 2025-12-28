import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_payment_list, opt_payment_remove} from '#schemas/payments.js'
import {list_payments, remove_payment} from '#stripe_payments/methods.js'
import {stripe_profile} from '#prisma_routes/payment.js'

export const payments = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_payment_list, async (req, res) => {
        try {
            const {id} = req.user as {id: string}
            const customer_id = await stripe_profile(id)
            const list = await list_payments(customer_id.stripeProfile!.id)
            return res.status(200).send({list})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/:id', opt_payment_remove, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const payment = await remove_payment(id)
            return res.status(200).send({payment})
        } catch (err) {
            return res.status(401).send({message: 'Payment Not Found or Unauthorized'})
        }
    })
}