import type Stripe from 'stripe'
import {v4 as uuid} from 'uuid'

import stripe from './index.js'
import { User } from '#interfaces'

export const create_customer = async (data: Pick<User, 'name' | 'email'>): Promise<Stripe.Customer> => {
    const costumer = await stripe.customers.create(
        {
            name: data.name,
            email: data.email,
            balance: 0
        },
        {
            idempotencyKey: uuid()
        }
    )
    return costumer
}