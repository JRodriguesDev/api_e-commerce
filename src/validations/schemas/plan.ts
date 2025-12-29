import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {admin_guard} from '#middllewares/adminGuard.js'

export const opt_create_plan: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                discountPercent: {type: 'number'},
                price: {type: 'number'}
            },
            required: ['name', 'discountPercent', 'price']
        }
    }
}

export const opt_list_plan: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_update_plan: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                id: {type: 'string'}
            },
            required: ['id']
        },
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                discountPercent: {type: 'number'},
                price: {type: 'number'}
            },
            anyOf: [
                {required: ['name']},
                {required: ['discountPercent']},
                {required: ['price']}
            ]
        },
    }
}

export const opt_delete_plan: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
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