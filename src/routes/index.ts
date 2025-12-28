import type {FastifyInstance} from 'fastify'
import {product} from './product.js'
import {user} from './user.js'
import {category} from './category.js'
import {review} from './review.js'
import {cart} from './cart.js'
import {session} from './session.js'
import {role} from './roles.js'
import {productPurchased} from './productsPurchased.js'
import {orders} from './orders.js'
import {payments} from './payments.js'

const routes = async (fastify: FastifyInstance) => {
    fastify.register(user, {prefix: '/user'})
    fastify.register(cart, {prefix: '/cart'})
    fastify.register(product, {prefix: '/products'})
    fastify.register(category, {prefix: '/categories'})
    fastify.register(review, {prefix: '/review'})
    fastify.register(session,{prefix: '/session'})
    fastify.register(role, {prefix: '/role'})
    fastify.register(productPurchased, {prefix: '/productPurchased'})
    fastify.register(orders, {prefix: '/orders'})
    fastify.register(payments, {prefix: '/payments'})
}

export default routes