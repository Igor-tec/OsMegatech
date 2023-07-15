// Objeto com as credenciais de login
const credentials = {
  Igor: '123456',
  Bruno: '123456',
  usuario3: 'senha3'
};

// Referências aos elementos do formulário de login
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');

// Adicionar um ouvinte de evento para o botão de login
loginButton.addEventListener('click', login);


// Para fazer o login pressionando Enter

document.getElementById("password").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("login-button").click();
  }
});

function login() {
  // Obter os valores de usuário e senha inseridos
  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  // Verificar se o usuário e a senha estão corretos
  const storedPassword = credentials[enteredUsername];

  if (storedPassword === enteredPassword) {
    // Autenticação bem-sucedida
    localStorage.setItem('loggedInUser', enteredUsername);
    // Redirecionar para a página index.html
    window.location.href = 'index.html';
  } else {
    // Autenticação falhou
    alert('Usuário ou senha incorretos. Por favor, tente novamente.');
    // Limpar os campos de entrada
    usernameInput.value = '';
    passwordInput.value = '';
    // Dar foco ao campo de usuário
    usernameInput.focus();
  }
}
