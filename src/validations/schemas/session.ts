import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_session: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_create_subscription_session: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                planId: {type: 'string'}
            },
            required: ['planId']
        }
    }
}