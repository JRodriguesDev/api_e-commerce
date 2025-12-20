import prisma from '#prisma'
import type {Stripe} from 'stripe'
import {orderCache} from '#interfaces'


export const state_expire = async (data: orderCache) => {
    try {
        console.log(data)
        const order = await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'EXPIRE',
                stripeSessionId: data.session_id,
            }
        })
        console.log(order)
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
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