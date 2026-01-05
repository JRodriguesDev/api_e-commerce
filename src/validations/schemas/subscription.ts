import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_subcription: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Subscription'],
        summary: 'Lista de Assinaturas',
        description: 'Mosra as assinaturas requer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}

export const opt_collet_subscription: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Subscription'],
        summary: 'Muda auto Pagamento',
        description: 'Altera o auto pagamento da stripe requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        },
        body: {
            type: 'object',
            properties: {
                auto: {type: 'boolean'}
            },
            required: ['auto']
        }
    }
}

export const opt_invoice_subscription: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Subscription'],
        summary: 'Mostra Fatura',
        description: 'Mostra a fatura mais recente da assinatura requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        }
    }
}

export const opt_delete_subscription: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Subscription'],
        summary: 'Deleta Assinatura',
        description: 'Deleta a assinatura requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                subId: {type: 'string'}
            },
            required: ['subId']
        }
    }
}