import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_pages_product, opt_product_create, opt_product_update, opt_user_delete, opt_find_product, opt_category_products} from '../validations/schemas/product.js'
import {create_product, update_product, delete_product, category_products} from '#prisma_routes/product.js'
import { Product } from '#interfaces/product.js'
import {product_cache, product_cache_version, product_perfil_cache, product_perfil_reset} from '#db_cache/product.js'

export const product = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/product', opt_product_create, async (req, res) => {
        try {
            const {...data} = req.body as Product
            const product = await create_product(req.user!.id, data)
            await product_cache_version()
            return res.status(201).send({product})
        } catch (err) {
            return res.status(500).send({message: `Internal Server ${err}`})
        }
    })
    fastify.patch('/product/:id', opt_product_update, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const {...data} = req.body as Product
            const product = await update_product(id, req.user!.id, data)
            await product_perfil_reset(id)
            await product_cache_version()
            return res.status(200).send({product})
        } catch (err) {
            return res.status(401).send({message: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.delete('/product/:id', opt_user_delete, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            await delete_product(id, req.user!.id)
            await product_perfil_reset(id)
            await product_cache_version()
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.get('/', opt_pages_product, async (req, res) => {
        try {
            const {limit, page} = req.query as {limit: number, page: number}
            const skip = (page - 1) * limit
            const products = await product_cache(limit, skip)
            return res.status(200).send({products: products})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/:category', opt_category_products, async (req, res) => {
        try {
            const {category} = req.params as {category: string}
            const {limit, page} = req.query as {limit: number, page: number}
            const skip = (page - 1) * limit
            const products = await category_products(category, limit, skip)
            return {products: products}
        } catch (err) {
            return res.status(400).send({message: `Category Not Found ${err}`})
        }
    })
    fastify.get('/product/:id', opt_find_product, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const products = await product_perfil_cache(id)
            return res.status(200).send({products})
        } catch (err) {
            return res.status(400).send({message: 'Product Not Found'})
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
