import type {RouteShorthandOptions} from 'fastify'

import {auth_guard} from '#middllewares/authGuard.js'

export const opt_payment_list: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_payment_remove: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                id: {type: 'string'}
            },
            required: ['id']
        }
    }
}