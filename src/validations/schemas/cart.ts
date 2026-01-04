import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                productId: {type: 'string'},
                quantity: {type: 'number'}
            },
            required: ['productId']
        }
    }
}

export const opt_update_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                cartId: {type: 'string'}
            },
            required: ['cartId']
        },
        body: {
            type: 'object',
            properties: {
                quantity: {type: 'number'}
            },
            anyOf: [
                {required: ['quantity']}
            ]
        }
    }
}

export const opt_delete_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                cartId: {type: 'string'}
            },
            required: ['cartId']
        }
    }
}

export const opt_get_cart: RouteShorthandOptions = {
    preHandler: [auth_guard]
}