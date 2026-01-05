import type {Stripe} from 'stripe'
import type { FastifyInstance, FastifyRequest} from 'fastify'

import stripe  from '../index.js'
import {session_expire, payment_failed, payment_succeeded, invoice_succeeded, customer_subscription_update} from '#logic_stripe/hooks.js'
    
export const payment_hook = async (fastify: FastifyInstance) => {
    fastify.addContentTypeParser('application/json', {parseAs: 'buffer'}, async (req: FastifyRequest, payload: Buffer) => {return payload})

    fastify.post('/webhooks/stripe', async (req, res) => {
        const sig = req.headers['stripe-signature'] as string
        const webhook_secret = process.env.STRIPE_CLI_SECRET!
        let event: Stripe.Event
        try {
            const raw_body = req.body as Buffer
            event = stripe.webhooks.constructEvent(raw_body, sig, webhook_secret)
            console.log(`Evento ${event.type}`)
            switch (event.type) {
                    case 'checkout.session.expired':
                    session_expire(event)
                        break;
                case 'payment_intent.succeeded':
                    payment_succeeded(event)
                    break;
                case 'payment_intent.payment_failed':
                    payment_failed(event)
                    break;
                case 'invoice.payment_succeeded':
                    invoice_succeeded(event)
                    break;
                case 'customer.subscription.updated':
                    customer_subscription_update(event)
                    break;
                default:
                    console.log(`Event Ignored: ${event.type}`)
            }
            return res.status(200).send({received: true})
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err}`);
        }
    })
}