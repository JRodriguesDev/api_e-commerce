import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_list_subcription, opt_collet_subscription, opt_invoice_subscription, opt_delete_subscription} from '#schemas/subscription.js'
import {db_subscription_list, db_subscription_delete} from '#prisma_routes/subscription.js'
import {update_subscription, invoice_subscription, delete_subscription} from '#stripe_billing/subscriptions.js'
import {retrieve_invoice} from '#stripe_billing/invoice.js'

export const subscription = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_list_subcription, async (req, res) => {
        try {    
            const {id} = req.user! as {id: string}
            const subscriptions = await db_subscription_list(id)
            return res.status(200).send({status: 'sucess', subscriptions})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.patch('/collect/:subId', opt_collet_subscription, async (req, res) => {
        try {
            const {subId} = req.params as {subId: string}
            const {auto} = req.body as {auto: boolean}
            const auto_value = auto ? 'charge_automatically' : 'send_invoice'
            await update_subscription(subId, auto_value)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.get('/invoice/:subId', opt_invoice_subscription, async (req, res) => {
        try {
            const {subId} = req.params as {subId: string}
            const invoice_id = await invoice_subscription(subId)
            const invoice = await retrieve_invoice(invoice_id.invoice as string)
            return res.status(200).send({status: 'sucess', invoice})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.delete('/:subId', opt_delete_subscription, async (req, res) => {
        try {
            const {subId} = req.params as {subId: string}
            await delete_subscription(subId)
            await db_subscription_delete(subId)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}