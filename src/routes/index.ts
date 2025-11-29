import type {FastifyInstance} from 'fastify'
import {product} from './product.js'
import {user} from './user.js'
import {category} from './category.js'

const routes = async (fastify: FastifyInstance) => {
    fastify.register(product, {prefix: '/product'})
    fastify.register(user, {prefix: '/user'})
    fastify.register(category, {prefix: '/category'})
}

export default routes