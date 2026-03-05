# Paytrack User Sync API

API REST para sincronização e gerenciamento de usuários consumindo dados da [RandomUser API](https://randomuser.me).

## Características

- Sincronização de 150 usuários por execução
- Filtro de validação (apenas maiores de 18 anos)
- Persistência SQLite com estratégia upsert
- Relatório detalhado no response JSON
- Documentação interativa com Scalar
- Docker ready com perfis dev/prod

## Stack

- Node.js 18+
- Express.js
- SQLite (better-sqlite3)
- Scalar API Reference
- Winston (logging)
- Docker & Docker Compose

## Quick Start

### Desenvolvimento

```bash
docker-compose --profile dev up
```

Acesse:
- API: http://localhost:3333
- Docs: http://localhost:3333/docs
- Health: http://localhost:3333/api/health

### Produção

```bash
docker-compose --profile prod up
```

API disponível em: http://localhost:3000

## Endpoints

### Sincronização
- `POST /api/sync` - Executa sincronização
- `GET /api/sync/status` - Status da última sync

### Usuários
- `GET /api/users` - Lista usuários (paginado)
- `GET /api/users/:email` - Busca por email
- `GET /api/users/stats/summary` - Estatísticas

### Query Parameters (users)
- `limit` - Registros por página (padrão: 10)
- `offset` - Paginação
- `country` - Filtro por país
- `minAge` / `maxAge` - Filtro por idade

## Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3333
LOG_LEVEL=debug
API_URL=https://randomuser.me/api
API_RESULTS=150
DB_PATH=./database/users.db
```

## Desenvolvimento Local

```bash
npm install
npm run dev
```

## Build Docker

```bash
# Dev
docker-compose --profile dev build

# Prod
docker-compose --profile prod build
```

## Estrutura

```
src/
├── api/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes.js
│   └── swagger/
├── services/
│   ├── apiService.js
│   └── databaseService.js
├── utils/
│   ├── logger.js
│   └── validators.js
├── config/
└── server.js
```

## Logs

Logs disponíveis em `logs/`:
- `error.log` - Apenas erros
- `combined.log` - Todos os eventos

## Teste Técnico

Desenvolvido como parte do processo seletivo para Analista de Integrações Paytrack.

**Requisitos atendidos:**
- ✅ Consumo RandomUser API
- ✅ Validação de idade (18+)
- ✅ Persistência SQLite
- ✅ Geração de relatórios
- ✅ Estratégia upsert
- ✅ Docker support
- ✅ Documentação API
