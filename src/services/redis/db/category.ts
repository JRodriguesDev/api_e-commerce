import client from '../index.js'

import {db_all_categories} from '#prisma_routes/category.js'

export const categoy_cache = async () => {
    const key = 'categories'
    const cached = await client.get(key)
    console.log(cached)
    if (cached) return JSON.parse(cached)
    const categories = await db_all_categories()
    await client.set(key, JSON.stringify(categories), {EX: 3600})
    return categories
}

export const category_cache_reset = async () => {
    await client.del('categories')
}