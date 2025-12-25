import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {admin_guard} from '#middllewares/adminGuard.js'

export const opt_role_default: RouteShorthandOptions = {
    //preHandler: [auth_guard, admin_guard]
}

export const role_edit: RouteShorthandOptions = {
    //preHandler: [auth_guard, admin_guard]
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
                role: {type: 'string'}
            },
            required: ['role']
        }
    }
}