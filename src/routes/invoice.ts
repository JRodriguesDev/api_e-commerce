import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_invoice_list, opt_invoice_pay} from '#schemas/invoice.js'
import {list_invoice} from '#prisma_routes/invoice.js'
import {pay_invoice} from '#stripe_billing/invoice.js'

export const invoice = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_invoice_list, async (req, res) => {
        try {
            const {id} = req.user as {id: string}
            const invoices = await list_invoice(id)
            return res.status(200).send({invoices})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.post('/pay/:invoiceId', opt_invoice_pay, async (req, res) => {
        try {
            const {invoiceId} = req.params as {invoiceId: string}
            const invoice = await pay_invoice(invoiceId)
            return res.status(200).send({invoice})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
}