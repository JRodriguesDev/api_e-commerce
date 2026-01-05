import type {Stripe} from 'stripe'
import {get_cache} from '#stripe_cache/events.js'
import {payment_state_paid, payment_state_failed, session_state_expire, invoice_state_paid, subscription_state_update} from '#prisma_stripe/events.js'
import {orderCache} from '#interfaces/order.js'


// Evento usado quando uma fatura e paga
export const invoice_succeeded = async (event: Stripe.InvoicePaymentSucceededEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data: orderCache = {
        userId: cache.userId,
        planId: cache.planId,
        totalAmount: event.data.object.total,
        status: 'paid',
        mode: 'subscription',
        subscriptionId: event.data!.object!.parent!.subscription_details!.subscription as string,
        invoiceId: event.data.object.id,
        description: event.data.object.lines.data[0].description!
    }
    try {
    await invoice_state_paid(data)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

//Evento quando um pagamento e concluido
export const payment_succeeded = async (event: Stripe.PaymentIntentSucceededEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    if((cache.mode != 'payment') && (!cache.orderId)) return
    const data: orderCache = {
        orderId: cache.orderId,
        paymentIntentId: event.data.object.id,
        paymentType: event.data.object.payment_method_types,
        status: 'paid',
        mode: 'payment',
        totalAmount: Number(event.data.object.amount)
    }
    try {
    await payment_state_paid(data)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

//evento caso falhe o pagamento
export const payment_failed = async (event: Stripe.PaymentIntentPaymentFailedEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data: orderCache = {
        orderId: cache.orderId,
        paymentIntentId: event.data.object.id,
        paymentType: event.data.object.payment_method_types,
        paymentError: event.data.object.last_payment_error?.message,
        status: 'failed',
        mode: 'payment',
        totalAmount: Number(event.data.object.amount)
    }
    try {
    await payment_state_failed(data)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

//evento quando a sessao e expirada
export const session_expire = async (event: Stripe.CheckoutSessionExpiredEvent) => {
    const customer = event.data.object.customer
    const cache = await get_cache(`order:${customer}`)
    const data:orderCache = {
        orderId: cache.orderId,
        mode: event.data.object.mode,
        paymentType: event.data.object.payment_method_types,
        status: 'failed'
    }
    try {
    await session_state_expire(data)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

//evento quando o status da assinatura e mudada
export const customer_subscription_update = async (event: Stripe.CustomerSubscriptionUpdatedEvent) => {
    const data: orderCache = {
        subscriptionId: event.data.object.id,
        status: event.data.object.status
    }
    try {
    await subscription_state_update(data)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

