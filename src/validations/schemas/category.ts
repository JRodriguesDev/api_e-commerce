import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {moderator_guard} from '#middllewares/adminGuard.js'

export const opt_category_create: RouteShorthandOptions = {
    preHandler: [auth_guard, moderator_guard],
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
    preHandler: [auth_guard, moderator_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                categoryId: {type: 'string'}
            },
            required: ['categoryId']
        },
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
    preHandler: [auth_guard, moderator_guard]
}