# Sistema de Gerenciamento de Pedidos

## Introdução

Este é um sistema de gerenciamento de pedidos. A aplicação permite o gerenciamento completo do fluxo de pedidos, desde a seleção de produtos, registro de clientes, processamento de pagamentos e notificações sobre o status do pedido.

### Principais funcionalidades:

- Cadastro e gerenciamento de produtos e categorias
- Gerenciamento de clientes
- Processamento de pedidos
- Integração com meios de pagamento
- Sistema de notificações
- Gestão de lojas e totens de autoatendimento

## Pré-requisitos

- [Docker](https://www.docker.com/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (v2+)
- [Node.js](https://nodejs.org/) (v18+)

## Como executar o projeto

### 1. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo de variáveis de ambiente
cp env-example .env
```

Ajuste as variáveis conforme necessário no arquivo `.env` criado.

#### Variáveis importantes:

- **FAKE_PAYMENT_PROVIDER**: Controla o provedor de pagamento utilizado
  - `S`: Utiliza um provedor de pagamento simulado (fake)
  - `N`: Utiliza a API do MercadoPago para processar pagamentos reais

### 2. Inicie os containers com Docker Compose

```bash
# Inicie todos os serviços definidos no docker-compose.yml
docker-compose up -d
```

### 3. Acesse a aplicação

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

A documentação da API (Swagger) pode ser acessada em [http://localhost:3000/docs](http://localhost:3000/docs#/)

## Scripts principais

```bash
# Iniciar em modo de desenvolvimento
npm run start:dev

# Construir o projeto
npm run build

# Iniciar em modo de produção
npm run start:prod

# Executar testes
npm run test

# Executar testes com cobertura
npm run test:cov

# Executar testes end-to-end
npm run test:e2e

# Gerar uma nova migration
npm run typeorm:migration:generate -- src/db/migrations/NomeDaMigration

# Reverter a última migration
npm run typeorm:migration:revert
```

## Estrutura de pastas

```
src/
├── app.module.ts         # Módulo principal da aplicação
├── main.ts               # Ponto de entrada da aplicação
├── common/               # Componentes comuns e utilitários
│   └── database/         # Configurações de banco de dados
├── db/                   # Configurações e migrations do banco de dados
│   └── migrations/       # Arquivos de migração do TypeORM
├── docs/                 # Documentação da API (Swagger)
├── infra/
│   ├── config/           # Configurações da aplicação
│   └── health/           # Endpoints de health check
└── modules/              # Módulos da aplicação
    ├── auth/             # Autenticação e autorização
    ├── categories/       # Gerenciamento de categorias
    ├── customers/        # Gerenciamento de clientes
    ├── notification/     # Sistema de notificações
    ├── order/            # Gerenciamento de pedidos
    ├── payment/          # Processamento de pagamentos
    └── stores/           # Gerenciamento de lojas
```

## Arquitetura

O projeto segue os princípios de Clean Architecture e Domain-Driven Design (DDD), utilizando:

- **NestJS** como framework principal
- **TypeORM** para persistência de dados
- **PostgreSQL** como banco de dados principal
- **Swagger** para documentação da API

A organização do código está baseada em módulos que representam os diferentes domínios do negócio, cada um com sua própria estrutura de adaptadores, modelos, portas e serviços, garantindo um baixo acoplamento e alta coesão.

### Links Importantes

- [Miro](https://miro.com/app/board/uXjVIGlxRtY=/)
- [Video Youtube](https://www.youtube.com/)
