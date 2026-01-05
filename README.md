# BackEnd Ecommerce - Stripe Integrado
Este projeto é o resultado de um estudo sobre o desenvolvimento de ecossistemas de e-commerce. O objetivo principal foi construir um backend sólido e organizado, focado na gestão de pagamentos e assinaturas, aplicando boas práticas de arquitetura e segurança.

## 🌟 Funcionalidades do Sistema

### 🛒 Experiência de Compra e Assinaturas (Stripe)
1. Checkout Inteligente: Integração com Stripe para venda de produtos físicos/digitais e planos de assinatura recorrente.
2. Gestão de Assinaturas: Fluxo completo para assinar, gerenciar e cancelar planos diretamente pela plataforma.
3. Wallet de Pagamentos: Possibilidade de salvar métodos de pagamento para compras futuras e gerenciar cartões salvos.
4. Histórico Financeiro: Listagem detalhada de ordens de serviço e faturas geradas para o usuário.

### 🛡️ Segurança e Controle de Acesso
1. Autenticação Robusta: Sistema de login via Cookies seguros utilizando Tokens JWT para identificação.
2. Gestão de Permissões (RBAC): Controle de acesso baseado em cargos (roles) para gerenciar o que cada nível de usuário pode visualizar ou editar.
3. Criptografia de Dados: Proteção de informações sensíveis, como senhas, utilizando algoritmos de hash de última geração.

### ⚡ Performance e Qualidade de Dados
1. Sistema de Cache: Implementação de Redis para otimizar requisições repetitivas, reduzindo a carga no banco de dados e acelerando a resposta para o usuário.
2. Validação Rigorosa: Todos os dados de entrada passam por validações automáticas para garantir a integridade do sistema.
3. Catálogo Ativo: Exibição dinâmica de produtos, planos e reviews de usuários com filtragem por status.

### 📋 Gestão de Dados (CRUD)
1. Gerenciamento completo (Criação, Leitura, Edição e Exclusão) de todas as entidades do sistema através do Prisma ORM.

## 🛠️ Stack Tecnológico

### Core & Frameworks
- **[Fastify](https://fastify.dev/)**: Framework web focado em ultra performance e arquitetura baseada em plugins.
- **[TypeScript](https://www.typescriptlang.org/)**: Garantia de segurança de tipos em todo o fluxo da aplicação.
- **[Zod](https://zod.dev/)**: Validação de esquemas e contratos de dados com tipagem estática automática.

### Persistência & Cache
- **[Prisma ORM](https://www.prisma.io/orm)**: Modelagem de dados eficiente e segura com PostgreSQL.
- **[Redis](https://redis.io/docs/latest/develop/)**: Camada de cache dedicada para otimizar a performance da Stripe e consultas ao banco.

### Pagamentos & Finanças
- **[Stripe SDK](https://docs.stripe.com/sdks)**: Integração completa para Checkout, Billing (assinaturas) e Webhooks

### Segurança & Autenticação
- **[JWT](https://www.jwt.io/introduction#what-is-json-web-token)**: Implementação leve e moderna de tokens JWT.
- **[BcryptJS](https://www.npmjs.com/package/bcryptjs)**: Criptografia segura para o armazenamento de senhas.
- **[Fastify Cookie](https://github.com/fastify/fastify-cookie)**: Gestão de sessões via Cookies para maior segurança contra ataques.

### Documentação & Utilitários
- **[Swagger](https://github.com/fastify/fastify-swagger) & [Swagger UI](https://github.com/fastify/fastify-swagger-ui)**: Documentação interativa da API.
- **[UUID](https://www.npmjs.com/package/uuid)**: Geração de identificadores únicos universais.
- **[Dotenv](https://www.npmjs.com/package/dotenv)**: Gestão de variáveis de ambiente.

## 📂 Organização e Responsabilidades
Abaixo, detalho o papel de cada diretório na arquitetura do sistema, focando na separação de preocupações:

- ``src/global/``: Centraliza as declarações globais de tipos do TypeScript, estendendo interfaces nativas como o FastifyRequest para suporte a propriedades customizadas.
- ``src/hooks/``: Contém os hooks do ciclo de vida do Fastify, incluindo o registro e a captura dos eventos de Webhooks da Stripe.
- ``src/logic/stripe/``: Camada de orquestração. Esta pasta contém a lógica que une as operações de banco de dados com as ações de pagamento, servindo como a "ponte" que os hooks chamam para processar mudanças de status (ex: pagamento aprovado vs. expirado).
- ``src/prisma/``: Armazena o Schema e o cliente gerado do Prisma ORM para a persistência de dados no PostgreSQL.
- ``src/routes/``: Definição modular de todos os endpoints da API, organizada por domínios e registrada centralmente no index.ts.
- ``src/services/``: Camada de infraestrutura e serviços externos:
  - ``fastify_plugins/``: Encapsula a configuração de plugins como o Decorator do Prisma.
  - ``jwt/``: Gerenciamento de tokens de acesso e segurança da sessão.
  - ``prisma/``: Contém os routes (operações de banco consumidas pela API) e a seed para popular cargos e usuários padrão.
  - ``redis/``:
  - ``db/``: Otimização de performance para rotas de alta leitura (Produtos, Planos e Categorias).
  - ``stripe/``: Utilizado como cache estratégico para armazenar dados de Orders, permitindo acesso rápido a informações que a API da Stripe não retorna de forma imediata.
  - ``stripe/``: Implementação técnica dos eventos da Stripe, tratando faturas, sessões e assinaturas.
  - ``swagger/``: Configuração da documentação OpenAPI para visualização no Swagger UI.
- ``src/validations/``: Centraliza a segurança de dados com Zod para tipagem em runtime e Middlewares para controle de acesso baseado em cargos.

## Considerações Finais de Implementação
**Nota Técnica**: A decisão de utilizar Redis para armazenar metadados de ordens foi tomada para otimizar a experiência do usuário e garantir a integridade dos dados, contornando limitações de latência em APIs externas. Além disso, a separação em src/logic garante que as rotas permaneçam limpas e focadas apenas na entrada e saída de dados.
## 🚀 Guia de Instalação e Setup
Este projeto utiliza Docker para padronizar o ambiente de desenvolvimento, facilitando a configuração do banco de dados PostgreSQL, Redis e Stripe CLI.

1. **Pré-requisitos**
- Node.js (v25.2.1)
- Docker & Docker Compose
2. **Configuração do Inicial**
Clone o repositório e instale as dependências locais:
```
      git clone https://github.com/JRodriguesDev/api_e-commerce.git
      cd api_e-commerce
      npm install
      npx prisma generate
```

**Configuração do Redis**
Para a segurança do container de cache, crie um arquivo chamado **[redis.conf](https://github.com/redis/redis/blob/unstable/redis.conf)** na raiz do projeto e adicione os seguintes parâmetros:
```
    bind 0.0.0.0 -::1
    user default off
    user root on ><redis password> ~* +@all
```

**Variáveis de Ambiente**
Crie um arquivo .env na raiz do projeto. **Importante**: Substitua ``<password>`` e ``<redis password>`` pela senha de sua preferência a senha do ``.env`` e ``redis.conf`` devem ser iguais.
```   
    POSTGRES_USER=root
    POSTGRES_PASSWORD=<password>
    POSTGRES_DB=ecommerce
    STRIPE_SECRET="" # Senha da stripe secret obtida na Stripe
    STRIPE_CLI_SECRET="" # Será obtido após o primeiro login no container
    JWT_PASSWORD=""
    COOKIE_SECRET=""
    DATABASE_URL="postgresql://root:<POSTGRES_PASSWORD>@postgres:5432/ecommerce?schema=public"
    REDIS_URL='redis://root:<redis password>@redis:6379'
    START='DEFAULT'
```

3. **Inicialização do Projeto**
O setup inicial é dividido em duas etapas para garantir a correta autenticação com a Stripe e migração do banco.
**Passo A**: Build e Autenticação Stripe
```
  npm run build
  docker compose -f docker/compose.yaml up --build
```

- Com os containers rodando, observe os logs. Clique no link de autenticação gerado pelo container da Stripe para vincular sua conta.
- Após a verificação, você terá acesso ao ``STRIPE_CLI_SECRET``.

**Passo B**: Migração do Banco de Dados
Com os containers ativos, abra um novo terminal e acesse o container da aplicação para executar as migrações do Prisma:
```
  docker exec -it app bash
  # Entre no container e execute:
  npx prisma migrate dev
```

**Passo C**: Ajuste Final e Reinicialização
Para aplicar todas as configurações e garantir que o webhook da Stripe funcione corretamente:
No seu ``.env``, altere temporariamente a variável ``DEFAULT`` para ``FALSE``.

Reinicie os containers:
```
  docker compose -f docker/compose.yaml down
  docker compose -f docker/compose.yaml up --build
```

Após a reinicialização bem-sucedida, altere START de volta para default (ou qualquer outro valor) para evitar conflitos em inicializações futuras.

## 📖 Acesso à Documentação
Com o ecossistema rodando, você pode testar todos os endpoints, fluxos de pagamento e assinaturas através da interface interativa:

🔗 Swagger UI: http://localhost:3000/docs
