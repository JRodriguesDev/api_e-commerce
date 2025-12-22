import prisma from '#prisma'
import type {Stripe} from 'stripe'
import {orderCache} from '#interfaces/order.js'


export const state_expire = async (data: orderCache) => {
    try {
        const order = await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'EXPIRE',
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}

export const state_failed = async (data: orderCache) => {
    try {
        const order = await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'FAILED',
                stripePaymentIntentId: data.payment_intent_id
            }
        })
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
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}