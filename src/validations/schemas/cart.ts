import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Cart'],
        summary: 'Adicionar Produto',
        description: 'Adiciona produto ao carrinho do usuario requer credenciais do cookie',
        security: [{cookieGuard: []}],
        body: {
            type: 'object',
            properties: {
                productId: {type: 'string'},
                quantity: {type: 'number'}
            },
            required: ['productId']
        }
    }
}

export const opt_update_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Cart'],
        summary: 'Edita Produto',
        description: 'Edita quantidade do produt requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                cartId: {type: 'string'}
            },
            required: ['cartId']
        },
        body: {
            type: 'object',
            properties: {
                quantity: {type: 'number'}
            },
            anyOf: [
                {required: ['quantity']}
            ]
        }
    }
}

export const opt_delete_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Cart'],
        summary: 'Deleta Produto',
        description: 'Deleta o produt do carrinho requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                cartId: {type: 'string'}
            },
            required: ['cartId']
        }
    }
}

export const opt_get_cart: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Cart'],
        summary: 'Pega Carrinho',
        description: 'Pega o carrinho do usuario credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}