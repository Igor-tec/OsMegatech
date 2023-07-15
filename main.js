// Arquivo main.js
// Contém as chamadas de função e configurações de eventos

// Referência ao modal
const modal = document.getElementById('task-details-modal');
const closeBtn = document.querySelector('.close');
const editBtn = document.getElementById('edit-task-button');
const closeModalBtn = document.getElementById('close-modal-button');

// Adicionar um ouvinte de evento para o botão "Adicionar Ordem de Serviço"
const addOrderButton = document.getElementById('add-task-button');
addOrderButton.addEventListener('click', addOrder);

// Adicionar um ouvinte de evento para o botão de fechar do modal
closeBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// Adicionar um ouvinte de evento para o botão de detalhes
const taskListBody = document.getElementById('task-list-body');
taskListBody.addEventListener('click', function (event) {
  const target = event.target;
  if (target.tagName === 'BUTTON' && target.classList.contains('order-details-button')) {
    const orderId = target.dataset.orderId;
    openOrderDetails(orderId);
  }
});

// Adicionar um ouvinte de evento para o botão de editar
editBtn.addEventListener('click', function () {
  const orderId = editBtn.getAttribute('data-order-id');
  if (orderId) {
    editOrder(orderId);
  }
});

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('minimized');
}

// Exibir as ordens de serviço inicialmente
displayOrders();
