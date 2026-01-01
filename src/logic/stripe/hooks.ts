import type {Stripe} from 'stripe'
import {get_cache} from '#stripe_cache/events.js'
import {payment_state_paid, payment_state_failed, session_state_expire, invoice_state_paid} from '#prisma_stripe/events.js'
import {orderCache} from '#interfaces/order.js'

export const invoce_succeeded = async (event: Stripe.InvoicePaymentSucceededEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data: orderCache = {
        orderId: cache.orderId,
        planId: cache.planId,
        totalAmount: event.data.object.total,
        status: 'PAID',
        mode: 'subscription',
        subscriptionId: event.data!.object!.parent!.subscription_details!.subscription as string,
        invoiceId: event.data.object.id,
    }
    await invoice_state_paid(data)
}

export const payment_succeeded = async (event: Stripe.PaymentIntentSucceededEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    if(cache.mode != 'payment') return
    const data: orderCache = {
        orderId: cache.orderId,
        paymentIntentId: event.data.object.id,
        paymentType: event.data.object.payment_method_types,
        status: 'PAID',
        mode: 'payment',
        totalAmount: Number(event.data.object.amount)
    }
    await payment_state_paid(data)
}

export const payment_failed = async (event: Stripe.PaymentIntentPaymentFailedEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data: orderCache = {
        orderId: cache.orderId,
        paymentIntentId: event.data.object.id,
        paymentType: event.data.object.payment_method_types,
        paymentError: event.data.object.last_payment_error?.message,
        status: 'FAILED',
        mode: 'payment',
        totalAmount: Number(event.data.object.amount)
    }
    await payment_state_failed(data)
}

export const session_completed = async (event: Stripe.CheckoutSessionCompletedEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data:orderCache = {
        orderId: cache.orderId,
    }
}

export const session_expire = async (event: Stripe.CheckoutSessionExpiredEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data:orderCache = {
        orderId: cache.orderId,
        mode: event.data.object.mode,
        paymentType: event.data.object.payment_method_types,
        status: 'EXPIRE'
    }
    await session_state_expire(data)
}

