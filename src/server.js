require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./api/routes');
const errorHandler = require('./api/middlewares/errorHandler');
const requestLogger = require('./api/middlewares/requestLogger');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
} else {
  app.use(helmet());
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

async function startServer() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { apiReference } = await import('@scalar/express-api-reference');
      const swaggerSpec = require('./api/swagger/config');

      app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
      });

      app.use('/docs', apiReference({ spec: { content: swaggerSpec } }));
    } catch (error) {
      logger.error('Erro ao carregar Scalar:', error.message);
    }
  }
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Paytrack User Sync API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /api/health',
        sync: 'POST /api/sync',
        syncStatus: 'GET /api/sync/status',
        syncClear: 'DELETE /api/sync/clear',
        users: 'GET /api/users',
        userStats: 'GET /api/users/stats/summary',
        userByEmail: 'GET /api/users/:email',
      },
      documentation: 'https://github.com/your-repo',
    });
  });

  app.use('/api', routes);
  app.use(errorHandler);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint não encontrado',
      path: req.path,
    });
  });

  app.listen(PORT, () => {
    logger.info(`API rodando em http://localhost:${PORT}`);
    if (process.env.NODE_ENV === 'development') {
      logger.info(`Scalar API Docs: http://localhost:${PORT}/docs`);
    }
  });
}

startServer();

process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido');
  process.exit(0);
});

module.exports = app;
