import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_list_invoice, opt_pay_invoice} from '#schemas/invoice.js'
import {db_list_invoice} from '#prisma_routes/invoice.js'
import {pay_invoice} from '#stripe_billing/invoice.js'
import {RequestUser} from '#interfaces/request.js'

export const invoice = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_list_invoice, async (req, res) => {
        try {
            const {id} = req.user as Pick<RequestUser, 'id'>
            const invoices = await db_list_invoice(id)
            return res.status(200).send({status: 'sucess', invoices})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.post('/pay/:invoiceId', opt_pay_invoice, async (req, res) => {
        try {
            const {invoiceId} = req.params as {invoiceId: string}
            const invoice = await pay_invoice(invoiceId)
            return res.status(200).send({status: 'sucess', invoice})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
}