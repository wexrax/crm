let currentView = 'feed';

function initApp() {
  const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  renderFeed();
  renderKanban();
  renderTasks();
  renderTeam();
  renderCalendar();
  renderAnalytics();
  renderComms();
  renderSettings();
  setupNavigation();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.view));
  });
}

function navigateTo(view) {
  currentView = view;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');

  document.querySelectorAll('.nav-item[data-view]').forEach(n => {
    n.classList.toggle('active', n.dataset.view === view);
  });

  const titles = {
    feed: ['Умная лента', 'Всё важное — в одном потоке'],
    deals: ['Сделки', 'Перетаскивайте карточки между стадиями'],
    tasks: ['Задачи', 'Мои задачи и задачи команды'],
    team: ['Команда', 'Статусы и загрузка сотрудников'],
    calendar: ['Календарь', 'Встречи и дедлайны'],
    analytics: ['Аналитика', 'Дашборды и инсайты'],
    comms: ['Коммуникации', 'Все каналы в одном месте'],
    settings: ['Настройки', 'Безопасность и интеграции'],
  };

  const [title, sub] = titles[view] || ['', ''];
  const titleEl = document.getElementById('pageTitle');
  const subEl = document.getElementById('pageSubtitle');
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;

  document.querySelector('.content').scrollTop = 0;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nexus-theme', next);
}

function showToast(message, icon = 'fa-check') {
  const el = document.getElementById('toast');
  const ic = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMessage');

  ic.className = 'fa-solid fa-' + icon;
  msg.textContent = message;
  el.classList.add('show');

  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2800);
}

document.addEventListener('DOMContentLoaded', initApp);
