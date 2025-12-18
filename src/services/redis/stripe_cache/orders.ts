import client from '../index.js'

export const set_cahce = async (key: string, value: string) => {
    await client.set(key, value, {EX: 3600})
}

export const get_cache = async (key: string) => {
    const value = await client.get(key)
    return value!
}