import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_payment: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Payments'],
        summary: 'Lista Formas de Pagamentos',
        description: 'Mostra todas as formas de pagamento do usuario requer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}

export const opt_remove_payment: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Payments'],
        summary: 'Remove Forma de Pagamento',
        description: 'Remove formas de pagamento do usuario requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                payId: {type: 'string'}
            },
            required: ['payId']
        }
    }
}