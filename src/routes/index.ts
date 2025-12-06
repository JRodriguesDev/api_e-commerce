import type {FastifyInstance} from 'fastify'
import {product} from './product.js'
import {user} from './user.js'
import {category} from './category.js'
import {review} from './review.js'
import {cart} from './cart.js'

const routes = async (fastify: FastifyInstance) => {
    fastify.register(user, {prefix: '/user'})
    fastify.register(cart, {prefix: '/cart'})
    fastify.register(product, {prefix: '/products'})
    fastify.register(category, {prefix: '/categories'})
    fastify.register(review, {prefix: '/review'})
}

export default routes