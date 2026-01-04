import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_subcription: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_collet_subscription: RouteShorthandOptions = {
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

export const opt_invoice_subscription: RouteShorthandOptions = {
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

export const opt_delete_subscription: RouteShorthandOptions = {
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