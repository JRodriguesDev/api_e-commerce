import Fastify from "fastify";
import routes from "./routes/index.js";
import hooks from './hooks/index.js'
import {prisma_plugin} from './services/fastify_plugins/index.js'
import {default_roles, default_user} from '#prisma_seed/default.js'

const fastify = Fastify({
    logger: true
})

//Plugins
fastify.register(prisma_plugin)

//Routes
await hooks(fastify)

//Routes
await routes(fastify)

//Seed
if (process.env.START == 'FALSE') {
    try {
    await default_roles()
    await default_user()
    } catch (err) {
        console.log(err)
    }
}

const start = async () => {
    try {
        await fastify.listen({port:3000, host: '0.0.0.0'})
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()