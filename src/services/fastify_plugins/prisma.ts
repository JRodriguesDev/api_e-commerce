import type {FastifyInstance} from 'fastify'
import fp from 'fastify-plugin'
import prisma from '#prisma'

// savalvando o prisma como decorate no fastify para usos futuros
const plugin = async (fastify: FastifyInstance) => {
    const prism = prisma
    fastify.decorate('prisma', prism)
    fastify.addHook('onClose', async () => await prism.$disconnect())
}

export const prisma_plugin = fp(plugin)

