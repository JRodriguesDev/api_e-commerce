import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_session: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Session'],
        summary: 'Cria Sessao de Produto',
        description: 'Cria sessao de comprar produto requer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}

export const opt_create_subscription_session: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Session'],
        summary: 'Cria Sessao de Assinatura',
        description: 'Cria sessao de Assinatura requer credenciais do cokie',
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