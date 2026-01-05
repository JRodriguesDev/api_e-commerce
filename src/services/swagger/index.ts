import {type SwaggerOptions} from "@fastify/swagger";
import {type FastifySwaggerUiOptions} from "@fastify/swagger-ui";

export const swagger_config: SwaggerOptions = {
    openapi: {
        info: {
            title: 'Minha API de Backend',
            description: 'Documentação da API de Backend',
            version: '1.0.0'
        },
        tags: [
            {name: 'User', description: 'Rotas Do Usuario'},
            {name: 'Role', description: 'Rotas De Cargos'},
            {name: 'Product', description: 'Rotas De Produto'},
            {name: 'Review', description: 'Rotas De Comentario'},
            {name: 'Category', description: 'Rotas De Categoria'},
            {name: 'Cart', description: 'Rotas Do Carrinho'},
            {name: 'Session', description: 'Rotas de Sessoes'},
            {name: 'ProductsPurchased', description: 'Rotas de Produtos Comprados'},
            {name: 'Order', description: 'Rota de Ordens'},
            {name: 'Payments', description: 'Rota de Formas de Pagamento'},
            {name: 'Plan', description: 'Rota de Planos'},
            {name: 'Invoice', description: 'Rota de Faturas'},
            
        ],
        components: {
            securitySchemes: {
                cookieGuard: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                }
            }
        },
    servers: [{ url: 'http://localhost:3000' }]
    }
}

export const swagger_ui_config: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    }
}