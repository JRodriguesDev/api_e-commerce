import client from '../index.js'

import {db_list_plan} from '#prisma_routes/plan.js'

export const plan_cache = async () => {
    const key = 'plans'
    const cached = await client.get(key)
    if (cached) return JSON.parse(cached)
    const plans = await db_list_plan()
    await client.set(key, JSON.stringify(plans), {EX: 3600})
    return plans
}

export const plan_cache_reset = async () => {
    await client.del('plans')
}