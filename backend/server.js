// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Certifique-se que seu db.js exporta o banco corretamente
require('dotenv').config();


const app = express();
const PORT = 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


// Configura middlewares
app.use(cors());
app.use(express.json()); // Para parsear JSON no corpo das requisições

// Configurações do Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ---------------- ROTAS ---------------- //

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Rota para listar todas as demandas
app.get('/api/demandas', (req, res) => {
  db.all('SELECT * FROM demandas', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar as demandas' });
    } else {
      res.json(rows);
    }
  });
});

// Rota para adicionar nova demanda e enviar alerta no Telegram
app.post('/api/demandas', (req, res) => {
  const {
    nomeDemanda,
    nomeSolicitante,
    descricao,
    setor,
    prioridade,
    categoria,
    status  // novo
  } = req.body;

  const query = `
    INSERT INTO demandas (
      nomeDemanda, nomeSolicitante, descricao, setor, prioridade, categoria, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [nomeDemanda, nomeSolicitante, descricao, setor, prioridade, categoria,  status], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao inserir a demanda' });
    } 

    // Enviar resposta com sucesso
    res.status(201).json({ message: 'Demanda inserida com sucesso!', id: this.lastID });

    // Montar mensagem para Telegram
    const mensagem = `
📢 *Nova Demanda Recebida!*

📝 *Demanda:* ${nomeDemanda}
⚠️ *Prioridade:* ${prioridade}
👤 *Solicitante:* ${nomeSolicitante}
📂 *Setor:* ${setor}
🗂 *Categoria:* ${categoria}
📋 *Descrição:* ${descricao}
`;

    // Enviar mensagem para Telegram
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown'
      })
    })
    .then(response => response.json())
    .then(data => {
      if (!data.ok) {
        console.error('❌ Erro ao enviar mensagem para Telegram:', data.description);
      } else {
        console.log('✅ Mensagem enviada ao Telegram com sucesso.');
      }
    })
    .catch(error => {
      console.error('❌ Erro na conexão com Telegram:', error);
    });
  });
});

// Rota para atualizar demanda existente
app.put('/api/demandas/:id', (req, res) => {
  const { id } = req.params;
  const { nomeDemanda, nomeSolicitante, setor, prioridade, categoria, descricao, status } = req.body;

  const sql = `
    UPDATE demandas SET
      nomeDemanda = ?,
      nomeSolicitante = ?,
      setor = ?,
      prioridade = ?,
      categoria = ?,
      descricao = ?,
      status = ?
    WHERE id = ?
  `;

  db.run(sql, [nomeDemanda, nomeSolicitante, setor, prioridade, categoria, descricao, status, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar demanda.' });
    }
    res.json({ success: true });
  });
});

// Rota para excluir uma demanda
app.delete('/api/demandas/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM demandas WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir demanda.' });
    }
    res.json({ success: true });
  });
});



// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

// --- ROTAS DE MENSAGEM DO TÉCNICO --- //
app.post('/api/mensagem-tecnico', (req, res) => {
  const { mensagem } = req.body;

  const query = `
    INSERT INTO mensagem_tecnico (mensagem)
    VALUES (?)
  `;

  db.run(query, [mensagem], function (err) {
    if (err) {
      console.error('Erro ao salvar mensagem:', err);
      return res.status(500).json({ success: false, error: 'Erro ao salvar mensagem' });
    }

    res.json({ success: true });
  });
});

app.get('/api/mensagem-tecnico', (req, res) => {
  const query = `
    SELECT mensagem FROM mensagem_tecnico
    ORDER BY id DESC
    LIMIT 1
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Erro ao buscar mensagem:', err);
      return res.status(500).json({ success: false, error: 'Erro ao buscar mensagem' });
    }

    res.json({ mensagem: row ? row.mensagem : '' });
  });
});

// ❗️Somente aqui no final!
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});
