import type {RouteShorthandOptions} from 'fastify'
import {user_create_schema, user_password_schema, user_login_schema} from '../zod/user.js'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_user: RouteShorthandOptions = {
    preHandler: [user_create_schema],
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

export const opt_login_user: RouteShorthandOptions = {
    preHandler: [user_login_schema],
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

export const opt_search_user: RouteShorthandOptions = {
    schema: {
        querystring: {
            properties : {
                name: {type: 'string'}
            },
            required: ['name']
        }
    }
}

export const opt_find_user: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: {type: 'string'},
            },
            required: ['id']
        }
    }
}

export const opt_update_user: RouteShorthandOptions = {
    preHandler: auth_guard,
    schema: {
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                email: {type: 'string'},
            },
            anyOf: [
                {required: ['name']},
                {required: ['email']},
            ]
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

export const opt_delete_user: RouteShorthandOptions = {
    preHandler: [auth_guard]
}

export const opt_get_user: RouteShorthandOptions = {
    preHandler: [auth_guard]
}