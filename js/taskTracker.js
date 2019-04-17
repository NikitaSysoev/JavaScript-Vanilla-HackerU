const STATE = {
  taskList: [], // список задач
  formState: "add", // [ add, edit, err ] - состсояние формы
  isOpenedPopup: false, // true / false -флаг открыто/ закрыто модальное окно
  formData: {
    // данные формы
    id: null, // уникальный идентификатор
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
  STATE.taskList = [...STATE.taskList, STATE.formData];
  STATE.formData = {
    id: null,
    taskName: null,
    taskDescription: null,
    taskDate: null,
    taskUrgent: false
  };
}

const DANGER = "danger";
const SUCCESS = "success";

function highlightFormField(id, tp, msg = "") {
  const message = msg;
  const dangerClass = "text-danger";
  const mutedClass = "text-muted";
  const formDangerClass = "is-invalid";
  const formSuccessClass = "is-valid";

  const type = tp === DANGER ? dangerClass : mutedClass;
  let htmlId = "";
  switch (id) {
    case "taskName":
      htmlId = "taskHelp";
      break;
    case "taskDescription":
      htmlId = "descriptionHelp";
      break;
    case "taskDate":
      htmlId = "dateHelp";
      break;
  }

  const helper = document.getElementById(htmlId);
  helper.classList.remove(dangerClass);
  helper.classList.remove(mutedClass);
  helper.classList.add(type);
  helper.innerText = message;

  const input = document.getElementById(id);
  input.classList.remove(formDangerClass);
  input.classList.remove(formSuccessClass);
  const label = input.closest(".form-group").getElementsByTagName("label")[0];
  const labelStar = label.getElementsByTagName("span")[0];
  labelStar.classList.remove(mutedClass);
  if (tp === DANGER) {
    input.classList.add(formDangerClass);
    label.classList.add(dangerClass);
    labelStar.classList.add(dangerClass);
  } else {
    input.classList.remove(formDangerClass);
    label.classList.remove(dangerClass);
    labelStar.classList.remove(dangerClass);
  }

  if (tp === SUCCESS) {
    input.classList.add(formSuccessClass);
    // label.classList.add(dangerClass);
    // labelStar.classList.add(dangerClass);
  } else {
    input.classList.remove(formSuccessClass);
    // label.classList.remove(dangerClass);
    // labelStar.classList.remove(dangerClass);
  }
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
    div += `<li id="${item.id}" class="list-group-item">${item.taskName} `;
    div += '<i class="fas fa-edit"></i> ';
    div += '<i class="far fa-trash-alt" style="cursor: pointer"></i>';
    div += "</li>";
  });
  div += "</ul>";
  container.innerHTML = div;
}

function handleDeleteTask(e) {
  const id = e.target.parentNode.id;
  STATE.taskList = STATE.taskList.filter(item => item.id !== id);
  stateToStorage();
  renderList();
}

function handleEditTask(e) {
  STATE.formState = "edit";
  const id = e.target.parentNode.id;
  const findedItem = STATE.taskList.find(item => item.id === id);
  const indexFindedItem = STATE.taskList.indexOf(findedItem);
  log(findedItem);
  log(indexFindedItem)
  fillForm(findedItem);
  collectDataFromForm();
}

function handleAddTask() {
  STATE.formState = "add";
  collectDataFromForm();
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
  pushDataToList();
  clearForm();
  renderList();
  stateToStorage();
}

function hasClass(elem, className) {
  return elem.classList.contains(className);
}
