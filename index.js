// Array para armazenar as ordens de serviço
let orders = [];

// Referência ao modal
const modal = document.getElementById('task-details-modal');
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector('.close');
const editBtn = document.getElementById('edit-task-button');
const closeModalBtn = document.getElementById('close-modal-button');

// Função para adicionar uma nova ordem de serviço
function addOrder() {
  // Obter o valor do campo de entrada do cliente e descrição
  const newOrderClientInput = document.getElementById('new-task-client');
  const newOrderDescriptionInput = document.getElementById('new-task-description');
  const newOrderAutomationSelect = document.getElementById('new-task-automation');

  const orderClient = newOrderClientInput.value.trim();
  const orderDescription = newOrderDescriptionInput.value.trim();
  const orderAutomation = newOrderAutomationSelect.value;

  // Verificar se os campos estão vazios
  if (orderClient === '' || orderDescription === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  // Obter o técnico que fez o login
  const loggedInTechnician = localStorage.getItem('loggedInUser');

  // Criar um objeto para representar a ordem de serviço
  const order = {
    id: generateOrderId(),
    client: orderClient,
    technician: loggedInTechnician,
    description: orderDescription,
    openDate: new Date().toLocaleString(),
    closeDate: '',
    automation: orderAutomation,
    status: 'Para Fazer',
    comments: [] // Inicializar a lista de comentários vazia
  };

  // Adicionar a nova ordem de serviço ao array de ordens
  orders.push(order);

  // Limpar os campos de entrada da nova ordem de serviço
  newOrderClientInput.value = '';
  newOrderDescriptionInput.value = '';

  // Atualizar a exibição das ordens de serviço
  displayOrders();
}

// Função para gerar um número de ordem de serviço aleatório
function generateOrderId() {
  const randomId = Math.floor(Math.random() * 900000) + 100000;
  return randomId;
}

// Função para exibir as ordens de serviço na tabela
function displayOrders() {
  const tableBody = document.getElementById('task-list-body');
  tableBody.innerHTML = '';

  for (const order of orders) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.client}</td>
      <td>${order.automation}</td>
      <td>${order.technician}</td>
      <td>${order.description}</td>
      <td>${order.openDate}</td>
      <td>${order.closeDate}</td>
      <td>${order.status}</td>
      <td class="task-actions-cell">
        <button class="view-details-button" data-order-id="${order.id}">Detalhes</button>
        <button class="delete-button" data-order-id="${order.id}">Excluir</button>
      </td>
    `;

    tableBody.appendChild(row);
  }

  // Registrar eventos para os botões "Detalhes" e "Excluir"
  const viewDetailsButtons = document.getElementsByClassName('view-details-button');
  const deleteButtons = document.getElementsByClassName('delete-button');

  for (const button of viewDetailsButtons) {
    button.addEventListener('click', showOrderDetails);
  }

  for (const button of deleteButtons) {
    button.addEventListener('click', deleteOrder);
  }
}

// Função para exibir os detalhes de uma ordem de serviço
function showOrderDetails(event) {
  const orderId = parseInt(event.target.getAttribute('data-order-id'));
  const order = findOrderById(orderId);

  if (order) {
    // Preencher os campos do modal com os detalhes da ordem de serviço
    document.getElementById('task-details-ticket').textContent = order.id;
    document.getElementById('task-details-client').textContent = order.client;
    document.getElementById('task-details-automation').textContent = order.automation;
    document.getElementById('task-details-technician').textContent = order.technician;
    document.getElementById('task-details-description').textContent = order.description;
    document.getElementById('task-details-open-date').textContent = order.openDate;
    document.getElementById('task-details-close-date').textContent = order.closeDate;
    document.getElementById('task-details-status').textContent = order.status;

    // Preencher a lista de comentários
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    for (const comment of order.comments) {
      const commentItem = document.createElement('li');
      commentItem.textContent = `${comment.technician} - ${comment.date} - ${comment.text}`;
      commentsList.appendChild(commentItem);
    }

    // Limpar o campo de texto do novo comentário
    document.getElementById('new-comment-text').value = '';

    // Adicionar o evento para adicionar comentário
    const addCommentButton = document.getElementById('add-comment-button');
    addCommentButton.removeEventListener('click', addComment); // Remover o evento anterior, se existir
    addCommentButton.addEventListener('click', () => {
      const newCommentText = document.getElementById('new-comment-text').value.trim();
      if (newCommentText !== '') {
        const comment = {
          technician: order.technician,
          date: new Date().toLocaleString(),
          text: newCommentText
        };
        order.comments.push(comment);
        showOrderDetails(event); // Atualizar os detalhes da ordem de serviço para exibir o novo comentário
      }
    });

    // Exibir o modal
    modal.style.display = 'block';
  }
}



// Função para adicionar um comentário a uma ordem de serviço
function addComment(order) {
  const newCommentText = document.getElementById('new-comment-text').value.trim();

  if (newCommentText !== '') {
    const comment = {
      text: newCommentText,
      date: new Date().toLocaleString(),
      technician: localStorage.getItem('loggedInUser')
    };

    order.comments.push(comment);
    document.getElementById('new-comment-text').value = '';

    // Atualizar a exibição dos comentários
    const commentsList = document.getElementById('comments-list');
    const commentItem = document.createElement('li');
    commentItem.textContent = `${comment.technician} - ${comment.date} - ${comment.text}`;
    commentsList.appendChild(commentItem);
  }
}


// Função para fechar o modal
function closeModal() {
  modal.style.display = 'none';
}

// Função para excluir uma ordem de serviço
function deleteOrder(event) {
  const orderId = parseInt(event.target.getAttribute('data-order-id'));
  const orderIndex = findOrderIndexById(orderId);

  if (orderIndex > -1) {
    orders.splice(orderIndex, 1);
    displayOrders();
  }
}

// Função para encontrar uma ordem de serviço pelo ID
function findOrderById(orderId) {
  return orders.find((order) => order.id === orderId);
}

// Função para encontrar o índice de uma ordem de serviço pelo ID
function findOrderIndexById(orderId) {
  return orders.findIndex((order) => order.id === orderId);
}

// Função para classificar a tabela de acordo com o índice da coluna
function sortTable(columnIndex) {
  orders.sort((a, b) => {
    let valueA = '';
    let valueB = '';

    switch (columnIndex) {
      case 0: // Número do Ticket
        valueA = a.id;
        valueB = b.id;
        break;
      case 1: // Cliente
        valueA = a.client.toLowerCase();
        valueB = b.client.toLowerCase();
        break;
      case 2: // Automação
        valueA = a.automation.toLowerCase();
        valueB = b.automation.toLowerCase();
        break;
      case 3: // Técnico
        valueA = a.technician.toLowerCase();
        valueB = b.technician.toLowerCase();
        break;
      case 4: // Descrição
        valueA = a.description.toLowerCase();
        valueB = b.description.toLowerCase();
        break;
      case 5: // Data de Abertura
        valueA = new Date(a.openDate);
        valueB = new Date(b.openDate);
        break;
      case 6: // Data de Conclusão
        valueA = a.closeDate ? new Date(a.closeDate) : '';
        valueB = b.closeDate ? new Date(b.closeDate) : '';
        break;
      case 7: // Status
        valueA = a.status.toLowerCase();
        valueB = b.status.toLowerCase();
        break;
    }

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });

  // Atualizar a exibição das ordens de serviço
  displayOrders();
}

// Adicionar evento de clique para o botão "Adicionar Ordem de Serviço"
const addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', addOrder);

// Adicionar evento de clique para o botão "Fechar" do modal
closeBtn.addEventListener('click', closeModal);

// Exibir as ordens de serviço iniciais
displayOrders();
