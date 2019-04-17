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
  } else {
    input.classList.remove(formSuccessClass);
  }
}
