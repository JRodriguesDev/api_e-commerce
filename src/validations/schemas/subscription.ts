import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_subscription_list: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_subscription_collect: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        },
        body: {
            type: 'object',
            properties: {
                auto: {type: 'boolean'}
            },
            required: ['auto']
        }
    }
}

export const opt_subscription_invoice: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        }
    }
}

export const opt_subscription_delete: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        }
    }
}