import type {FastifyPluginCallback} from 'fastify'
import {Product} from '#interfaces'


const routes: FastifyPluginCallback  = async (fastify) => {
    fastify.get('/', async (request, reply) => {
    const data_products = await fetch('https://dummyjson.com/products?limit=0')
    const response: [Product] = (await data_products.json()).products
    const product_list = response.map(product => {
        return {
            id: product.id,
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

export default routes