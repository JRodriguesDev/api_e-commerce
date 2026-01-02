import stripe from '../index.js'

import {StripeLineItem} from '#interfaces/stripe.js'

export const create_product_session = async (id: string, customer: string, items: StripeLineItem[]) => {
    const session = await stripe.checkout.sessions.create({
        metadata: {orderId: id},
        customer: customer,
        line_items: items,
        mode: 'payment',
        saved_payment_method_options: {payment_method_save: 'enabled'},
        cancel_url: 'http://return',
        success_url: 'http://sucess'
    })
    return session
}

export const create_subscription_session = async (customer: string, plan: StripeLineItem[]) => {
    const session = await stripe.checkout.sessions.create({
        customer: customer,
        line_items: plan,
        mode: 'subscription',
        saved_payment_method_options: {payment_method_save: 'enabled'},
        cancel_url: 'http://return',
        success_url: 'http://sucess'
    })
    return session
}


