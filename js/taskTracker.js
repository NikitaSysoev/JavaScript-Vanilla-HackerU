const STATE = {
  taskList: [], // список задач
  formState: "add", // [ add, edit, err ] - состсояние формы
  isOpenedPopup: false, // true / false -флаг открыто/ закрыто модальное окно
  formData: {
    // данные формы
    id: null, // уникальный идентификатор
    index: null, // индекс редактируемого элемента
    taskName: null, // название задачи
    taskDescription: null, // описание
    taskDate: null, // дата
    taskUrgent: false // важность задачи
  }
};

function collectDataFromForm() {
  // создаем уникальный идентификатор для кажого вновь созданнного таска
  STATE.formData.id = "id" + new Date().getTime();
  STATE.formData.taskName = document.getElementById("taskName").value;
  STATE.formData.taskDescription = document.getElementById(
    "taskDescription"
  ).value;
  STATE.formData.taskDate = document.getElementById("taskDate").value;
  STATE.formData.taskUrgent = document.getElementById("taskUrgent").checked;
}

function clearForm() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskUrgent").checked = false;
  highlightFormField("taskDate");
  highlightFormField("taskName");
}

function fillForm({ taskName, taskDescription, taskDate, taskUrgent }) {
  document.getElementById("taskName").value = taskName;
  document.getElementById("taskDescription").value = taskDescription;
  document.getElementById("taskDate").value = taskDate;
  document.getElementById("taskUrgent").checked = taskUrgent;
  highlightFormField("taskDate", SUCCESS);
  highlightFormField("taskName", SUCCESS);
}

function pushDataToList() {
  if (STATE.formState === "add") {
    STATE.taskList = [...STATE.taskList, STATE.formData];
  }
  if (STATE.formState === "edit") {
    const newArrayTaskList = [...STATE.taskList];
    newArrayTaskList.splice(STATE.formData.index, 1, STATE.formData);
    STATE.taskList = newArrayTaskList;
  }
  STATE.formState = "add";
  STATE.formData = {
    id: null,
    index: null,
    taskName: null,
    taskDescription: null,
    taskDate: null,
    taskUrgent: false
  };
}

function validateFromForm() {
  const retVal = [];
  if (!STATE.formData.taskName) {
    retVal.push("taskName");
  }
  if (!STATE.formData.taskDate) {
    retVal.push("taskDate");
  }
  return retVal;
}

function storageToState() {
  const localList = JSON.parse(localStorage.getItem("taksList"));
  STATE.taskList = Array.isArray(localList) ? localList : [];
}

function stateToStorage() {
  localStorage.setItem("taksList", JSON.stringify(STATE.taskList));
}

function renderList() {
  const container = document.getElementById("taksList");
  let div = '<ul class="list-group">';
  STATE.taskList.forEach(item => {
    div += `<li id="${item.id}" class="list-group-item">`;
    div += `<p>${item.taskName} `;
    div += item.taskUrgent ? '<i class="fas fa-exclamation"></i> ' : "";
    div += "</p>";
    div += `<p>${item.taskDescription}</p><p>${item.taskDate}</p>`;
    div += '<i class="fas fa-edit" style="cursor: pointer"></i> ';
    div += '<i class="far fa-trash-alt" style="cursor: pointer"></i>';
    div += "</li>";
  });
  div += "</ul>";
  container.innerHTML = div;
}

function renderButton() {
  const button = document.getElementById("clickTask");
  if (STATE.formState === "add") {
    button.classList.remove("btn-warning");
    button.classList.add("btn-primary");
    button.textContent = "Add new task";
  }
  if (STATE.formState === "edit") {
    button.classList.remove("btn-primary");
    button.classList.add("btn-warning");
    button.textContent = "Edit task";
  }
}

function handleDeleteTask(e) {
  STATE.formState = "add";
  const id = e.target.parentNode.id;
  STATE.taskList = STATE.taskList.filter(item => item.id !== id);
  renderAndSave();
}

function handleEditTask(e) {
  if (STATE.formState === "add") {
    STATE.formState = "edit";
    const id = e.target.parentNode.id;
    const findedItem = STATE.taskList.find(item => item.id === id);
    STATE.formData.index = STATE.taskList.indexOf(findedItem);
    fillForm(findedItem);
  } else {
    STATE.formState = "add";
    STATE.formData.index = null;
    clearForm();
  }
  renderButton();
}

function checkingErrors() {
  let checkResult = validateFromForm();
  if (!checkResult.includes("taskName"))
    highlightFormField("taskName", SUCCESS);
  if (!checkResult.includes("taskDate"))
    highlightFormField("taskDate", SUCCESS);
  if (checkResult.length) {
    checkResult.forEach(item =>
      highlightFormField(item, DANGER, "заполните поле")
    );
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

function hasClass(elem, className) {
  return elem.classList.contains(className);
}
