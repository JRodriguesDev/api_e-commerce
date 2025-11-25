import type {FastifyPluginCallback} from 'fastify'
import {} from '../services/fastify_plugins/index.js'
import prisma from '#prisma'

const routes: FastifyPluginCallback  = async (fastify) => {
    fastify.get('/', async (request, reply) => {
    const result = await prisma.user.findMany()
    console.log(result)
    return {'hello': 'wolrd'}
    })
}

export default routes