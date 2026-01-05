import type {RouteShorthandOptions} from 'fastify'
import {user_create_schema, user_password_schema, user_login_schema} from '../zod/user.js'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_login_user: RouteShorthandOptions = {
    preHandler: [user_login_schema],
    schema: {
        tags: ['User'],
        summary: 'Login do Usuario',
        description: 'Login do Usuario retornando o cookie',
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

export const opt_create_user: RouteShorthandOptions = {
    preHandler: [user_create_schema],
    schema: {
        tags: ['User'],
        summary: 'Criaçao de Usuario',
        description: 'Cria um novo usuario no banco e stripe',
        security: [{cookieGuard: []}],
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

export const opt_update_user: RouteShorthandOptions = {
    preHandler: auth_guard,
    schema: {
        tags: ['User'],
        summary: 'Edita Usuario',
        description: 'Edita um Usuario Usando o ID dele vindo do cookie',
        security: [{cookieGuard: []}],
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

export const opt_delete_user: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['User'],
        summary: 'Deleta Usuario',
        description: 'Deleta um Usuario Usando o ID dele vindo do cookie',
        security: [{cookieGuard: []}],
    },
    
}

export const opt_user_password: RouteShorthandOptions = {
    preHandler: [auth_guard, user_password_schema],
    schema: {
    tags: ['User'],
    summary: 'Edita Senha',
    description: 'Deleta um Usuario Usando o ID dele vindo do cookie',
    security: [{cookieGuard: []}],
    body: {
        type: 'object',
        properties: {
            password: {type: 'string'}
        },
        required: ['password']
        }
    }
}

export const opt_get_user: RouteShorthandOptions = {
    preHandler: [auth_guard],
    
    schema: {
        tags: ['User'],
        summary: 'Pegar Usuario',
        description: 'Pegar dados do Usuario e atualziar o cookie',
        security: [{cookieGuard: []}],
    }
}

export const opt_find_user: RouteShorthandOptions = {
    schema: {
        tags: ['User'],
        summary: 'Achar Usuario',
        description: 'Pega um Usuario com base o Id',
        params: {
            type: 'object',
            properties: {
                userId: {type: 'string'},
            },
            required: ['userId']
        }
    }
}

export const opt_search_user: RouteShorthandOptions = {
    schema: {
        tags: ['User'],
        summary: 'Buscar Usuarios',
        description: 'Buscar usuarios no banco usando o inicio de nome',
        querystring: {
            properties : {
                name: {type: 'string'}
            },
            required: ['name']
        }
    }
}