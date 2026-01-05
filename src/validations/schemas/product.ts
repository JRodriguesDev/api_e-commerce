import type {RouteShorthandOptions} from 'fastify'
import {auth_guard, seller_guard} from '#middllewares/authGuard.js'

export const opt_create_product: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard],
    schema: {
        tags: ['Product'],
        summary: 'Criar Produto',
        description: 'Cria um novo produto usando credenciais vindo do cookie requer role SELLER',
        security: [{cookieGuard: []}],
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

export const opt_update_product: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard],
    schema: {
        tags: ['Product'],
        summary: 'Editar Produto',
        description: 'Editar um produto usando credenciais vindo do cookie e param requer role SELLER',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                productId: {type: 'string'}
            },
            required: ['productId']
        },
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

export const opt_delete_product: RouteShorthandOptions = {
    preHandler: [auth_guard, seller_guard],
    schema: {
        tags: ['Product'],
        summary: 'Deleta Produto',
        description: 'Deleta um produto usando credenciais vindo do cookie e param requer role SELLER',
        security: [{cookieGuard: []}],
        params: {
            type: 'object',
            properties: {
                productId: {type: 'string'}
            },
            required: ['productId']
        }
    }
}

export const opt_search_product: RouteShorthandOptions = {
    schema: {
        tags: ['Product'],
        summary: 'Procura Produto',
        description: 'Procura um produto usando seu Nome',
        querystring: {
            type: 'object',
            properties: {
                name: {type: 'string'},
            },
            required: ['name']
        }
    }
}

export const opt_find_product: RouteShorthandOptions = {
    schema: {
        tags: ['Product'],
        summary: 'Achar Produto',
        description: 'Acha um produto usando seu Id',
        params: {
            type: 'object',
            properties: {
                productId: {type: 'string'}
            },
            required: ['productId']
        }
    }
}

export const opt_pages_product: RouteShorthandOptions = {
    schema: {
        tags: ['Product'],
        summary: 'Paginas de Produtos',
        description: 'Mostra paginas de todos os produtos',
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
        tags: ['Product'],
        summary: 'Categoria de Produtos',
        description: 'Mostra paginas de todos os produtos usando a cateogoria',
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