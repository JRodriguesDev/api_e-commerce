import type {RouteShorthandOptions} from 'fastify'
import {auth_guard} from '#middllewares'

export const opt_session_create: RouteShorthandOptions = {
    preHandler: [auth_guard]
}