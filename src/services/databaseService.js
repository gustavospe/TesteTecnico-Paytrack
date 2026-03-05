const Database = require('better-sqlite3');
const config = require('../config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = config.database.path;
    this.db = null;
  }

  initialize() {
    try {

      //Validando diretorio
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new Database(this.dbPath);
      this.createTables();
      logger.info('Banco de dados inicializado com sucesso');
    } catch (error) {
      logger.error('Erro ao inicializar banco de dados', { error: error.message });
      throw error;
    }
  }

  /**
   * Criacao das tabelas necessárias
   */
  createTables() {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        gender TEXT,
        title TEXT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        date_of_birth TEXT,
        phone TEXT,
        cell TEXT,
        nationality TEXT,
        street_number INTEGER,
        street_name TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        postcode TEXT,
        latitude TEXT,
        longitude TEXT,
        timezone_offset TEXT,
        timezone_description TEXT,
        picture_large TEXT,
        picture_medium TEXT,
        picture_thumbnail TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(schema);
  }

  /**
   * Insere ou atualiza um usuário
   * @param {Object} user - Dados do usuário
   * @returns {Object} { action: 'inserted'|'updated', email: string }
   */
  upsertUser(user) {
    const existing = this.db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(user.email);

    if (existing) {
      return this.updateUser(user);
    } else {
      return this.insertUser(user);
    }
  }

  /**
   * Insere um novo usuário
   */
  insertUser(user) {
    const stmt = this.db.prepare(`
      INSERT INTO users (
        email, gender, title, first_name, last_name, age, date_of_birth,
        phone, cell, nationality, street_number, street_name, city, state,
        country, postcode, latitude, longitude, timezone_offset,
        timezone_description, picture_large, picture_medium, picture_thumbnail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      user.email,
      user.gender,
      user.title,
      user.first_name,
      user.last_name,
      user.age,
      user.date_of_birth,
      user.phone,
      user.cell,
      user.nationality,
      user.street_number,
      user.street_name,
      user.city,
      user.state,
      user.country,
      user.postcode,
      user.latitude,
      user.longitude,
      user.timezone_offset,
      user.timezone_description,
      user.picture_large,
      user.picture_medium,
      user.picture_thumbnail
    );

    return { action: 'inserted', email: user.email };
  }

  /**
   * Atualiza um usuário existente
   */

  updateUser(user) {
    const stmt = this.db.prepare(`
      UPDATE users SET
        gender = ?, title = ?, first_name = ?, last_name = ?, age = ?,
        date_of_birth = ?, phone = ?, cell = ?, nationality = ?,
        street_number = ?, street_name = ?, city = ?, state = ?, country = ?,
        postcode = ?, latitude = ?, longitude = ?, timezone_offset = ?,
        timezone_description = ?, picture_large = ?, picture_medium = ?,
        picture_thumbnail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);

    stmt.run(
      user.gender,
      user.title,
      user.first_name,
      user.last_name,
      user.age,
      user.date_of_birth,
      user.phone,
      user.cell,
      user.nationality,
      user.street_number,
      user.street_name,
      user.city,
      user.state,
      user.country,
      user.postcode,
      user.latitude,
      user.longitude,
      user.timezone_offset,
      user.timezone_description,
      user.picture_large,
      user.picture_medium,
      user.picture_thumbnail,
      user.email
    );

    return { action: 'updated', email: user.email };
  }

  close() {
    if (this.db) {
      this.db.close();
      //logger.info('Conexão com banco de dados encerrada');
    }
  }
}

module.exports = DatabaseService;
