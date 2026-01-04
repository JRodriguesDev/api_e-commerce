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
import {plan} from './plan.js'
import {subscription} from './subscription.js'
import {invoice} from './invoice.js'

const routes = async (fastify: FastifyInstance) => {
    fastify.register(user, {prefix: '/user'})
    fastify.register(cart, {prefix: '/cart'})
    fastify.register(product, {prefix: '/product'})
    fastify.register(category, {prefix: '/categorie'})
    fastify.register(review, {prefix: '/review'})
    fastify.register(session,{prefix: '/session'})
    fastify.register(role, {prefix: '/role'})
    fastify.register(productPurchased, {prefix: '/productPurchased'})
    fastify.register(orders, {prefix: '/order'})
    fastify.register(payments, {prefix: '/payment'})
    fastify.register(plan, {prefix: '/plan'})
    fastify.register(subscription, {prefix: '/subscription'})
    fastify.register(invoice, {prefix: '/invoice'})
}

export default routes