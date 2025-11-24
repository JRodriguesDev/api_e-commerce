import type {FastifyPluginCallback} from 'fastify'
import {} from '#fastify_plugins'

const routes: FastifyPluginCallback  = async (fastify) => {
    fastify.get('/', async (request, reply) => {
    return {'hello': 'wolrd'}
    })
}

export default routes