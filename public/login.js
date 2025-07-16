document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;

  const contas = {
    gestor: '1234',
    tecnico: '1234',
    funcionario: '1234'
  };

  if (contas[usuario] && contas[usuario] === senha) {
    // Salva o tipo de usuário no localStorage
    localStorage.setItem('tipoUsuario', usuario);
    window.location.href = 'index.html'; // redireciona para o sistema
  } else {
    document.getElementById('erroLogin').style.display = 'block';
  }
});
