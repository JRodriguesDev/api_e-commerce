import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares'

export const opt_cart_create: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                productId: {type: 'string'},
            },
            required: ['productId']
        }
    }
}