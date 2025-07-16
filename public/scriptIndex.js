const tipoUsuario = localStorage.getItem('tipoUsuario');
document.addEventListener('DOMContentLoaded', () => {
  carregarMensagemTecnico();
  if (!tipoUsuario) {
    window.location.href = 'login.html';
    return;
  } 

  // Esconde botão e formulário para funcionário
  if (tipoUsuario === 'funcionario') {
    esconderFormularioMensagemTecnico();
  }

  // Técnico: esconde container da mensagem e mostra formulário para escrever
  if (tipoUsuario === 'tecnico') {
    document.getElementById('linkNovaDemanda').style.display = 'none';
    mostrarFormularioMensagemTecnico();

    // Oculta o container da mensagem visível para todos
    const msgContainer = document.getElementById('mensagemTecnicoContainer');
    if (msgContainer) msgContainer.style.display = 'none';
  }

  // Gestor: só esconde o formulário de envio
  if (tipoUsuario === 'gestor') {
    esconderFormularioMensagemTecnico();
  }

  carregarDashboard();
  configurarEventosMenu();
  configurarFecharModal();
  configurarBotaoExcluir();
  configurarBotaoEditar();
  carregarMensagemTecnico();
  configurarEventoEnviarMensagemTecnico();
});

function esconderMensagemTecnicoSeNecessario() {
  if (tipoUsuario === 'tecnico') {
    const msgContainer = document.getElementById('mensagemTecnicoContainer');
    if (msgContainer) msgContainer.style.background = 'none';
  }
}


function esconderFormularioMensagemTecnico() {
  const formMsg = document.getElementById('formMensagemTecnico');
  if (formMsg) formMsg.style.display = 'none';
}

function mostrarFormularioMensagemTecnico() {
  const formMsg = document.getElementById('formMensagemTecnico');
  if (formMsg) formMsg.style.display = 'block';
}

// Conteúdos HTML
const conteudoDashboard = `
  <div id="mensagemTecnicoContainer">
    <strong>Mensagem do Técnico:</strong>
    <p id="mensagemTecnicoTexto"></p>
  </div>

  <div class="prioridade-painel">
    <div class="card-prioridade prioridade-baixa">
      <strong>Baixa</strong>
      <p id="qtdBaixa">0 demandas</p>
    </div>
    <div class="card-prioridade prioridade-media">
      <strong>Média</strong>
      <p id="qtdMedia">0 demandas</p>
    </div>
    <div class="card-prioridade prioridade-alta">
      <strong>Alta</strong>
      <p id="qtdAlta">0 demandas</p>
    </div>
  </div>
`;


const conteudoDemandas = `
  <div id="cardsContainer" class="cards-grid"></div>
`;

const conteudoNovaDemanda = `


  <div class="right-panel">
    <h2>NOVA DEMANDA</h2>
    <form id="demandaForm">
      <label for="nomeDemanda">NOME DA DEMANDA</label>
      <input type="text" id="nomeDemanda" name="nomeDemanda" placeholder="Escreva aqui" required>

      <label for="nomeSolicitante">NOME DO SOLICITANTE</label>
      <input type="text" id="nomeSolicitante" name="nomeSolicitante" required>

      <label for="descricao">DESCRIÇÃO DETALHADA DA DEMANDA</label>
      <textarea id="descricao" name="descricao" rows="3" placeholder="Digite aqui" required></textarea>

      <label for="setor">SETOR</label>
      <select id="setor" name="setor" required>
        <option value="">SETORES</option>
        <option value="Vendas">Vendas</option>
        <option value="Financeiro">Financeiro</option>
        <option value="RH">RH</option>
        <option value="Operações">Operações</option>
        <option value="Marketing">Marketing</option>
        <option value="TI">TI</option>
      </select>

      <label for="prioridade">PRIORIDADE</label>
      <select id="prioridade" name="prioridade" required>
        <option value="">Selecione</option>
        <option value="Baixa">Baixa</option>
        <option value="Média">Média</option>
        <option value="Alta">Alta</option>
      </select>

      <label for="status">STATUS</label>
      <select id="status" name="status" required>
        <option value="Aguardando" selected>Aguardando</option>
        <option value="Em Andamento">Em Andamento</option>
        <option value="Concluído">Concluído</option>
      </select>

      <label for="categoria">CATEGORIA</label>
      <select id="categoria" name="categoria" required>
        <option value="Sistema">Sistema</option>
        <option value="Hardware">Hardware</option>
        <option value="Software">Software</option>
        <option value="Rede">Rede</option>
        <option value="Outros">Outros</option>
      </select>

      <div class="buttons">
        <button type="reset" class="btn-limpar">LIMPAR</button>
        <button type="submit" class="btn-criar">CRIAR DEMANDA</button>
      </div>

      <div class="success-msg" id="mensagemSucesso" style="display:none;">
        ✅ Demanda cadastrada com sucesso!
      </div>
    </form>
  </div>
`;

// Variável global para demanda selecionada
let demandaAtual = null;

// --- Funções principais ---

function carregarDashboard() {
  document.getElementById('conteudoPrincipal').innerHTML = conteudoDashboard;
  carregarMensagemTecnico();
  carregarResumoDemandas();
  configurarBotaoBaixarResumo();
  carregarMensagemTecnico(); // ✅ ADICIONE AQUI
}

function carregarResumoDemandas() {
  fetch('https://dashboard-f6ek.onrender.com/api/demandas')
    .then(res => res.json())
    .then(demandas => {
      const contagemPrioridades = { Alta: 0, Média: 0, Baixa: 0 };
      demandas.forEach(d => {
        if (contagemPrioridades[d.prioridade] !== undefined) {
          contagemPrioridades[d.prioridade]++;
        }
      });

      document.getElementById('qtdAlta').textContent = `${contagemPrioridades.Alta} demandas`;
      document.getElementById('qtdMedia').textContent = `${contagemPrioridades.Média} demandas`;
      document.getElementById('qtdBaixa').textContent = `${contagemPrioridades.Baixa} demandas`;
    })
    .catch(err => console.error('Erro ao carregar resumo:', err));
}


function configurarBotaoBaixarResumo() {
  const btn = document.getElementById('baixarResumo');
  if (!btn) return;
  btn.onclick = () => {
    alert('Função de baixar resumo ainda não implementada.');
  };
}

function carregarDemandas() {
  document.getElementById('conteudoPrincipal').innerHTML = conteudoDemandas;
 

  fetch('https://dashboard-f6ek.onrender.com/api/demandas')
    .then(res => res.json())
    .then(demandas => {
      const container = document.getElementById('cardsContainer');
      container.innerHTML = '';

      demandas.forEach(demanda => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Define a classe de prioridade conforme o valor
        let prioridadeClass = '';
        if (demanda.prioridade === 'Alta') prioridadeClass = 'prioridade prioridade-alta';
        else if (demanda.prioridade === 'Média') prioridadeClass = 'prioridade prioridade-media';
        else prioridadeClass = 'prioridade prioridade-baixa';

        // Monta o card com layout igual ao da imagem
        card.innerHTML = `
          <h3>${demanda.nomeDemanda}</h3>
          <span class="${prioridadeClass}">${demanda.prioridade}</span>
          <p>${demanda.descricao.slice(0, 100)}...</p>
        `;

        card.addEventListener('click', () => abrirModalDemanda(demanda));
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Erro ao carregar demandas:', err));
}

// Corrige botão de fechar modal
function configurarFecharModal() {
  const btnClose = document.querySelector('.close-btn');
  const modal = document.getElementById('modal');

  if (btnClose && modal) {
    btnClose.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
}



function abrirModalDemanda(demanda) {
  demandaAtual = demanda;

  document.getElementById('modalTitulo').textContent = demanda.nomeDemanda;
  document.getElementById('modalSolicitante').textContent = demanda.nomeSolicitante;
  document.getElementById('modalSetor').textContent = demanda.setor;
  document.getElementById('modalPrioridade').textContent = demanda.prioridade;
  document.getElementById('modalCategoria').textContent = demanda.categoria;
  document.getElementById('modalDescricao').textContent = demanda.descricao;
  document.getElementById('modalData').textContent = new Date(demanda.dataCriacao).toLocaleString();

  const selectStatusModal = document.getElementById('selectStatusModal');
  if (selectStatusModal) selectStatusModal.value = demanda.status || 'Aguardando';

  document.getElementById('modal').style.display = 'block';

  configurarBotaoAtualizarStatus();

  // Configura o botão fechar modal aqui para garantir funcionamento
  configurarFecharModal();
}

function configurarFecharModal() {
  const btnClose = document.querySelector('.close-btn');
  if (!btnClose) return;

  // Remove listeners antigos para evitar duplicação
  btnClose.onclick = null;
  window.onclick = null;

  btnClose.onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  };
}

function configurarBotaoExcluir() {
  const btnDelete = document.querySelector('.btn-delete');
  if (!btnDelete) return;

  btnDelete.onclick = () => {
    if (!demandaAtual) {
      alert('Nenhuma demanda selecionada!');
      return;
    }
    if (!confirm(`Deseja excluir a demanda "${demandaAtual.nomeDemanda}"?`)) return;

    fetch(`https://dashboard-f6ek.onrender.com/api/demandas/${demandaAtual.id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Demanda excluída com sucesso!');
        carregarDemandas();
        document.getElementById('modal').style.display = 'none';
      } else {
        alert('Erro ao excluir demanda.');
      }
    })
    .catch(err => {
      alert('Erro na conexão.');
      console.error(err);
    });
  };
}

function configurarBotaoEditar() {
  const btnEdit = document.querySelector('.btn-edit');
  if (!btnEdit) return;

  btnEdit.onclick = () => {
    if (!demandaAtual) {
      alert('Nenhuma demanda selecionada!');
      return;
    }

    const novoNome = prompt('Novo nome da demanda:', demandaAtual.nomeDemanda);
    const novaDescricao = prompt('Nova descrição:', demandaAtual.descricao);

    if (novoNome && novaDescricao) {
      fetch(`https://dashboard-f6ek.onrender.com/api/demandas/${demandaAtual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeDemanda: novoNome,
          nomeSolicitante: demandaAtual.nomeSolicitante,
          setor: demandaAtual.setor,
          prioridade: demandaAtual.prioridade,
          categoria: demandaAtual.categoria,
          descricao: novaDescricao,
          status: demandaAtual.status
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Demanda editada com sucesso!');
          carregarDemandas();
          document.getElementById('modal').style.display = 'none';
        } else {
          alert('Erro ao editar demanda.');
        }
      })
      .catch(err => {
        alert('Erro na conexão.');
        console.error(err);
      });
    }
  };
}

function configurarBotaoAtualizarStatus() {
  const btnAtualizar = document.getElementById('btnAtualizarStatus');
  if (!btnAtualizar) return;

  btnAtualizar.onclick = () => {
    if (!demandaAtual) {
      alert('Nenhuma demanda selecionada!');
      return;
    }

    const novoStatus = document.getElementById('selectStatusModal').value;

    fetch(`https://dashboard-f6ek.onrender.com/api/demandas/${demandaAtual.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeDemanda: demandaAtual.nomeDemanda,
        nomeSolicitante: demandaAtual.nomeSolicitante,
        setor: demandaAtual.setor,
        prioridade: demandaAtual.prioridade,
        categoria: demandaAtual.categoria,
        descricao: demandaAtual.descricao,
        status: novoStatus
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Status atualizado com sucesso!');
        document.getElementById('modal').style.display = 'none';
        carregarDemandas();
      } else {
        alert('Erro ao atualizar status.');
      }
    })
    .catch(err => {
      alert('Erro na conexão.');
      console.error(err);
    });
  };
}

function carregarNovaDemanda() {
  document.getElementById('conteudoPrincipal').innerHTML = conteudoNovaDemanda;

  const form = document.getElementById('demandaForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    carregarMensagemTecnico(); // ✅ ADICIONE AQUI

    const nomeDemanda = document.getElementById('nomeDemanda').value.trim();
    const nomeSolicitante = document.getElementById('nomeSolicitante').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const setor = document.getElementById('setor').value;
    const prioridade = document.getElementById('prioridade').value;
    const status = document.getElementById('status').value;
    const categoria = document.getElementById('categoria').value;

    fetch('https://dashboard-f6ek.onrender.com/api/demandas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeDemanda, nomeSolicitante, descricao, setor, prioridade, status, categoria })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('mensagemSucesso').style.display = 'block';
        form.reset();
      } else {
        alert('Erro ao cadastrar demanda.');
      }
    })
    .catch(err => {
      alert('Erro na conexão.');
      console.error(err);
    });
  });
}

function configurarEventosMenu() {
  document.getElementById('linkDashboard').addEventListener('click', e => {
    e.preventDefault();
    carregarDashboard();
    marcarAtivo('linkDashboard');
  });

  document.getElementById('linkDemandas').addEventListener('click', e => {
    e.preventDefault();
    carregarDemandas();
    marcarAtivo('linkDemandas');
  });

  document.getElementById('linkNovaDemanda').addEventListener('click', e => {
    e.preventDefault();
    carregarNovaDemanda();
    marcarAtivo('linkNovaDemanda');
  });
}

function marcarAtivo(idAtivo) {
  const links = document.querySelectorAll('.nav a');
  links.forEach(link => link.classList.remove('ativo'));

  const linkAtivo = document.getElementById(idAtivo);
  if (linkAtivo) linkAtivo.classList.add('ativo');
}

function sair() {
  localStorage.clear();
  window.location.href = 'login.html';
}
function carregarMensagemTecnico() {
  fetch('https://dashboard-f6ek.onrender.com/api/mensagem-tecnico')
    .then(res => res.json())
    .then(data => {
      console.log("Mensagem carregada:", data.mensagem); // ✅ AJUDA A TESTAR

      const container = document.getElementById('mensagemTecnicoContainer');
      const texto = document.getElementById('mensagemTecnicoTexto');

      if (data.mensagem && data.mensagem.trim() !== '') {
        container.style.display = 'block';
        texto.textContent = data.mensagem;
      } else {
        container.style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Erro ao carregar mensagem do técnico:', err);
    });
}


function configurarEventoEnviarMensagemTecnico() {
  const btnEnviar = document.getElementById('btnEnviarMensagem');
  if (!btnEnviar) return;

  btnEnviar.addEventListener('click', () => {
    const mensagem = document.getElementById('mensagemInput').value.trim();
    if (mensagem.length === 0) {
      alert('Digite uma mensagem antes de enviar.');
      return;
    }

    fetch('https://dashboard-f6ek.onrender.com/api/mensagem-tecnico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem })
    })
    .then(res => res.json())
    .then(data => {
      alert('Mensagem enviada com sucesso!');
      document.getElementById('mensagemInput').value = '';
      carregarMensagemTecnico();
    })
    .catch(err => {
      alert('Erro ao enviar mensagem.');
      console.error(err);
    });
  });
}
