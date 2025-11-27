import type {RouteShorthandOptions} from 'fastify'

export const opt_product: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                limit: {type: 'number'},
                page: {type: 'number'}
            },
            required: ['limit', 'page']
        },
        response: {
            200: {
                description: 'user created',
                type: 'object',
                properties: {
                    products: {type: 'array'}
                }
            }
        }
    }
}