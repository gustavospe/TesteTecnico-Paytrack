FROM node:18-slim

LABEL maintainer="Paytrack User Sync"

WORKDIR /app

# Instala dependências para compilar módulos nativos (better-sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências de produção e rebuild better-sqlite3
RUN npm ci --only=production && npm rebuild better-sqlite3

# Copia código fonte
COPY . .

# Cria diretórios necessários
RUN mkdir -p database reports logs

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV PORT=3000

# Expõe a porta
EXPOSE 3000

# Executa a aplicação
CMD ["node", "src/server.js"]
