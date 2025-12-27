import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_list_products: RouteShorthandOptions = {
    preHandler: [auth_guard]
}