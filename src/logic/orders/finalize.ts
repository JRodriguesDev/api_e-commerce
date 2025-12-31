import {get_cache} from '../../services/redis/stripe/session.js'
import {state_paid, state_expire, state_failed} from '../../services/prisma/stripe/session.js'
import {orderCache} from '#interfaces/order.js'

export const finalize_paid_order = async (customer_id: string) => {
    console.log('finalize')
    const session_cache = await get_cache(`session:${customer_id}`)
    console.log('meio')
    const payment_cache = await get_cache(`payment:${customer_id}`)
    console.log(session_cache)
    console.log(payment_cache.payment_intent_id == session_cache.payment_intent_id)
    console.log(`${payment_cache.payment_intent_id, session_cache.payment_intent_id}`)
    if (payment_cache.payment_intent_id == session_cache.payment_intent_id) await state_paid(session_cache)
}

export const finalize_expire_order = async (customer_id: string) => {
    const session_cache = await get_cache(`session:${customer_id}`) 
    const payment_cache = await get_cache(`payment:${customer_id}`) as orderCache;
    (payment_cache.payment_intent_id == session_cache.payment_intent_id) ? await state_failed(session_cache)
        : await state_expire(session_cache)
}

