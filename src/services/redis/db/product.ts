import client from '../index.js'

import {pages_product, find_product} from '#prisma_routes/product.js'

export const product_perfil_cache = async (id: string) => {
    const key = `product:${id}`
    const cached = await client.get(key)
    if (cached) return JSON.parse(cached)
    const product = await find_product(id)
    await client.set(key, JSON.stringify(product), {EX: 1800})
    return product
}

export const product_cache = async (limit: number, skip: number) => {
    const version = await client.get('products:version') ?? '1'
    const key = `products:v${version}:${limit}:${skip}`
    const cached = await client.get(key)
    if (cached) return JSON.parse(cached)
    const products = await pages_product(limit, skip)
    await client.set(key, JSON.stringify(products), {EX: 1800})
    return products
}

export const product_cache_version = async () => {
    await client.incr('products:version')
}

export const product_perfil_reset = async (id: string) => {
    await client.del(`product:${id}`)
}