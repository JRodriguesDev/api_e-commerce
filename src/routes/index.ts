import type {FastifyPluginCallback} from 'fastify'
import {} from '../services/fastify_plugins/index.js'

const routes: FastifyPluginCallback  = async (fastify) => {
    fastify.get('/', async (request, reply) => {
    return {'hello': 'wolrd'}
    })
}

export default routes