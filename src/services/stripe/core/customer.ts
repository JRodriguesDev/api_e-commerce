import {v4 as uuid} from 'uuid'

import stripe from '../index.js'
import { User } from '#interfaces'

export const create_customer = async (data: Pick<User, 'name' | 'email'>) => {
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

export const update_user = async (id: string, data: Pick<User, | 'name' | 'email'>) => {
    const customer = await stripe.customers.update(id, {
        ...data
    })
    return customer
}

export const retun_user = async (id: string) => {
    const customer = await stripe.customers.retrieve(id)
    return customer
}

export const list_user = async (limit: number) => {
    const customer = await stripe.customers.list({
        limit
    })
    return customer
}

export const delete_user = async (id: string) => {
    const customer = await stripe.customers.del(id)
    return customer
}