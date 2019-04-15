const STATE = {
  taskList: [], // список задач
  formState: "add", // [ add, edit, err ] - состсояние формы
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

function pushDataToList() {
  STATE.taskList.push(STATE.formData);
  STATE.formData = {
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
  if (!STATE.formData.taskName.length) {
    retVal.push("taskName");
  }
  if (!STATE.formData.taskDate.length) {
    retVal.push("taskDate");
  }
  return retVal;
}

function pushStateToLocalStorage() {
  const taksList = JSON.stringify(STATE.taskList);
  localStorage.setItem("taksList", taksList);
}

function handleAddTask() {
  collectDataFromForm();
  let checkResult = validateFromForm();
  if (!checkResult.includes("taskName")) {
    highlightFormField("taskName", SUCCESS);
  }
  if (!checkResult.includes("taskDate")) {
    highlightFormField("taskDate", SUCCESS);
  }
  if (checkResult.length) {
    checkResult.forEach(item => {
      highlightFormField(item, DANGER, "заполните поле");
    });
    return false;
  }
  pushDataToList();
  clearForm();
}
