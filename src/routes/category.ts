import type {FastifyInstance} from 'fastify'
import {opt_product} from '#schemas/product.js'

export const category = async (fastify: FastifyInstance) => {
    fastify.get('/', {schema: {response: 200}}, async (req, res) => {
        const categories = await fastify.prisma.category.findMany()
        return {categories: categories}
    })
    fastify.get('/:category', opt_product, async (req, res) => {
        const {category} = req.params as {category: string} 
        const {limit, page} = req.query as {limit: number, page: number}
        const skip = (page - 1) * limit
        const products = await fastify.prisma.product.findMany({
            where: {category: category},
            take: limit,
            skip: skip,
            omit: {
                images: true,
            }
        })
        return {products: products}
    })
}