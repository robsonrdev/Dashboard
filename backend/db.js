// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Criação das tabelas
db.serialize(() => {
  // Tabela de demandas
  db.run(`
    CREATE TABLE IF NOT EXISTS demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomeDemanda TEXT,
      nomeSolicitante TEXT,
      descricao TEXT,
      setor TEXT,
      prioridade TEXT,
      categoria TEXT,
      status TEXT DEFAULT 'Aguardando',
      dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de mensagem do técnico
  db.run(`
    CREATE TABLE IF NOT EXISTS mensagem_tecnico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem TEXT NOT NULL,
      data_envio TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
