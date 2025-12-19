import prisma from '#prisma'
import type {Stripe} from 'stripe'
import {orderCache} from '#interfaces'


export const state_process = async (event: Stripe.PaymentIntentCreatedEvent) => {
    await prisma.order.update({
        where: {id: event.data.object.metadata!.orderId},
        data: {
            stripePaymentIntentId: event.data.object.id as string,
            status: 'PROCESSING'
        }
    })
}

export const state_paid = async (data: orderCache) => {
    try {
        await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'PAID',
                stripePaymentIntentId: data.payment_intent_id,
                stripeSessionId: data.session_id
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}