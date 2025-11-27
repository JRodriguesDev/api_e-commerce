import type {RouteShorthandOptions} from 'fastify'

export const opt_user_create: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['name', 'email', 'password']
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    user: {type: 'string'}
                }
            }
        }
    }
}

export const opt_user_login: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['email', 'password']
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    verify: {type: 'boolean'}
                }
            }
        }
    }
}