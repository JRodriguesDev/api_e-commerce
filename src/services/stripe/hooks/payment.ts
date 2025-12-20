import type {Stripe} from 'stripe'
import type { FastifyInstance, FastifyRequest} from 'fastify'
import stripe  from '../index.js'
import {set_payment_cache, set_session_cache} from '#stripe_cahce/orders.js'
import {finalize_paid_order, finalize_expire_order} from '#logic_orders/finalize.js'
import {orderCache} from '#interfaces'
    
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
                case 'checkout.session.completed':
                    let data_complete = {
                        payment_intent_id: event.data.object.payment_intent as string,
                        session_id: event.data.object.id,
                        order_id: event.data.object.metadata!.orderId!
                    } satisfies orderCache 
                    await set_session_cache(event.data.object.customer as string, data_complete)
                    await finalize_paid_order(event.data.object.customer as string)
                    break;
                case 'payment_intent.succeeded':
                    await set_payment_cache(event.data.object.customer as string, {payment_intent_id: event.data.object.id})
                    await finalize_paid_order(event.data.object.customer as string)
                    break;
                case 'checkout.session.expired':
                    let data_expire = {
                        session_id: event.data.object.id,
                        order_id: event.data.object.metadata!.orderId!
                    } satisfies orderCache 
                    await set_session_cache(event.data.object.customer as string, data_expire)
                    await finalize_expire_order(event.data.object.customer as string)
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