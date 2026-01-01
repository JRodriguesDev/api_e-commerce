import client from '../index.js'
import {orderCache} from '#interfaces/order.js'


export const set_order_cache = async (key: string, data: {}) => {
    await client.hSet(`order:${key}`, {
        ...data
    })
    await client.expire(`order:${key}`, 3600)
}

export const get_cache = async (key: string) => {
    const value = await client.hGetAll(key)
    return value as unknown as orderCache
}