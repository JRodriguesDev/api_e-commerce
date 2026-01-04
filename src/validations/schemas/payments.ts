import type {RouteShorthandOptions} from 'fastify'

import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_payment: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_remove_payment: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                payId: {type: 'string'}
            },
            required: ['payId']
        }
    }
}