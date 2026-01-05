import Fastify from "fastify";
import routes from "./routes/index.js";
import hooks from './hooks/index.js'
import {prisma_plugin} from './services/fastify_plugins/index.js'
import {default_roles, default_user} from '#prisma_seed/default.js'

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {swagger_config, swagger_ui_config} from '#swagger'
import cors from '@fastify/cors'

const fastify = Fastify({
    logger: true
})

await fastify.register(cors, {origin: 'true', credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']})

//Plugins
await fastify.register(prisma_plugin)

//Hooks
await hooks(fastify)

//Swagger
await fastify.register(fastifySwagger, swagger_config)
await fastify.register(fastifySwaggerUi, swagger_ui_config)

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