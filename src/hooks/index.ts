import type {FastifyInstance} from 'fastify'
import {payment_hook} from '#stripe_hooks/payment.js'

const hooks = async (fastify: FastifyInstance) => {
    fastify.register(payment_hook)
}

export default hooks

