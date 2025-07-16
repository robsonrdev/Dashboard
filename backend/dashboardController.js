// backend/dashboardController.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // Usa seu arquivo SQLite

// Rota do painel de resumo
router.get('/api/dashboard/resumo', async (req, res) => {
  try {
    const total = await db.get('SELECT COUNT(*) as total FROM demandas');

    const porPrioridade = await db.all(`
      SELECT prioridade, COUNT(*) as total 
      FROM demandas 
      GROUP BY prioridade
    `);

    const porSetor = await db.all(`
      SELECT setor, COUNT(*) as total 
      FROM demandas 
      GROUP BY setor
    `);

    const ultimas = await db.all(`
      SELECT nomeDemanda, prioridade, dataCriacao 
      FROM demandas 
      ORDER BY dataCriacao DESC 
      LIMIT 5
    `);

    res.json({
      total: total.total,
      porPrioridade,
      porSetor,
      ultimas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar resumo do dashboard' });
  }
});

module.exports = router;
