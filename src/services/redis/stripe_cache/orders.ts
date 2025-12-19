import client from '../index.js'
import {orderCache} from '#interfaces'

export const set_session_cache = async (key: string, data: orderCache) => {
    await client.hSet(`session:${key}`, {
        ...data
    } satisfies orderCache)
    await client.expire(`session:${key}`, 3600)
}

export const set_payment_cache = async (key: string, data: orderCache) => {
    await client.hSet(`payment:${key}`, {
        ...data
    } satisfies orderCache)
    await client.expire(`payment:${key}`, 3600)
}

export const get_cache = async (key: string) => {
    const value = await client.hGetAll(key)
    return value as unknown as orderCache
}