import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {moderator_guard} from '#middllewares/adminGuard.js'

export const opt_category_create: RouteShorthandOptions = {
    preHandler: [auth_guard, moderator_guard],
    schema: {
        tags: ['Category'],
        summary: 'Criar Categoria',
        description: 'Cria Categoria Requer Role ADMIN ou MODERADOR',
        security: [{cookieGuard: []}],
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'}
            },
            required: ['name']
        }
    }
}

export const opt_category_update: RouteShorthandOptions = {
    preHandler: [auth_guard, moderator_guard],
    schema: {
        tags: ['Category'],
        summary: 'Edita Categoria',
        description: 'Edita Categoria Requer Role ADMIN ou MODERADOR',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                categoryId: {type: 'string'}
            },
            required: ['categoryId']
        },
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'}
            },
            anyOf: [
                {required: ['name']}
            ]
        }
    }
}

export const opt_category_delete: RouteShorthandOptions = {
    preHandler: [auth_guard, moderator_guard],
    schema: {
        tags: ['Category'],
        summary: 'Deleta Categoria',
        description: 'Deleta Categoria Requer Role ADMIN ou MODERADOR',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                categoryId: {type: 'string'}
            },
            required: ['categoryId']
        }
    }
}

export const opt_category_all: RouteShorthandOptions = {
    schema: {
        tags: ['Category'],
        summary: 'Todas as Categoria',
        description: 'Mostra todas as Categorias',
    }
}