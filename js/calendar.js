const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DOWS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

let calendarDate = new Date(2026, 9, 1);

function renderCalendar() {
  const titleEl = document.getElementById('calendarTitle');
  const gridEl = document.getElementById('calendarGrid');
  if (!titleEl || !gridEl) return;

  titleEl.textContent = MONTHS[calendarDate.getMonth()] + ' ' + calendarDate.getFullYear();

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  let html = DOWS.map(d => `<div class="calendar-dow">${d}</div>`).join('');

  for (let i = firstDayOffset; i > 0; i--) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${daysInPrevMonth - i + 1}</div></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const events = APP_DATA.calendarEvents[d] || [];

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}">
        <div class="calendar-day-number">${d}</div>
        ${events.map(e => `<div class="calendar-event" style="background:${e.c}22;color:${e.c}">${e.t}</div>`).join('')}
      </div>`;
  }

  const totalCells = firstDayOffset + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${i}</div></div>`;
  }

  gridEl.innerHTML = html;
}

function shiftMonth(delta) {
  calendarDate.setMonth(calendarDate.getMonth() + delta);
  renderCalendar();
}
