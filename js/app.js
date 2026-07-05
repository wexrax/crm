let currentView = 'feed';
let searchResultsCache = [];

function initApp() {
  const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  renderFeed();
  renderKanban();
  renderTasks();
  renderTeam();
  renderCalendar();
  renderComms();
  renderSettings();
  renderCompanies();
  renderContacts();
  renderProcesses();
  renderBoards();
  renderMarketing();
  renderHR();
  renderMessenger();
  renderHomeStats();
  renderHomeAnalytics();
  setupNavigation();
  setupGlobalSearch();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.view));
  });
  setupMobileMenu();
  setupTooltips();
}

function setupMobileMenu() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileMenu();
  });
}

function setupTooltips() {
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.style.cssText = 'position:fixed;background:rgba(20,22,38,.95);color:#fff;font-size:12px;padding:6px 12px;border-radius:8px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease,filter .2s ease;z-index:9999;border:1px solid rgba(255,255,255,.08);filter:blur(4px);transform:translateY(-50%) translateX(-4px)';
  document.body.appendChild(tip);

  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    const label = item.querySelector('.tooltip');
    if (!label) return;
    const text = label.textContent;
    item.addEventListener('mouseenter', () => {
      const r = item.getBoundingClientRect();
      tip.textContent = text;
      tip.style.left = (r.right + 10) + 'px';
      tip.style.top = (r.top + r.height / 2) + 'px';
      tip.style.transition = 'none';
      tip.style.opacity = '0';
      tip.style.transform = 'translateY(-50%) translateX(-4px)';
      tip.style.filter = 'blur(4px)';
      tip.offsetHeight;
      tip.style.transition = 'opacity .2s ease, transform .2s ease, filter .2s ease';
      tip.style.opacity = '1';
      tip.style.transform = 'translateY(-50%) translateX(0)';
      tip.style.filter = 'blur(0)';
    });
    item.addEventListener('mouseleave', () => {
      tip.style.opacity = '0';
      tip.style.transform = 'translateY(-50%) translateX(-4px)';
      tip.style.filter = 'blur(4px)';
    });
  });
}

function navigateTo(view) {
  const el = document.getElementById('view-' + view);
  if (!el) return;
  if (view === currentView && el.classList.contains('active')) {
    closeMobileMenu();
    return;
  }

  currentView = view;

  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.animation = 'none';
  });

  void el.offsetHeight;
  el.style.animation = '';
  el.classList.add('active');

  document.querySelectorAll('.nav-item[data-view]').forEach(n => {
    n.classList.toggle('active', n.dataset.view === view);
  });

  const titles = {
    feed: ['Доброе утро, Анна', '3 встречи · 7 задач · новые уведомления'],
    deals: ['Сделки', '8 активных сделок · прогноз ₽ 18,4М'],
    companies: ['Компании', '248 компаний'],
    contacts: ['Контакты', '312 контактов'],
    tasks: ['Задачи', '7 активных · 2 срочные'],
    proc: ['Процессы', '4 процесса · 3 требуют решения'],
    mkt: ['Маркетинг', 'Кампании · сегменты · ROI'],
    boards: ['Проекты', 'Канбан · Гантт · ресурсы'],
    hr: ['HR', '14 вакансий · 187 кандидатов'],
    team: ['Команда', '6 сотрудников'],
    chats: ['Чаты', 'Мессенджер команды'],
    comms: ['Коммуникации', 'Видео · чат · почта · телефония'],
    calendar: ['Календарь', 'Встречи и дедлайны'],
    settings: ['Настройки', 'Безопасность · роли · интеграции'],
    'company-card': ['', ''],
    'deal-card': ['', ''],
    'contact-card': ['', ''],
  };

  const [title, sub] = titles[view] || ['', ''];
  const titleEl = document.getElementById('pageTitle');
  const subEl = document.getElementById('pageSubtitle');
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;

  if (view === 'chats') renderMessenger();
  if (view === 'companies') renderCompanies();
  if (view === 'contacts') renderContacts();

  const content = document.querySelector('.content');
  if (content) content.scrollTop = 0;
  closeMobileMenu();
}

function toggleMobileMenu() {
  const isOpen = document.body.classList.contains('sidebar-open');
  if (isOpen) closeMobileMenu();
  else openMobileMenu();
}

function openMobileMenu() {
  document.body.classList.add('sidebar-open');
  const button = document.getElementById('mobileMenuBtn');
  if (button) button.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  document.body.classList.remove('sidebar-open');
  const button = document.getElementById('mobileMenuBtn');
  if (button) button.setAttribute('aria-expanded', 'false');
}

function setupGlobalSearch() {
  const box = document.getElementById('globalSearchBox');
  const input = document.getElementById('globalSearchInput');
  const panel = document.getElementById('globalSearchResults');
  if (!box || !input || !panel) return;

  input.addEventListener('input', () => renderGlobalSearch(input.value));
  input.addEventListener('focus', () => renderGlobalSearch(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && searchResultsCache.length) {
      e.preventDefault();
      openGlobalSearchResult(0);
    }
    if (e.key === 'Escape') {
      input.value = '';
      closeGlobalSearch();
      input.blur();
    }
  });

  panel.addEventListener('mousedown', e => {
    const row = e.target.closest('.search-result');
    if (!row) return;
    e.preventDefault();
    openGlobalSearchResult(Number(row.dataset.index));
  });

  document.addEventListener('click', e => {
    if (!box.contains(e.target)) closeGlobalSearch();
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

function renderGlobalSearch(value) {
  const box = document.getElementById('globalSearchBox');
  const panel = document.getElementById('globalSearchResults');
  const query = (value || '').trim();
  if (!box || !panel) return;

  if (!query) {
    closeGlobalSearch();
    return;
  }

  const q = normalizeSearch(query);
  searchResultsCache = buildSearchIndex()
    .filter(item => item.haystack.includes(q))
    .slice(0, 8);

  box.classList.add('search-open');

  if (!searchResultsCache.length) {
    panel.innerHTML = '<div class="search-empty">Ничего не найдено</div>';
    return;
  }

  panel.innerHTML = searchResultsCache.map((item, index) =>
    '<div class="search-result" data-index="' + index + '">' +
      '<div class="search-result-icon">' + searchIconHtml(item.icon) + '</div>' +
      '<div class="search-result-body">' +
        '<div class="search-result-title">' + escapeHtml(item.title) + '</div>' +
        '<div class="search-result-meta">' + escapeHtml(item.meta) + '</div>' +
      '</div>' +
      '<span class="search-result-type">' + escapeHtml(item.type) + '</span>' +
    '</div>'
  ).join('');
}

function openGlobalSearchResult(index) {
  const item = searchResultsCache[index];
  const input = document.getElementById('globalSearchInput');
  if (!item) return;

  if (input) input.value = '';
  closeGlobalSearch();
  navigateTo(item.view);

  setTimeout(() => {
    if (item.action === 'deal') openDealModal(item.id);
    if (item.action === 'process') openProcessModal(item.id);
    if (item.action === 'chat') openChat(item.id);
    if (item.action === 'hr-tab') setHrTab(item.tab);
    if (item.action === 'marketing-tab') setMktTab(item.tab);
    if (item.action === 'board-mode') switchBdView(item.mode);
  }, 80);
}

function closeGlobalSearch() {
  const box = document.getElementById('globalSearchBox');
  const panel = document.getElementById('globalSearchResults');
  searchResultsCache = [];
  if (box) box.classList.remove('search-open');
  if (panel) panel.innerHTML = '';
}

function buildSearchIndex() {
  const items = [];
  const add = item => {
    const text = [item.title, item.meta, item.type, item.keywords].filter(Boolean).join(' ');
    items.push({ ...item, haystack: normalizeSearch(text) });
  };

  [
    ['feed', 'Раздел', 'Умная лента', '3 встречи · 7 задач · уведомления', 'fa-house'],
    ['deals', 'Раздел', 'Воронка продаж', '8 активных сделок · прогноз ₽ 18,4М', 'fa-briefcase'],
    ['companies', 'Раздел', 'Компании', '248 компаний', 'fa-building'],
    ['contacts', 'Раздел', 'Контакты', '312 контактов', 'fa-user-tie'],
    ['tasks', 'Раздел', 'Задачи', '7 активных · 2 срочные', 'fa-circle-check'],
    ['proc', 'Раздел', 'Процессы', '4 процесса · 3 требуют решения', 'fa-diagram-project'],
    ['mkt', 'Раздел', 'Маркетинг', 'кампании · сегменты · ROI', 'fa-bullhorn'],
    ['boards', 'Раздел', 'Проекты', 'канбан · гантт · ресурсы', 'fa-table-columns'],
    ['hr', 'Раздел', 'HR · Персонал', '14 вакансий · 187 кандидатов', 'fa-user-plus'],
    ['team', 'Раздел', 'Команда', '6 сотрудников', 'fa-users'],
    ['chats', 'Раздел', 'Чаты', 'мессенджер команды', 'fa-message'],
    ['comms', 'Раздел', 'Коммуникации', 'видео · чат · почта · телефония', 'fa-comments'],
    ['calendar', 'Раздел', 'Календарь', 'встречи и дедлайны', 'fa-calendar-days'],
    ['settings', 'Раздел', 'Настройки', 'безопасность · роли · интеграции', 'fa-gear'],
  ].forEach(([view, type, title, meta, icon]) => add({ view, type, title, meta, icon }));

  APP_DATA.deals.forEach(d => add({
    view: 'deals',
    type: 'Сделка',
    title: d.company,
    meta: `${Utils.money(d.amount)} · ${d.contact} · ${d.owner}`,
    icon: 'fa-briefcase',
    action: 'deal',
    id: d.id,
    keywords: `${d.city} ${d.industry} ${d.phone}`,
  }));

  APP_DATA.companies.forEach(c => add({
    view: 'companies',
    type: 'Компания',
    title: c.n,
    meta: `${c.inn} · ${c.resp}`,
    icon: 'fa-building',
    keywords: c.path,
  }));

  APP_DATA.contacts.forEach(c => add({
    view: 'contacts',
    type: 'Контакт',
    title: c.n,
    meta: `${c.phone} · ${c.resp}`,
    icon: 'fa-user',
    keywords: c.path,
  }));

  APP_DATA.tasks.forEach(t => add({
    view: 'tasks',
    type: 'Задача',
    title: t.name,
    meta: `${Utils.taskStatusLabel(t.status)} · ${t.sub}`,
    icon: 'fa-circle-check',
  }));

  APP_DATA.processes.forEach(p => add({
    view: 'proc',
    type: 'Процесс',
    title: p.n,
    meta: `${p.st} · ${p.sum} · ${p.from}`,
    icon: p.ic,
    action: 'process',
    id: p.id,
    keywords: p.step,
  }));

  APP_DATA.team.forEach(m => add({
    view: 'team',
    type: 'Сотрудник',
    title: m.name,
    meta: `${m.role} · ${Utils.statusLabel(m.status)}`,
    icon: 'fa-user',
  }));

  APP_DATA.comms.forEach(c => add({
    view: 'comms',
    type: 'Коммуникации',
    title: c.title,
    meta: c.desc,
    icon: c.icon,
  }));

  APP_DATA.settings.forEach(s => add({
    view: 'settings',
    type: 'Настройки',
    title: s.title,
    meta: s.desc,
    icon: s.icon,
  }));

  APP_DATA.hr.candidates.forEach(c => add({
    view: 'hr',
    type: 'Кандидат',
    title: c.n,
    meta: `${c.r} · ${c.src} · ${c.score}%`,
    icon: 'fa-id-card',
    action: 'hr-tab',
    tab: 'hire',
    keywords: c.tags.map(t => t[0]).join(' '),
  }));

  APP_DATA.hr.vacancies.forEach(v => add({
    view: 'hr',
    type: 'Вакансия',
    title: v.n,
    meta: `${v.dep} · ${v.loc} · ${v.cand} кандидатов`,
    icon: v.ic,
    action: 'hr-tab',
    tab: 'vac',
  }));

  APP_DATA.messenger.chats.forEach(c => add({
    view: 'chats',
    type: 'Чат',
    title: c.name,
    meta: `${c.sub} · ${c.prev}`,
    icon: 'fa-message',
    action: 'chat',
    id: c.id,
  }));

  APP_DATA.marketing.campaigns.forEach(c => add({
    view: 'mkt',
    type: 'Кампания',
    title: c.n,
    meta: `${c.ch} · ROI ${c.roi} · ${c.st}`,
    icon: c.ic,
    action: 'marketing-tab',
    tab: 'camp',
  }));

  return items;
}

function normalizeSearch(value) {
  return String(value || '').toLowerCase().replace(/ё/g, 'е');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function searchIconHtml(icon) {
  return '<i class="' + getIconClass(icon) + '"></i>';
}

function getIconClass(icon = 'fa-check') {
  const value = String(icon || 'fa-check').trim();
  if (value.includes('fa-solid') || value.includes('fa-regular') || value.includes('fa-brands')) {
    return value;
  }

  const iconName = value.startsWith('fa-') ? value : 'fa-' + value;
  const brandIcons = ['fa-telegram', 'fa-whatsapp'];
  const family = brandIcons.includes(iconName) ? 'fa-brands' : 'fa-solid';
  return family + ' ' + iconName;
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

  ic.className = getIconClass(icon);
  msg.textContent = message;
  el.classList.add('show');

  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2800);
}

function renderHomeStats() {
  const el = document.getElementById('homeStats');
  if (!el) return;
  const stats = [
    { icon: 'fa-briefcase', color: '#818cf8', value: '₽ 24,8М', label: 'Сделки в работе', trend: '+18% за месяц', trendUp: true },
    { icon: 'fa-bullseye', color: '#34d399', value: '85%', label: 'Выполнение плана', trend: '+5% к цели', trendUp: true },
    { icon: 'fa-list-check', color: '#fbbf24', value: '7', label: 'Активных задач', trend: '2 срочные', trendUp: false },
    { icon: 'fa-heart-pulse', color: '#f472b6', value: '96%', label: 'Здоровье базы', trend: 'Отлично', trendUp: true },
  ];
  el.innerHTML = stats.map(s => {
    const bg = s.color + '18';
    const trendIcon = s.trendUp ? 'fa-arrow-up' : 'fa-clock';
    return '<div class="stat-card" onclick="showToast(\'' + s.label + '\', \'' + s.icon + '\')">' +
      '<div class="stat-icon" style="background:' + bg + ';color:' + s.color + '"><i class="fa-solid ' + s.icon + '"></i></div>' +
      '<div class="stat-value">' + s.value + '</div>' +
      '<div class="stat-label">' + s.label + '</div>' +
      '<div class="stat-trend" style="color:' + (s.trendUp ? 'var(--green)' : 'var(--amber)') + '"><i class="fa-solid ' + trendIcon + '"></i> ' + s.trend + '</div>' +
      '</div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', initApp);
