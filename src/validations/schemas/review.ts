import type {RouteShorthandOptions} from 'fastify'
import {review_create_schema} from '#zod/review.js'
import {auth_guard} from '#middllewares/authGuard.js'

export const opt_review_create: RouteShorthandOptions = {
    preHandler: [auth_guard, review_create_schema],
    schema: {
        body: {
            type: 'object',
            properties: {
                rating: {type: 'number'},
                comment: {type: 'string'},
                productId: {type: 'string'},
            },
            required: ['rating', 'comment', 'productId']
        }
    }
}

export const opt_review_update: RouteShorthandOptions = {
    preHandler: [auth_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                rating: {type: 'number'},
                comment: {type: 'string'},
            },
            anyOf: [
                {required: ['rating', 'comment']},
            ]
        }
    }
}