require('dotenv').config();

const config = {
  api: {
    url: process.env.API_URL || 'https://randomuser.me/api',
    results: parseInt(process.env.API_RESULTS) || 150,
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS) || 3,
  },
  database: {
    path: process.env.DB_PATH || './database/users.db',
  },
  application: {
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    batchSize: parseInt(process.env.BATCH_SIZE) || 50,
  },
};

module.exports = config;
