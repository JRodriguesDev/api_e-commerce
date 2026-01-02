import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_invoice_list: RouteShorthandOptions = {
    preHandler: [auth_guard]
} 

export const opt_invoice_pay: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        params: {
            type: 'object',
            properties: {
                invoiceId: {type: 'string'}
            },
            required: ['invoiceId']
        }
    }
}