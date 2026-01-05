import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_invoice: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Invoice'],
        summary: 'Lista de Faturas',
        description: 'Mostra faturas requer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
} 

export const opt_pay_invoice: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Invoice'],
        summary: 'Pagar Fatura',
        description: 'Paga fatura requer credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                invoiceId: {type: 'string'}
            },
            required: ['invoiceId']
        }
    }
}