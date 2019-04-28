const STATE = {
  taskList: [], // список задач
  formState: 'add', // [ add, edit, err ] - состсояние формы
  editIndex: null,
  modalBody: null,
  modalType: null,
  calendarVisible: false,
  calendarDate: new Date(),
  currMonthCalendar: new Date().getMonth(),
  currYearCalendar: new Date().getFullYear(),
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
  renderCalendar(STATE.calendarDate.getFullYear(), STATE.calendarDate.getMonth());
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
    div += `<a onclick="handleTaskInfo(event)" data-id=${index} href="#">${item.taskName}</a><br>`;
    div += `<span class="text-muted"><small>${item.taskDate}</small></span><br>`;
    div += '<span class="edit_ico">';
    div += `<i data-id=${index} onClick="handleEditTask(event)" class="fas fa-edit"></i></span>`;
    div += '<span class="delete_ico">';
    div += `<i data-id=${index} onClick="handleDeleteTask(event)" class="fa fa-times"></i></span>`;
    div += '</li>';
  });
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
  const index = e.target.getAttribute('data-id');
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
  if (STATE.modalType === 'INFO') {
    div += `<h5 class="modal-title">${STATE.modalBody.taskName}</h5>`;
    div += '<button type="button" onclick="handleCloseModal();" class="close">';
    div += '<span aria-hidden="true">&times;</span>';
    div += '</button></div><div class="modal-body">';
    div += STATE.modalBody.taskDescription
      ? `<strong>Task Description: ${STATE.modalBody.taskDescription}</strong><br>`
      : '';
    div += `<strong>Task Date: ${STATE.modalBody.taskDate}</strong><br>`;
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

function handleShowCalendar(e) {
  if (STATE.calendarVisible) {
    return false;
  }
  const calendar = document.getElementById('calendar');
  const clickedIcon = e.target;
  const coords = clickedIcon.closest('.input-group-prepend').getBoundingClientRect();
  calendar.style.top = coords.bottom + 'px';
  calendar.style.left = coords.left + 'px';
  calendar.style.display = 'block';
  STATE.calendarVisible = true;
}

function handlePrevCalendar(e) {
  STATE.currMonthCalendar = STATE.currMonthCalendar - 1;
  if (STATE.currMonthCalendar < 0) {
    STATE.currMonthCalendar = 11;
    STATE.currYearCalendar = STATE.currYearCalendar - 1;
  }
  renderCalendar(STATE.currYearCalendar, STATE.currMonthCalendar);
}

function handleNextCalendar(e) {
  STATE.currMonthCalendar = STATE.currMonthCalendar + 1;
  if (STATE.currMonthCalendar > 11) {
    STATE.currMonthCalendar = 0;
    STATE.currYearCalendar = STATE.currYearCalendar + 1;
  }
  renderCalendar(STATE.currYearCalendar, STATE.currMonthCalendar);
}

function handleCloseCalendar(e) {
  const calendar = document.getElementById('calendar');
  calendar.style.display = 'none';
  STATE.calendarVisible = false;
}

function renderCalendar(yearToOperate, monthToOperate) {
  const dateToOperate = new Date(yearToOperate, monthToOperate);
  const year = dateToOperate.getFullYear();
  const month = dateToOperate.getMonth(); // месяц от 0 до 11, нужно прибавлять 1
  const dayMonth = new Date().getDate(); // какое число месяца
  let dayWeek = dateToOperate.getDay(); // от 0 до 6, причем 0 - это воскресение
  dayWeek = dayWeek === 0 ? 7 : dayWeek;
  const maximumDaysInPrevMonth = getLastDay(year, month - 1);
  const firstDay = getFirstDayOfMonth(year, month);

  let dayCounter = 1;
  let dayCounterAfter = 1;
  let str_out_week = '';

  for (let j = 1; j < 7; j++) {
    let str_out = '';
    for (let i = 1; i < 8; i++) {
      let tmpCellObject = {};
      if (firstDay.dayWeek > i && j == 1) {
        // если меньше чем 1е число текущего месяца - ячейки для предыдущего месяца
        const tmpDayMonth = maximumDaysInPrevMonth + i + 1 - firstDay.dayWeek;
        tmpCellObject = {
          className: ' class="not_current"',
          dataFullDate:
            tmpDayMonth +
            '.' +
            (month === 0 ? 12 : month) +
            '.' +
            (month === 0 ? yearToOperate - 1 : yearToOperate),
          dataDaymonth: tmpDayMonth
        };
      } else if (dayCounter > firstDay.maxDays) {
        // ячейки для следующего месяца
        tmpCellObject = {
          className: ' class="not_current"',
          dataFullDate:
            dayCounterAfter +
            '.' +
            (month === 11 ? 1 : month + 2) +
            '.' +
            (month == 11 ? yearToOperate + 1 : yearToOperate),
          dataDaymonth: dayCounterAfter++
        };
      } else {
        // ЯЧЕЙКИ для ТЕКУЩЕГО МЕСЯЦА
        let todayClass = '';
        const currrentDt = new Date();

        if (yearToOperate == currrentDt.getFullYear() && monthToOperate == currrentDt.getMonth()) {
          todayClass = dayCounter == dayMonth ? ' class="today"' : '';
        }

        tmpCellObject = {
          className: todayClass,
          dataFullDate: dayCounter + '.' + (month + 1) + '.' + yearToOperate,
          dataDaymonth: dayCounter++
        };
      }
      str_out += renderOneCalendarCell(tmpCellObject);
    }
    str_out_week += '<tr>' + str_out + '</tr>';
  }

  renderCalendarMonthHeader(yearToOperate, monthToOperate);
  const tableBody = document.getElementById('calendar_table').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = str_out_week;
}

function renderCalendarMonthHeader(year, month) {
  const text = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ];
  document.getElementById('monthHeader').innerHTML = text[month] + ' ' + year;
}

// формирует содержимое одной ячейки календаря и возвращает строку содержащую тег TD и все его содержимое
function renderOneCalendarCell({
  className = null,
  dataFullDate = null,
  dataDaymonth = null,
  cellText = null
}) {
  // if (! (className && dataWeek && dataDaymonth) )
  if (!className && !dataFullDate && !dataDaymonth) {
    return '<td>&nbsp;</td>';
  }
  return (
    '<td onclick="handleClickCalendarCell(event)" ' +
    className +
    ' data-fulldate="' +
    dataFullDate +
    '" data-daymonth="' +
    dataDaymonth +
    '">' +
    (cellText === null ? dataDaymonth : cellText) +
    '</td>'
  );
}

/* возвращает объект с 2 полями: на какой день недели выпадает первое число месяца и сколько всего в месяце дней*/
function getFirstDayOfMonth(yy, mm) {
  const firstDayOfCurrentMonth = new Date(yy, mm, 1); // дата на момент первого числа текущего месяца
  const month = firstDayOfCurrentMonth.getMonth(); // месяц от 0 до 11, нужно прибавлять 1
  // var dayMonth = firstDayOfCurrentMonth.getDate();
  let dayWeek = firstDayOfCurrentMonth.getDay(); // от 0 до 6, причем 0 - это воскресение
  dayWeek = dayWeek === 0 ? 7 : dayWeek;
  return {
    dayWeek, // номер дня недели первого числа текущего месяца
    maxDays: getLastDay(yy, mm) // максимальное количество дней  в текуще месяце (который был передан в качестве параметре )
  };
}

function getLastDay(yy, mm) {
  return new Date(yy, mm + 1, 0).getDate();
}

function handleClickCalendarCell(e) {
  log(e);
}
