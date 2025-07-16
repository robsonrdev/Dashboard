// backend/addStatusColumn.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite'); // Caminho corrigido

db.serialize(() => {
  db.run(`ALTER TABLE demandas ADD COLUMN status TEXT DEFAULT 'Aguardando'`, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("⚠️ A coluna 'status' já existe.");
      } else {
        console.error("❌ Erro ao adicionar coluna:", err.message);
      }
    } else {
      console.log("✅ Coluna 'status' adicionada com sucesso!");
    }

    db.close();
  });
});
