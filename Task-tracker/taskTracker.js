const STATE = {
  taskList: [], // список задач
  formState: 'add', // [ add, edit, err ] - состсояние формы
  editIndex: null,
  modalBody: null,
  modalType: null,
  isOpenedPopup: false, // true / false -флаг открыто/ закрыто модальное окно
  formData: {
    // данные формы
    taskName: null, // название задачи
    taskDescription: null, // описание
    taskDate: null, // дата
    taskUrgent: false // важность задачи
  }
};

function collectDataFromForm() {
  STATE.formData.taskName = document.getElementById('taskName').value;
  STATE.formData.taskDescription = document.getElementById('taskDescription').value;
  STATE.formData.taskDate = document.getElementById('taskDate').value;
  STATE.formData.taskUrgent = document.getElementById('taskUrgent').checked;
}

function clearForm() {
  document.getElementById('taskName').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskUrgent').checked = false;
  highlightFormField('taskDate');
  highlightFormField('taskName');
}

function fillForm({ taskName, taskDescription, taskDate, taskUrgent }) {
  document.getElementById('taskName').value = taskName;
  document.getElementById('taskDescription').value = taskDescription;
  document.getElementById('taskDate').value = taskDate;
  document.getElementById('taskUrgent').checked = taskUrgent;
  highlightFormField('taskDate', SUCCESS);
  highlightFormField('taskName', SUCCESS);
}

function pushDataToList() {
  if (STATE.formState === 'edit') {
    STATE.taskList[STATE.editIndex] = STATE.formData;
  } else {
    STATE.taskList.push(STATE.formData);
  }
  STATE.formState = 'add';
  STATE.formData = {
    taskName: null,
    taskDescription: null,
    taskDate: null,
    taskUrgent: false
  };
}

function validateFromForm() {
  const retVal = [];
  if (!STATE.formData.taskName) {
    retVal.push('taskName');
  }
  if (!STATE.formData.taskDate) {
    retVal.push('taskDate');
  }
  return retVal;
}

function initPage() {
  let localList;
  try {
    localList = JSON.parse(localStorage.getItem('TASKS'));
  } catch (e) {
    log('Coudnt init JSON from Local Storage', e);
  }
  STATE.taskList = localList || [];
  renderList();
}

function stateToStorage() {
  localStorage.setItem('TASKS', JSON.stringify(STATE.taskList));
  return true;
}

function handleClearList() {
  STATE.taskList = [];
  localStorage.removeItem('TASKS');
  renderList();
  clearForm();
  STATE.formState = 'add';
  STATE.formData = {
    taskName: null,
    taskDescription: null,
    taskDate: null,
    taskUrgent: false
  };
  renderButton();
}

function renderList() {
  const container = document.getElementById('taksList');
  let div = '';
  STATE.taskList.forEach((item, index) => {
    div += `<li class="list-group-item">`;
    div += item.taskUrgent ? '<i class="text-danger fa fa-exclamation-triangle"></i> &nbsp ' : '';
    div += `<a onclick="handleTaskInfo(event)" href="#">${item.taskName}</a><br>`;
    div += `<span class="text-muted"><small>${item.taskDate}</small></span><br>`;
    div += '<span class="edit_ico">';
    div += `<i data-id=${index} onClick="handleEditTask(event)" class="fas fa-edit"></i></span>`;
    div += '<span class="delete_ico">';
    div += `<i data-id=${index} onClick="handleDeleteTask(event)" class="fa fa-times"></i></span>`;
    div += '</li>';
  });
  div += '<button class="btn btn-danger" onclick="handleClearList();" style="margin-top: 10px;">';
  div += 'Clear List';
  div += '</button>';
  const noDiv =
    "<li class='list-group-item'><strong class='text-secondary'>Список пуст</strong></li>";
  container.innerHTML = STATE.taskList.length ? div : noDiv;
}

function handleClearForm() {
  if (STATE.formState === 'edit') {
    STATE.formState = 'add';
  }
  clearForm();
  renderButton();
}

function renderButton() {
  const button = document.getElementById('clickTask');
  const button2 = document.getElementById('clearCancel');
  const header = document.getElementById('form-header');
  if (STATE.formState === 'edit') {
    button.classList.remove('btn-primary');
    button.classList.add('btn-warning');
    button.textContent = 'Edit task';
    button2.textContent = 'Cancel';
    header.textContent = 'Edit Task';
  } else {
    button.classList.remove('btn-warning');
    button.classList.add('btn-primary');
    button.textContent = 'Add new task';
    button2.textContent = 'Clear form';
    header.textContent = 'Add Task';
  }
}

function handleDeleteTask(e) {
  STATE.formState = 'add';
  const index = e.target.getAttribute('data-id');
  STATE.taskList.splice(index, 1);
  renderAndSave();
}

function handleEditTask(e) {
  if (STATE.formState === 'add') {
    STATE.formState = 'edit';
    const index = e.target.getAttribute('data-id');
    fillForm(STATE.taskList[index]);
    STATE.editIndex = index;
  } else {
    STATE.formState = 'add';
    STATE.editIndex = null;
    clearForm();
  }
  renderButton();
}

function checkingErrors() {
  let checkResult = validateFromForm();
  if (!checkResult.includes('taskName')) highlightFormField('taskName', SUCCESS);
  if (!checkResult.includes('taskDate')) highlightFormField('taskDate', SUCCESS);
  if (checkResult.length) {
    checkResult.forEach(item => highlightFormField(item, DANGER, 'заполните поле'));
    return false;
  }
  if (!checkResult.length) return true;
}

function renderAndSave() {
  renderButton();
  clearForm();
  renderList();
  stateToStorage();
}

function handleTask() {
  collectDataFromForm();
  let noerrors = checkingErrors();
  if (noerrors) {
    pushDataToList();
    renderAndSave();
  }
}

function handleTaskInfo(e) {
  e.preventDefault();
  const index = e.currentTarget.parentNode
    .getElementsByClassName('fa-times')[0]
    .getAttribute('data-id');
  STATE.modalType = 'INFO';
  STATE.modalBody = STATE.taskList[index];
  renderModalWindow();
}

function renderModalWindow() {
  const modal = document.getElementById('modalWindow');
  modal.innerHTML = '';
  let div = '';
  div += '<div class="modal-dialog" role="document">';
  div += '<div class="modal-content">';
  div += '<div class="modal-header">';
  div += `<h5 class="modal-title">${STATE.modalType}</h5>`;
  div += '<button type="button" onclick="handleCloseModal();" class="close">';
  div += '<span aria-hidden="true">&times;</span>';
  div += '</button></div><div class="modal-body">';
  if (STATE.modalType === 'INFO') {
    div += `<p>Task Name: ${STATE.modalBody.taskName}</p>`;
    div += STATE.modalBody.taskDescription
      ? `<p>Task Description: ${STATE.modalBody.taskDescription}</p>`
      : '';
    div += `<p>Task Date: ${STATE.modalBody.taskDate}</p>`;
    div += STATE.modalBody.taskUrgent
      ? `<i class="text-danger fas fa-exclamation-triangle"></i>`
      : '';
  }
  div += '</div><div class="modal-footer">';
  div +=
    '<button type="button" class="btn btn-secondary" onclick="handleCloseModal();" data-dismiss="modal">';
  div += 'Close';
  div += '</button>';
  div += '<button type="button" class="btn btn-primary">Save changes</button>';
  div += '</div></div></div>';
  modal.innerHTML = div;
  modal.style.display = 'block';
}

function handleCloseModal() {
  const modal = document.getElementById('modalWindow');
  modal.style.display = 'none';
  modal.innerHTML = '';
}

function hasClass(elem, className) {
  return elem.classList.contains(className);
}
