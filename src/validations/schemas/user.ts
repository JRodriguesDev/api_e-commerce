import type {RouteShorthandOptions} from 'fastify'
import {create_schema, login_schema} from '#zod/user.js'

export const opt_user_create: RouteShorthandOptions = {
    preHandler: create_schema,
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
    preHandler: login_schema,
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