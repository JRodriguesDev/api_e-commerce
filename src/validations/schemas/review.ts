import type {RouteShorthandOptions} from 'fastify'
import {review_create_schema} from '../zod/review.js'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_create_review: RouteShorthandOptions = {
    preHandler: [auth_guard, review_create_schema],
    schema: {
        tags: ['Review'],
        summary: 'Criar Review',
        description: 'Cria review usando credenciais do cookie',
        security: [{cookieGuard: []}],
        body: {
            type: 'object',
            properties: {
                comment: {type: 'string'},
                productId: {type: 'string'},
            },
            required: ['comment', 'productId']
        }
    }
}

export const opt_update_review: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Review'],
        summary: 'Edita Review',
        description: 'Edita review usando credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                reviewId: {type: 'string'}
            },
            required: ['reviewId']
        },
        body: {
            type: 'object',
            properties: {
                comment: {type: 'string'},
            },
            anyOf: [
                {required: ['comment']},
            ]
        }
    }
}

export const opt_delete_review: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        tags: ['Review'],
        summary: 'Deleta Review',
        description: 'Deleta review usando credenciais do cookie',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                reviewId: {type: 'string'}
            },
            required: ['reviewId']
        }
    }
}