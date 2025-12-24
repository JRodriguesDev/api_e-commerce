import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'
import {admin_guard} from '#middllewares/adminGuard.js'

export const opt_role_default: RouteShorthandOptions = {
    preHandler: [auth_guard, admin_guard]
} 