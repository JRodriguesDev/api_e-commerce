import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_session_create: RouteShorthandOptions = {
    preHandler: [auth_guard]
}