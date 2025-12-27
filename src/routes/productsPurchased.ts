import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_list_products} from '#schemas/productPurchased.js'
import {get_products} from '#prisma_routes/productsPurchased.js'

export const productPurchased = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_list_products, async (req, res) => {
        try {
            const {id} = req.user as {id: string}
            const products = await get_products(id)
            return res.status(200).send({products})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}