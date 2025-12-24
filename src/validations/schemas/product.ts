import type {RouteShorthandOptions} from 'fastify'
import {auth_guard, seller_guard} from '#middllewares/authGuard.js'
import {product_create_schema} from '../zod/product.js'

export const opt_product_create: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard, product_create_schema],
    schema: {
        body: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                description: {type: 'string'},
                category: {type: 'string'},
                price: {type: 'number'},
                stock: {type: 'number'},
                images: {type: 'array'},
                thumbnail: {type: 'string'},
            },
            required: ['title', 'description', 'category', 'price', 'stock', 'images', 'thumbnail']
        }
    }
}

export const opt_product_update: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard],
    schema: {
        body: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                description: {type: 'string'},
                category: {type: 'string'},
                price: {type: 'number'},
                stock: {type: 'number'},
                images: {type: 'array'},
                thumbnail: {type: 'array'},
            },
            anyOf: [
                {required: ['title']},
                {required: ['description']},
                {required: ['category']},
                {required: ['price']},
                {required: ['stock']},
                {required: ['images']},
                {required: ['thumbnail']},
            ]
        }
    }
}

export const opt_user_delete: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard]
}

export const opt_find_product: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: {type: 'string'}
            },
            required: ['id']
        }
    }
}

export const opt_pages_product: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                limit: {type: 'number'},
                page: {type: 'number'}
            },
            required: ['limit', 'page']
        }
    }
}

export const opt_category_products: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            properties: {
                category: {type: 'string'}
            },
            required: ['category']
        },
        querystring: {
            type: 'object',
            properties: {
                limit: {type: 'number'},
                page: {type: 'number'}
            },
            required: ['limit', 'page']
        }
    }
}