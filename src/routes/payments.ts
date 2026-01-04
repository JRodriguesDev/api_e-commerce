import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_list_payment, opt_remove_payment} from '#schemas/payments.js'
import {list_payments, remove_payment} from '#stripe_payments/methods.js'
import {db_stripe_profile} from '#prisma_routes/payment.js'

export const payments = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_list_payment, async (req, res) => {
        try {
            const {id} = req.user as {id: string}
            const customer_id = await db_stripe_profile(id)
            const list = await list_payments(customer_id.stripeProfile!.id)
            return res.status(200).send({status: 'sucess', list})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/:payId', opt_remove_payment, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const payment = await remove_payment(id)
            return res.status(200).send({status: 'sucess', payment})
        } catch (err) {
            return res.status(401).send({message: 'Payment Not Found or Unauthorized'})
        }
    })
}