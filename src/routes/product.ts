import type {FastifyInstance} from 'fastify'
import {opt_product} from '#schemas/product.js'
import { Product } from '#interfaces'

export const product = async (fastify: FastifyInstance) => {
    fastify.get('/', opt_product, async (req, res) => {
        const {limit, page} = req.query as {limit: number, page: number}
        const skip = (page - 1) * limit
        const products = await fastify.prisma.product.findMany({
            take: limit,
            skip: skip,
            omit: {images: true}
        })
        return res.status(200).send({products: products})
    })
    fastify.get('/:id', {schema: {params: {type: 'object'}}}, async (req, res) => {
        const {id} = req.params as {id: string}
        const product = await fastify.prisma.product.findUnique({
            where: {id},
            omit: {thumbnail: true},
            include: {reviews: true}
        })
        return res.status(200).send({product})
    })
    fastify.post('/create', async (request, reply) => {
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
    })
}
