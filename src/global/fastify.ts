import "fastify";
import type prism from '#prisma'
declare module 'fastify' {
    interface FastifyInstance {
        prisma: typeof prism
    }
    interface FastifyRequest {
        user?: {
            id: string
        }
    }
}