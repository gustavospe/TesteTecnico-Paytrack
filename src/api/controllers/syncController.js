const ApiService = require('../../services/apiService');
const DatabaseService = require('../../services/databaseService');
const { validateUser } = require('../../utils/validators');
const logger = require('../../utils/logger');
const crypto = require('crypto');

class SyncController {
  /**
   * Sincronização de usuários
   */
  async executeSync(req, res) {
    const executionId = crypto.randomUUID();
    const startTime = Date.now();

    logger.info('Iniciando sincronização via API', { executionId });

    const stats = {
      executionId,
      timestamp: new Date().toISOString(),
      total: 0,
      processed: 0,
      inserted: 0,
      updated: 0,
      ignored: 0,
      errors: [],
      warnings: [],
    };

    const apiService = new ApiService();
    const databaseService = new DatabaseService();

    try {
      const users = await apiService.fetchUsers();
      stats.total = users.length;

      databaseService.initialize();

      const result = this.processUsers(users, databaseService);
      stats.processed = result.processed;
      stats.inserted = result.inserted;
      stats.updated = result.updated;
      stats.ignored = result.ignored;
      stats.errors = result.errors;
      stats.warnings = result.warnings;

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      logger.info('Sincronização concluída via API', {
        executionId,
        duration,
        processed: stats.processed,
      });

      res.status(200).json({
        success: true,
        message: 'Sincronização concluída com sucesso',
        data: {
          ...stats,
          duration: `${duration}s`,
        },
      });
    } catch (error) {
      logger.error('Erro na sincronização via API', {
        executionId,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: 'Erro durante a sincronização',
        error: error.message,
      });
    } finally {
      databaseService.close();
    }
  }

  /**
   * Listagem de usuários
   */
  processUsers(users, databaseService) {
    const stats = {
      processed: 0,
      inserted: 0,
      updated: 0,
      ignored: 0,
      errors: [],
      warnings: [],
    };

    for (const apiUser of users) {
      try {
        const validation = validateUser(apiUser);

        if (!validation.valid) {
          stats.ignored++;
          if (validation.errors.includes('Usuário menor de 18 anos')) {
            const warning = stats.warnings.find(w => w.type === 'UNDERAGE');
            if (warning) {
              warning.count++;
            } else {
              stats.warnings.push({
                type: 'UNDERAGE',
                message: 'Usuários menores de 18 anos ignorados',
                count: 1,
              });
            }
          }
          continue;
        }

        const user = this.transformUser(apiUser);
        const result = databaseService.upsertUser(user);

        if (result.action === 'inserted') {
          stats.inserted++;
        } else if (result.action === 'updated') {
          stats.updated++;
        }

        stats.processed++;
      } catch (error) {
        stats.errors.push({
          email: apiUser.email,
          message: error.message,
        });
        logger.error('Erro ao processar usuário', {
          email: apiUser.email,
          error: error.message,
        });
      }
    }

    return stats;
  }

  transformUser(apiUser) {
    return {
      email: apiUser.email,
      gender: apiUser.gender,
      title: apiUser.name.title,
      first_name: apiUser.name.first,
      last_name: apiUser.name.last,
      age: apiUser.dob.age,
      date_of_birth: apiUser.dob.date,
      phone: apiUser.phone,
      cell: apiUser.cell,
      nationality: apiUser.nat,
      street_number: apiUser.location.street.number,
      street_name: apiUser.location.street.name,
      city: apiUser.location.city,
      state: apiUser.location.state,
      country: apiUser.location.country,
      postcode: String(apiUser.location.postcode),
      latitude: apiUser.location.coordinates.latitude,
      longitude: apiUser.location.coordinates.longitude,
      timezone_offset: apiUser.location.timezone.offset,
      timezone_description: apiUser.location.timezone.description,
      picture_large: apiUser.picture.large,
      picture_medium: apiUser.picture.medium,
      picture_thumbnail: apiUser.picture.thumbnail,
    };
  }

  /**
   * Status sincronização
   */
  async getStatus(req, res) {
    const databaseService = new DatabaseService();

    try {
      databaseService.initialize();

      const stats = {
        total: databaseService.db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        byCountry: databaseService.db
          .prepare('SELECT country, COUNT(*) as count FROM users GROUP BY country ORDER BY count DESC LIMIT 5')
          .all(),
        byGender: databaseService.db
          .prepare('SELECT gender, COUNT(*) as count FROM users GROUP BY gender')
          .all(),
        ageStats: databaseService.db
          .prepare('SELECT MIN(age) as min, MAX(age) as max, AVG(age) as avg FROM users')
          .get(),
      };

      if (stats.total === 0) {
        return res.status(200).json({
          success: true,
          message: 'Nenhum usuário sincronizado ainda',
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Status do banco de dados',
        data: stats,
      });
    } catch (error) {
      logger.error('Erro ao buscar status', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar status',
        error: error.message,
      });
    } finally {
      databaseService.close();
    }
  }
}

module.exports = new SyncController();
