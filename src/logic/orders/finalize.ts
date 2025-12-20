import {get_cache} from '#stripe_cahce/orders.js'
import {state_paid, state_expire} from '#prisma_stripe/checkout.js'

export const finalize_paid_order = async (customer_id: string) => {
    const session_cache = await get_cache(`session:${customer_id}`)
    const payment_cache = (await get_cache(`payment:${customer_id}`))
    if (payment_cache.payment_intent_id == session_cache.payment_intent_id) await state_paid(session_cache)
}

export const finalize_expire_order = async (customer_id: string) => {
    const session_cache = await get_cache(`session:${customer_id}`)
    await state_expire(session_cache)
}

