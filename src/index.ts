import Fastify from "fastify";
import routes from "./routes/index.js";
import {prisma_plugin} from './services/fastify_plugins/index.js'
import {pre_handler_plugin} from '#hooks_global'

const fastify = Fastify({
    logger: true
})

//Hooks
//fastify.register(pre_handler_plugin)

//Plugins
fastify.register(prisma_plugin)

//Routes
fastify.register(routes)

const start = async () => {
    try {
        await fastify.listen({port:3000, host: '0.0.0.0'})
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()