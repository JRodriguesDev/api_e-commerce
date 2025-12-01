import type {FastifyInstance} from 'fastify'

export const category = async (fastify: FastifyInstance) => {
    fastify.get('/', {schema: {response: 200}}, async (req, res) => {
        const categories = await fastify.prisma.category.findMany()
        return {categories: categories}
    })
}