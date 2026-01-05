import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {admin_guard} from '#middllewares/adminGuard.js'

export const opt_create_plan: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        tags: ['Plan'],
        summary: 'Criar Plano',
        description: 'Cria Plano requer credenciais do usuario e cargo admin',
        security: [{cookieGuard: []}],
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                price: {type: 'number'}
            },
            required: ['name', 'price']
        }
    }
}

export const opt_update_plan: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard],
    schema: {
        tags: ['Plan'],
        summary: 'Edita Plano',
        description: 'Edita Plano requer credenciais do usuario e cargo admin',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                planId: {type: 'string'}
            },
            required: ['planId']
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
        tags: ['Plan'],
        summary: 'Deleta Plano',
        description: 'Deleta Plano requer credenciais do usuario e cargo admin',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                planId: {type: 'string'}
            },
            required: ['planId']
        }
    }
}

export const opt_list_plan: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Plan'],
        summary: 'Lista Planos',
        description: 'Mostra todos os Planos'
    }
}