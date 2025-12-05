import type {RouteShorthandOptions} from 'fastify'
import {auth_guard, admin_guard} from '#middllewares'

export const opt_category_create: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'}
            },
            required: ['name']
        }
    }
}

export const opt_category_update: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'}
            },
            anyOf: [
                {required: ['name']}
            ]
        }
    }
}

export const opt_category_delete: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard]
}