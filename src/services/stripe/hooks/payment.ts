import type {Stripe} from 'stripe'
import type { FastifyInstance, FastifyRequest} from 'fastify'
import stripe  from '../index.js'
import {state_process, state_paid} from '#prisma_stripe/checkout.js'
    
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
                case 'payment_intent.created':
                    console.log(event)
                    //await state_process(event)
                    break;
                case 'payment_intent.succeeded':
                    console.log(event)
                    //await state_paid(event)
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