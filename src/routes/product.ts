import type {FastifyInstance} from 'fastify'
import {opt_pages_product, opt_product_create, opt_product_update, opt_user_delete, opt_find_product, opt_category_products} from '../validations/schemas/product.js'
import { Product } from '#interfaces'
import cookie from '@fastify/cookie'

export const product = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/product', opt_product_create, async (req, res) => {
        const {...data} = req.body as Product
        try {
            const product = await fastify.prisma.product.create({
                data: {
                    ...data,
                    owner: {connect: {id: req.user!.id}},
                },
                select: {title: true}
            })
            return res.status(201).send({product})
        } catch (err) {
            return res.status(500).send({message: `Internal Server ${err}`})
        }
    })
    fastify.patch('/product/:id', opt_product_update, async (req, res) => {
        const {id} = req.params as {id: string}
        const {...data} = req.body as Product
        try {
            const product = await fastify.prisma.product.update({
                where: {id: id, ownerId: req.user!.id},
                data: {...data},
                select: {title: true}
            })
            return res.status(200).send({product})
        } catch (err) {
            return res.status(401).send({message: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.delete('/product/:id', opt_user_delete, async (req, res) => {
        const {id} = req.params as {id: string}
        try {
            const product = await fastify.prisma.product.delete({
                where: {id: id, ownerId: req.user!.id},
                select: {title: true}
            })
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'Product Not Found or Unauthorized'})
        }
    })
    fastify.get('/', opt_pages_product, async (req, res) => {
        const {limit, page} = req.query as {limit: number, page: number}
        const skip = (page - 1) * limit
        try {
            const products = await fastify.prisma.product.findMany({
                take: limit,
                skip: skip,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    rating: true,
                    category: true,
                    thumbnail: true,
                    owner: {select: {name: true}}
                },
            })
            return res.status(200).send({products: products})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/:category', opt_category_products, async (req, res) => {
        const {category} = req.params as {category: string}
        const {limit, page} = req.query as {limit: number, page: number}
        const skip = (page - 1) * limit
        try {
            const products = await fastify.prisma.product.findMany({
                where: {category: category},
                take: limit,
                skip: skip,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    rating: true,
                    category: true,
                    thumbnail: true,
                    owner: {select: {name: true}}
                },
            })
            return {products: products}
        } catch (err) {
            return res.status(400).send({message: `Category Not Found ${err}`})
        }
    })
    fastify.get('/product/:id', opt_find_product, async (req, res) => {
        const {id} = req.params as {id: string}
        try {
            const product = await fastify.prisma.product.findUnique({
                where: {id},
                omit: {thumbnail: true},
                include: {
                    reviews: {
                        select: {
                            comment: true, 
                            date: true, 
                            rating: true, 
                            id: true, 
                            author: {select: {name: true, id: true}}
                        }},
                        owner: {select: {name: true, id: true}
                    }
                }
            })
            return res.status(200).send({product})
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
