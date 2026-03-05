const DatabaseService = require('../../services/databaseService');
const logger = require('../../utils/logger');

class UserController {
  /**
   * Lista usuários
   */

  async listUsers(req, res) {
    const databaseService = new DatabaseService();

    try {
      databaseService.initialize();

      const { limit = 50, offset = 0, country, minAge, maxAge } = req.query;

      let query = 'SELECT * FROM users WHERE 1=1';
      const params = [];

      if (country) {
        query += ' AND country = ?';
        params.push(country);
      }

      if (minAge) {
        query += ' AND age >= ?';
        params.push(parseInt(minAge));
      }

      if (maxAge) {
        query += ' AND age <= ?';
        params.push(parseInt(maxAge));
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const users = databaseService.db.prepare(query).all(...params);

      const countQuery = 'SELECT COUNT(*) as total FROM users';
      const { total } = databaseService.db.prepare(countQuery).get();

      res.status(200).json({
        success: true,
        message: 'Usuários listados com sucesso',
        data: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          users,
        },
      });
    } catch (error) {
      logger.error('Erro ao listar usuários', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários',
        error: error.message,
      });
    } finally {
      databaseService.close();
    }
  }

  /**
   * Busca usuário por email
   */
  async getUserByEmail(req, res) {
    const databaseService = new DatabaseService();

    try {
      databaseService.initialize();

      const { email } = req.params;
      const user = databaseService.db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Usuário encontrado',
        data: user,
      });
    } catch (error) {
      logger.error('Erro ao buscar usuário', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        error: error.message,
      });
    } finally {
      databaseService.close();
    }
  }

  /**
   * Estatísticas dos usuários
   */

  async getStats(req, res) {
    const databaseService = new DatabaseService();

    try {
      databaseService.initialize();

      const stats = {
        total: databaseService.db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        byCountry: databaseService.db
          .prepare('SELECT country, COUNT(*) as count FROM users GROUP BY country ORDER BY count DESC')
          .all(),
        byGender: databaseService.db
          .prepare('SELECT gender, COUNT(*) as count FROM users GROUP BY gender')
          .all(),
        ageStats: databaseService.db
          .prepare('SELECT MIN(age) as min, MAX(age) as max, AVG(age) as avg FROM users')
          .get(),
      };

      res.status(200).json({
        success: true,
        message: 'Estatísticas geradas com sucesso',
        data: stats,
      });
    } catch (error) {
      logger.error('Erro ao gerar estatísticas', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar estatísticas',
        error: error.message,
      });
    } finally {
      databaseService.close();
    }
  }
}

module.exports = new UserController();
