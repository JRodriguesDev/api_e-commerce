import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {admin_guard} from '#middllewares/adminGuard.js'

export const opt_get_roles: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard]
}

export const opt_create_role: RouteShorthandOptions = {
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

export const opt_set_role: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                roleId: {type: 'string'}
            },
            required: ['roleId']
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

export const opt_remove_role: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                roleId: {type: 'string'}
            },
            required: ['roleId']
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

export const opt_delete_role: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                roleId: {type: 'string'}
            },
            required: ['roleId']
        }
    }
}