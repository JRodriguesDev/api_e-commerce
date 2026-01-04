import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_list_products} from '#schemas/productPurchased.js'
import {db_get_products} from '#prisma_routes/productsPurchased.js'
import {RequestUser} from '#interfaces/request.js'

export const productPurchased = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_list_products, async (req, res) => {
        try {
            const {id} = req.user as Pick<RequestUser, 'id'>
            const products = await db_get_products(id)
            return res.status(200).send({status: 'sucess', products})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
}