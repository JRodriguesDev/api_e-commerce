import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_order: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Order'],
        summary: 'Lista de Ordens',
        description: 'Mostra todas as Ordens do Usuario reuqer credenciais do cookie',
        security: [{cookieGuard: []}],
    }
}