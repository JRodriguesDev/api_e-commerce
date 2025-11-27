import type {FastifyInstance} from 'fastify'
import {product} from './product.js'
import {user} from './user.js'

const routes = async (fastify: FastifyInstance) => {
    fastify.register(product, {prefix: '/product'})
    fastify.register(user, {prefix: '/user'})
}

export default routes