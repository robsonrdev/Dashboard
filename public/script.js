document.getElementById('demandaForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nomeDemanda = document.getElementById('nomeDemanda').value;
  const nomeSolicitante = document.getElementById('nomeSolicitante').value;
  const descricao = document.getElementById('descricao').value;
  const setor = document.getElementById('setor').value;
  const prioridade = document.getElementById('prioridade').value;
  const categoria = document.getElementById('categoria').value;

  fetch('http://localhost:3000/api/demandas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nomeDemanda,
      nomeSolicitante,
      descricao,
      setor,
      prioridade,
      categoria
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Mostra a mensagem de sucesso (opcional)
    // document.getElementById('mensagemSucesso').style.display = 'block';
    // Resetar formulário (opcional)
    // document.getElementById('demandaForm').reset();

    // Redireciona para a página principal (index.html)
    window.location.href = 'index.html'; 
  })
  .catch(error => {
    console.error('Erro ao enviar demanda:', error);
    alert('Erro ao enviar a demanda!');
  });
});
