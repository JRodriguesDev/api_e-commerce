import stripe from '../index.js'

import {StripeLineItem} from '#interfaces/stripe.js'

export const create_session = async (id: string, customer: string, items: StripeLineItem[]) => {
    const session = await stripe.checkout.sessions.create({
        metadata: {orderId: id},
        customer: customer,
        line_items: items,
        mode: 'payment',
        cancel_url: 'http://return',
        success_url: 'http://sucess'
    })
    return session
}