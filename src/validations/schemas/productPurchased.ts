import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_products: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['ProductsPurchased'],
        summary: 'Lista todos os Produtos',
        description: 'Mostra todos os produtos comprados pelo Usuario requer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}