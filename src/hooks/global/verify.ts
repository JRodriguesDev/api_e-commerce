import type {FastifyInstance, FastifyPluginCallback} from 'fastify'
import fp from 'fastify-plugin'
import prisma from '#prisma'

const hook = async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', () => {
        console.log('pre Handler')
    })
}

export const pre_handler_plugin = fp(hook)