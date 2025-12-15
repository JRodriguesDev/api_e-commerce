import stripe from '../index.js'

import {ProductList} from '#interfaces'

export const create_session = async (id: string, customer: string, email: string, items: ProductList) => {
    const session = await stripe.checkout.sessions.create({
        metadata: {orderId: id},
        customer: customer,
        customer_email: email,
        line_items: [],
        mode: 'payment',
        return_url: 'return',
        success_url: 'sucess'
    })
}