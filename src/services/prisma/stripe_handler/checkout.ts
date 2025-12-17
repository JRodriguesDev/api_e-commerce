import prisma from '#prisma'
import type {Stripe} from 'stripe'

export const state_process = async (event: Stripe.PaymentIntentCreatedEvent) => {
    await prisma.order.update({
        where: {id: event.data.object.metadata!.orderId},
        data: {
            stripePaymentIntentId: event.data.object.id as string,
            status: 'PROCESSING'
        }
    })
}

export const state_paid = async (event: Stripe.PaymentIntentSucceededEvent) => {
    await prisma.order.update({
        where: {stripePaymentIntentId: event.data.object.id},
        data: {status: 'PAID'}
    })
}