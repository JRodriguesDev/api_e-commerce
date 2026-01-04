import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_pages_product, opt_create_product, opt_update_product, opt_delete_product, opt_find_product, opt_category_products} from '../validations/schemas/product.js'
import {db_create_product, db_update_product, db_delete_product, db_category_products} from '#prisma_routes/product.js'
import {product_cache, product_cache_version, product_perfil_cache, product_perfil_reset} from '#db_cache/product.js'
import { Product } from '#interfaces/product.js'
import {RequestUser} from '#interfaces/request.js'

export const product = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_create_product, async (req, res) => {
        try {
            const {...data} = req.body as Product
            const {id} = req.user! satisfies Pick<RequestUser, 'id'>
            await db_create_product(id, data)
            await product_cache_version()
            return res.status(201).send({status: 'sucess'})
        } catch (err) {
            return res.status(500).send({status: `Internal Server ${err}`})
        }
    })
    fastify.patch('/:productId', opt_update_product, async (req, res) => {
        try {
            const {productId} = req.params as {productId: string}
            const {id} = req.user! satisfies Pick<RequestUser, 'id'>
            const {...data} = req.body as Product
            await db_update_product(productId, id, data)
            await product_perfil_reset(productId)
            await product_cache_version()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({status: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.delete('/:productId', opt_delete_product, async (req, res) => {
        try {
            const {productId} = req.params as {productId: string}
            const {id} = req.user! satisfies Pick<RequestUser, 'id'>
            await db_delete_product(productId, id)
            await product_perfil_reset(productId)
            await product_cache_version()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({status: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.get('/products', opt_pages_product, async (req, res) => {
        try {
            const {limit, page} = req.query as {limit: number, page: number}
            const skip = (page - 1) * limit
            const products = await product_cache(limit, skip)
            return res.status(200).send({status: 'sucess', products})
        } catch (err) {
            return res.status(500).send({status: 'Internal Server Error'})
        }
    })
    fastify.get('/products/:category', opt_category_products, async (req, res) => {
        try {
            const {category} = req.params as {category: string}
            const {limit, page} = req.query as {limit: number, page: number}
            const skip = (page - 1) * limit
            const products = await db_category_products(category, limit, skip)
            return res.status(200).send({status: 'sucess', products})
        } catch (err) {
            return res.status(400).send({status: `Category Not Found ${err}`})
        }
    })
    fastify.get('/:productId', opt_find_product, async (req, res) => {
        try {
            const {productId} = req.params as {productId: string}
            const products = await product_perfil_cache(productId)
            return res.status(200).send({status: 'sucess', products})
        } catch (err) {
            return res.status(400).send({status: 'Product Not Found'})
        }
    })



    /*
    fastify.post('/fapi', async (request, reply) => {
    const data_products = await fetch('https://dummyjson.com/products?limit=0')
    const response: [Product] = (await data_products.json()).products
    const product_list = response.map(product => {
        return {
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            rating: product.rating,
            stock: product.stock,
            images: product.images,
            thumbnail: product.thumbnail
        }
    })
    const db = await fastify.prisma.product.createMany({
        data: [...product_list]
    })
    const data_category = await fetch('https://dummyjson.com/products/category-list')
    const res = await data_category.json()
    for (const cat of res) {
        await fastify.prisma.category.create({
            data: {name: cat}
        })
    }
    return {'product': db}
    })*/
}
