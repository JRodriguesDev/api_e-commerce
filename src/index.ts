import Fastify from "fastify";
import routes from "./routes/index.js";
import {prisma_plugin} from './services/fastify_plugins/index.js'

const fastify = Fastify({
    logger: true
})

//Plugins
fastify.register(prisma_plugin)

//Routes
await routes(fastify)

const start = async () => {
    try {
        await fastify.listen({port:3000, host: '0.0.0.0'})
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()