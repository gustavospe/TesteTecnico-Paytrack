const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class ApiService {
  constructor() {
    this.baseURL = config.api.url;
    this.timeout = config.api.timeout;
    this.retryAttempts = config.api.retryAttempts;
  }

  /**
   * Busca usuários da API externa
   * @param {number} results - Quantidade de usuários a buscar
   * @returns {Promise<Array>} Lista de usuários
   */
  async fetchUsers(results = config.api.results) {
    logger.info(`Buscando ${results} usuários da API externa`);

    try {
      const response = await this.fetchWithRetry(results);
      logger.info(`${response.data.results.length} usuários obtidos com sucesso`);
      return response.data.results;
    } catch (error) {
      logger.error('Erro ao buscar usuários da API', { error: error.message });
      throw error;
    }
  }

  /**
   * Faz requisição com retry em caso de falha
   * @param {number} results - Quantidade de resultados
   * @param {number} attempt - Tentativa atual
   * @returns {Promise<Object>} Resposta da API
   */
  async fetchWithRetry(results, attempt = 1) {
    try {
      const response = await axios.get(this.baseURL, {
        params: { results },
        timeout: this.timeout,
      });
      return response;
    } catch (error) {
      if (attempt < this.retryAttempts) {
        logger.warn(`Tentativa ${attempt} falhou. Tentando novamente...`);
        await this.sleep(1000 * attempt);
        return this.fetchWithRetry(results, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Delay helper
   * @param {number} ms - Milissegundos
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ApiService;
