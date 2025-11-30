import type {RouteShorthandOptions} from 'fastify'
import {user_schema, user_password_schema, user_login_schema} from '#zod/user.js'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_user_create: RouteShorthandOptions = {
    preHandler: user_schema,
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['name', 'email', 'password']
        }
    }
}

export const opt_user_login: RouteShorthandOptions = {
    preHandler: user_login_schema,
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['email', 'password']
        }
    }
}

export const opt_user_update: RouteShorthandOptions = {
    preHandler: auth_guard,
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                email: {type: 'string'},
            }
        }
    }
}

export const opt_user_password: RouteShorthandOptions = {
    preHandler: [auth_guard, user_password_schema],
    schema: {
    body: {
        type: 'object',
        properties: {
            password: {type: 'string'}
        },
        required: ['password']
        }
    }
}