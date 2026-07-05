function renderCompanies(filter) {
  var el = document.getElementById('companiesTable');
  if (!el) return;
  var f = (filter || '').toLowerCase();
  var rows = APP_DATA.companies.filter(function(c) {
    if (!f) return true;
    return c.n.toLowerCase().includes(f) || c.inn.includes(f);
  });
  el.innerHTML = '<table><thead><tr><th><div class="tbl-chk"></div></th><th>Компания</th><th>Дела</th><th>Путь</th><th>Ответственный</th><th>Дата</th><th>ИНН</th><th>Статус</th></tr></thead><tbody>' +
    rows.map(function(c, idx) {
      var realIdx = APP_DATA.companies.indexOf(c);
      var pathHtml = c.path ? '<td><span style="color:#34d399;font-size:11.5px"><i class="fa-solid fa-circle-check"></i> ' + c.path + '</span></td>' : '<td></td>';
      return '<tr onclick="openCompanyCard(' + realIdx + ')" style="cursor:pointer">' +
        '<td><div class="tbl-chk"></div></td>' +
        '<td><div class="tbl-cell"><div class="tbl-cell-icon" style="background:' + c.c + '"><i class="fa-solid fa-building"></i></div><div><div class="tbl-cell-name">' + c.n + (c.inn !== '—' ? ' <span style="color:var(--text-faint);font-weight:400">ИНН ' + c.inn + '</span>' : '') + '</div><div class="tbl-cell-sub">Клиент</div></div></div></td>' +
        '<td><span class="tbl-link">' + c.deal + '<b>Связаться с клиентом</b></span></td>' +
        pathHtml +
        '<td><span style="color:var(--blue)"><i class="fa-solid fa-circle-user"></i> ' + c.resp + '</span></td>' +
        '<td>' + c.date + '</td>' +
        '<td>' + c.inn + '</td>' +
        '<td><span class="badge2" style="background:rgba(52,211,153,.18);color:#34d399">Квалифицирован</span></td>' +
        '</tr>';
    }).join('') +
    '</tbody></table>';
}

function filterCompanies(v) {
  renderCompanies(v);
}

function renderContacts(filter) {
  var el = document.getElementById('contactsTable');
  if (!el) return;
  var f = (filter || '').toLowerCase();
  var rows = APP_DATA.contacts.filter(function(c) {
    if (!f) return true;
    return c.n.toLowerCase().includes(f) || c.phone.includes(f);
  });
  el.innerHTML = '<table><thead><tr><th><div class="tbl-chk"></div></th><th>Контакт</th><th>Дела</th><th>Путь</th><th>Ответственный</th><th>Дата</th><th>Телефон</th><th>Статус</th></tr></thead><tbody>' +
    rows.map(function(c) {
      var pathHtml = c.path ? '<td><span style="color:#34d399;font-size:11.5px"><i class="fa-solid fa-circle-check"></i> ' + c.path + '</span></td>' : '<td></td>';
      return '<tr onclick="openContactCard(' + APP_DATA.contacts.indexOf(c) + ')" style="cursor:pointer">' +
        '<td><div class="tbl-chk"></div></td>' +
        '<td><div class="tbl-cell"><div class="tbl-cell-icon" style="background:' + c.c + '"><i class="fa-solid fa-user"></i></div><div><div class="tbl-cell-name">' + c.n + '</div><div class="tbl-cell-sub">Физлицо · Клиент</div></div></div></td>' +
        '<td><span class="tbl-link">' + c.deal + '<b>Связаться с клиентом</b></span></td>' +
        pathHtml +
        '<td><span style="color:var(--blue)"><i class="fa-solid fa-circle-user"></i> ' + c.resp + '</span></td>' +
        '<td>' + c.date + '</td>' +
        '<td>' + c.phone + '</td>' +
        '<td><span class="badge2" style="background:rgba(52,211,153,.18);color:#34d399">Квалифицирован</span></td>' +
        '</tr>';
    }).join('') +
    '</tbody></table>';
}

function filterContacts(v) {
  renderContacts(v);
}

function openCompanyCard(idx, from) {
  window._cardBack = from || 'companies';
  var c = APP_DATA.companies[idx];
  if (!c) return;
  var content = document.getElementById('companyCardContent');
  content.innerHTML = '';

  navigateTo('company-card');

  var initials = c.n.replace(/[,."]/g, '').split(' ').map(function(w) { return w[0]; }).filter(Boolean).slice(0, 2).join('').toUpperCase();
  var stars = '';
  for (var i = 0; i < 5; i++) stars += i < Math.floor(c.rating || 0) ? '★' : '☆';

  var contactsHtml = (c.contacts || []).map(function(ct) {
    return '<div class="cc-contact">' +
      '<div class="cc-contact-av">' + ct.av + '</div>' +
      '<div class="cc-contact-info"><div class="cc-contact-name">' + ct.name + '</div>' +
      '<div class="cc-contact-role">' + ct.role + ' <span class="cc-tag">' + ct.tag + '</span></div></div>' +
      '<div class="cc-contact-actions"><div class="cc-ic-btn"><i class="fa-solid fa-phone"></i></div><div class="cc-ic-btn"><i class="fa-solid fa-envelope"></i></div></div>' +
    '</div>';
  }).join('');

  var relatedHtml = (c.related || []).map(function(r) {
    return '<div class="cc-related"><i class="fa-solid ' + r.icon + '"></i><div><div class="cc-related-name">' + r.name + '</div><div class="cc-related-type">' + r.type + '</div></div></div>';
  }).join('');

  var tagsHtml = (c.tags || []).map(function(t) {
    return '<span class="cc-chip">' + t + ' <i class="fa-solid fa-xmark x"></i></span>';
  }).join('') + '<span class="cc-chip cc-chip-add"><i class="fa-solid fa-plus"></i> Тег</span>';

  var insightsHtml = (c.insights || []).map(function(ins) {
    var riskBar = ins.risk ? '<div class="cc-risk-bar"><div class="cc-risk-fill" style="width:' + ins.risk + '%"></div></div>' : '';
    var btn = ins.btn ? '<button class="cc-insight-btn" onclick="showToast(\'' + ins.btn.replace(/'/g, '') + '\', \'fa-check\')">' + ins.btn + '</button>' : '';
    return '<div class="cc-insight cc-in-' + ins.type + '">' +
      '<div class="cc-insight-icon"><i class="fa-solid ' + ins.icon + '"></i></div>' +
      '<div class="cc-insight-body"><div class="cc-insight-t">' + ins.title + '</div><div class="cc-insight-d">' + ins.desc + '</div>' + riskBar + btn + '</div>' +
    '</div>';
  }).join('');

  var dealsHtml = (c.dealsList || []).map(function(d) {
    return '<div class="cc-deal"><div><div class="cc-deal-name">' + d.name + '</div><div class="cc-deal-sub">' + d.sub + '</div><span class="cc-deal-stage ' + d.stageClass + '">' + d.stage + '</span></div><div class="cc-deal-sum">' + d.sum + '</div></div>';
  }).join('');

  var closedDealsHtml = (c.dealsClosed || []).map(function(d) {
    return '<div class="cc-deal"><div><div class="cc-deal-name">' + d.name + '</div><div class="cc-deal-sub">' + d.sub + '</div><span class="cc-deal-stage ' + d.stageClass + '">' + d.stage + '</span></div><div class="cc-deal-sum">' + d.sum + '</div></div>';
  }).join('');

  var commsHtml = (c.commsHistory || []).map(function(a) {
    return '<div class="cc-activity"><div class="cc-act-ic cc-act-' + a.cls.replace('act-', '') + '"><i class="fa-solid ' + a.icon + '"></i></div><div class="cc-act-txt">' + a.text + '<div class="cc-act-time">' + a.time + '</div></div></div>';
  }).join('');

  var contactsListHtml = (c.contacts || []).map(function(ct) {
    return '<div class="cc-contact"><div class="cc-contact-av">' + ct.av + '</div><div class="cc-contact-info"><div class="cc-contact-name">' + ct.name + '</div><div class="cc-contact-role">' + ct.role + '</div></div></div>';
  }).join('');

  var docsHtml = (c.docs || []).map(function(d) {
    return '<div class="cc-deal"><div><div class="cc-deal-name"><i class="fa-solid ' + d.icon + '" style="color:var(--text-faint)"></i> ' + d.name + '</div><div class="cc-deal-sub">' + d.meta + '</div></div><i class="fa-solid fa-download" style="color:var(--text-faint)"></i></div>';
  }).join('');

  var a = c.analytics || {};
  var analyticsHtml = '<div class="cc-chart">' +
    '<div class="cc-chart-bar"><div class="cc-chart-bar-fill" style="height:' + (a.q1 || 0) + '%"></div><div class="cc-chart-bar-label">Q1</div></div>' +
    '<div class="cc-chart-bar"><div class="cc-chart-bar-fill" style="height:' + (a.q2 || 0) + '%"></div><div class="cc-chart-bar-label">Q2</div></div>' +
    '<div class="cc-chart-bar"><div class="cc-chart-bar-fill" style="height:' + (a.q3 || 0) + '%"></div><div class="cc-chart-bar-label">Q3</div></div>' +
    '<div class="cc-chart-bar"><div class="cc-chart-bar-fill forecast" style="height:' + (a.q4 || 0) + '%"></div><div class="cc-chart-bar-label">Q4 (прогноз)</div></div>' +
  '</div><p class="cc-desc" style="margin-top:8px">Прогноз ИИ: рост выручки на 22% в Q4 при закрытии текущих сделок.</p>';

  var historyHtml = (c.history || []).map(function(a) {
    return '<div class="cc-activity"><div class="cc-act-ic cc-act-' + a.cls.replace('act-', '') + '"><i class="fa-solid ' + a.icon + '"></i></div><div class="cc-act-txt">' + a.text + '<div class="cc-act-time">' + a.time + '</div></div></div>';
  }).join('');

  var nextStepsHtml = (c.nextSteps || []).map(function(s) {
    return '<div class="cc-next-step"><i class="fa-solid ' + s.icon + ' cc-ns-ic"></i><div class="cc-ns-body"><div class="cc-ns-t">' + s.text + '</div><span class="cc-ns-btn" onclick="showToast(\'Выполнено\', \'fa-check\')">Выполнить →</span></div></div>';
  }).join('');

  var tasksHtml = (c.tasks || []).map(function(t, i) {
    return '<div class="cc-task" data-idx="' + i + '">' +
      '<div class="cc-task-check' + (t.done ? ' done' : '') + '"><i class="fa-solid fa-check" style="font-size:10px;opacity:' + (t.done ? '1' : '0') + '"></i></div>' +
      '<div class="cc-task-txt">' + t.text + '<div class="cc-task-due' + (t.overdue ? '' : ' ok') + '">' + t.due + '</div></div>' +
    '</div>';
  }).join('');

  var activitiesHtml = (c.activities || []).map(function(a) {
    return '<div class="cc-activity"><div class="cc-act-ic cc-act-' + a.cls.replace('act-', '') + '"><i class="fa-solid ' + a.icon + '"></i></div><div class="cc-act-txt">' + a.text + '<div class="cc-act-time">' + a.time + '</div></div></div>';
  }).join('');

  var html =
    '<div class="cc-back" onclick="closeCompanyCard()"><i class="fa-solid fa-arrow-left"></i> К воронке продаж</div>' +
    '<div class="cc-hero"><div class="cc-hero-top">' +
      '<div class="cc-logo" style="background:' + c.c + '">' + initials + '</div>' +
      '<div class="cc-hero-main">' +
        '<div class="cc-hero-name">' +
          '<h1>' + c.n + '</h1>' +
          '<i class="fa-solid fa-star cc-star' + (idx === 0 ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')" title="В избранном"></i>' +
          '<span class="cc-badge cc-bgreen"><i class="fa-solid fa-circle" style="font-size:7px"></i> Клиент</span>' +
          (idx === 0 ? '<span class="cc-badge cc-bkey"><i class="fa-solid fa-crown"></i> Ключевой аккаунт</span>' : '') +
        '</div>' +
        '<div class="cc-hero-meta">' +
          '<span><i class="fa-solid fa-industry"></i> ' + (c.industry || '—') + '</span>' +
          '<span><i class="fa-solid fa-location-dot"></i> ' + (c.city || '—') + '</span>' +
          '<span><i class="fa-solid fa-users"></i> ' + (c.employees || '—') + ' сотрудников</span>' +
          (c.inn !== '—' ? '<span><i class="fa-solid fa-hashtag"></i> ИНН ' + c.inn + '</span>' : '') +
        '</div>' +
        '<div class="cc-hero-rating">' +
          '<span class="cc-stars">' + stars + '</span>' +
          '<span class="cc-rating-num">' + (c.rating || '—') + '</span>' +
          '<span class="cc-rating-sub">· Клиент с ' + (c.clientSince || '—') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cc-hero-actions">' +
        '<button class="btn btn-ghost" onclick="showToast(\'Открыт чат с ' + c.n.replace(/"/g, '') + '\', \'fa-envelope\')"><i class="fa-solid fa-envelope"></i> Написать</button>' +
        '<button class="btn btn-primary" onclick="showToast(\'Звонок ' + (c.phone || '') + '\', \'fa-phone\')"><i class="fa-solid fa-phone"></i> Позвонить</button>' +
      '</div>' +
    '</div></div>' +
    '<div class="cc-grid">' +
      '<div class="cc-col">' +
        '<div class="cc-card"><div class="cc-card-title">О компании <span class="cc-edit">изменить</span></div>' +
          '<div class="cc-field"><div class="cc-field-label">Реквизиты</div><div class="cc-field-value link">' + c.n + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Ответственный</div><div class="cc-field-value">' + c.resp + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Телефон</div><div class="cc-field-value link">' + (c.phone || '—') + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">E-mail</div><div class="cc-field-value link">' + (c.email || '—') + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Регион</div><div class="cc-field-value">' + (c.city || '—') + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Годовой доход</div><div class="cc-field-value">' + (c.revenue || '—') + '</div></div>' +
        '</div>' +
        '<div class="cc-card"><div class="cc-card-title">Ключевые контакты <span class="cc-edit">+ добавить</span></div>' + contactsHtml + '</div>' +
        (relatedHtml ? '<div class="cc-card"><div class="cc-card-title">Связанные компании</div>' + relatedHtml + '</div>' : '') +
        '<div class="cc-card"><div class="cc-card-title">Источник</div><div class="cc-field"><div class="cc-field-value"><i class="fa-solid fa-bullhorn" style="color:var(--text-faint);margin-right:8px"></i>' + (c.source || '—') + '</div></div></div>' +
        '<div class="cc-card"><div class="cc-card-title">Теги</div><div class="cc-tags">' + tagsHtml + '</div></div>' +
      '</div>' +
      '<div class="cc-col">' +
        '<div class="cc-card">' +
          '<div class="cc-tabs" id="ccTabs">' +
            '<div class="cc-tab active" data-tab="cc-overview">Обзор</div>' +
            '<div class="cc-tab" data-tab="cc-deals">Сделки</div>' +
            '<div class="cc-tab" data-tab="cc-comms">Коммуникации</div>' +
            '<div class="cc-tab" data-tab="cc-contacts">Контакты</div>' +
            '<div class="cc-tab" data-tab="cc-docs">Документы</div>' +
            '<div class="cc-tab" data-tab="cc-analytics">Аналитика</div>' +
            '<div class="cc-tab" data-tab="cc-history">История</div>' +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-overview">' +
            '<div class="cc-metrics">' +
              '<div class="cc-metric"><div class="cc-metric-val">' + (c.totalRevenue || '—') + '</div><div class="cc-metric-lbl">Общая выручка</div></div>' +
              '<div class="cc-metric"><div class="cc-metric-val">' + (c.totalDeals || 0) + '</div><div class="cc-metric-lbl">Сделок всего</div></div>' +
              '<div class="cc-metric"><div class="cc-metric-val">' + (c.avgCheck || '—') + '</div><div class="cc-metric-lbl">Средний чек</div></div>' +
            '</div>' +
            '<p class="cc-desc">' + (c.desc || '') + '</p>' +
            (insightsHtml ? '<div class="cc-section-h"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--accent)"></i> Инсайты ИИ</div>' + insightsHtml : '') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-deals" style="display:none">' +
            (dealsHtml ? '<div class="cc-section-h">Активные сделки</div>' + dealsHtml : '<p class="cc-desc">Нет активных сделок</p>') +
            (closedDealsHtml ? '<div class="cc-section-h" style="margin-top:22px">Завершённые</div>' + closedDealsHtml : '') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-comms" style="display:none">' +
            '<div class="cc-section-h">История коммуникаций</div>' +
            (commsHtml || '<p class="cc-desc">Нет коммуникаций</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-contacts" style="display:none">' +
            '<div class="cc-section-h">Все контакты компании</div>' +
            (contactsListHtml || '<p class="cc-desc">Нет контактов</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-docs" style="display:none">' +
            '<div class="cc-section-h">Документы</div>' +
            (docsHtml || '<p class="cc-desc">Нет документов</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-analytics" style="display:none">' +
            '<div class="cc-section-h">Динамика продаж по кварталам</div>' +
            analyticsHtml +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cc-history" style="display:none">' +
            '<div class="cc-section-h">История изменений</div>' +
            (historyHtml || '<p class="cc-desc">Нет изменений</p>') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cc-col">' +
        (nextStepsHtml ? '<div class="cc-card"><div class="cc-card-title">Следующие шаги</div>' + nextStepsHtml + '</div>' : '') +
        (tasksHtml ? '<div class="cc-card"><div class="cc-card-title">Активные задачи</div>' + tasksHtml + '</div>' : '') +
        '<div class="cc-card"><div class="cc-card-title">Быстрые действия</div>' +
          '<div class="cc-qa-grid">' +
            '<button class="cc-qa" onclick="showToast(\'Создание сделки\', \'fa-handshake\')"><i class="fa-solid fa-handshake"></i><span>Создать сделку</span></button>' +
            '<button class="cc-qa" onclick="showToast(\'Добавление контакта\', \'fa-user-plus\')"><i class="fa-solid fa-user-plus"></i><span>Добавить контакт</span></button>' +
            '<button class="cc-qa" onclick="showToast(\'Назначение встречи\', \'fa-calendar-plus\')"><i class="fa-solid fa-calendar-plus"></i><span>Назначить встречу</span></button>' +
            '<button class="cc-qa" onclick="showToast(\'Отправка письма\', \'fa-envelope\')"><i class="fa-solid fa-envelope"></i><span>Отправить письмо</span></button>' +
          '</div>' +
        '</div>' +
        (activitiesHtml ? '<div class="cc-card"><div class="cc-card-title">Последние активности</div>' + activitiesHtml + '</div>' : '') +
      '</div>' +
    '</div>';

  content.innerHTML = html;

  document.getElementById('ccTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.cc-tab');
    if (!tab) return;
    document.querySelectorAll('#ccTabs .cc-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    var pane = tab.dataset.tab;
    document.querySelectorAll('#companyCardContent .cc-tab-pane').forEach(function(p) {
      p.style.display = p.dataset.pane === pane ? '' : 'none';
    });
  });

  document.querySelectorAll('#companyCardContent .cc-task-check').forEach(function(check) {
    check.addEventListener('click', function() {
      check.classList.toggle('done');
      var icon = check.querySelector('i');
      icon.style.opacity = check.classList.contains('done') ? '1' : '0';
      check.closest('.cc-task').classList.toggle('done');
    });
  });

  document.querySelectorAll('#companyCardContent .cc-chip .x').forEach(function(x) {
    x.addEventListener('click', function(e) { e.stopPropagation(); x.closest('.cc-chip').remove(); });
  });

  var scrollEl = document.querySelector('.content');
  if (scrollEl) scrollEl.scrollTop = 0;
}

function closeCompanyCard() {
  navigateTo(window._cardBack || 'companies');
}

function openDealByType(dealId) {
  var d = APP_DATA.deals.find(function(x) { return x.id === dealId; });
  if (!d) return;
  if (d.type === 'contact' && typeof d.contactIdx === 'number') {
    openContactCard(d.contactIdx, 'deals');
  } else {
    var idx = APP_DATA.companies.findIndex(function(c) { return c.n === d.company || c.n.indexOf(d.company) > -1; });
    if (idx >= 0) {
      openCompanyCard(idx, 'deals');
    } else {
      openDealCard(dealId);
    }
  }
}

function openDealCard(dealId) {
  var d = APP_DATA.deals.find(function(x) { return x.id === dealId; });
  if (!d) return;
  var stage = APP_DATA.stages.find(function(s) { return s.id === d.stage; });
  var initials = d.company.replace(/[,."]/g, '').split(' ').map(function(w) { return w[0]; }).filter(Boolean).slice(0, 2).join('').toUpperCase();

  navigateTo('deal-card');

  var el = document.getElementById('dealCardContent');
  el.innerHTML =
    '<div class="cc-back" onclick="closeDealCard()"><i class="fa-solid fa-arrow-left"></i> К воронке</div>' +
    '<div class="cc-hero"><div class="cc-hero-top">' +
      '<div class="cc-logo" style="background:' + Utils.avatarGradient(d.company) + '">' + initials + '</div>' +
      '<div class="cc-hero-main">' +
        '<div class="cc-hero-name"><h1>' + d.company + '</h1></div>' +
        '<div class="cc-hero-meta">' +
          '<span><i class="fa-solid fa-industry"></i> ' + (d.industry || '—') + '</span>' +
          '<span><i class="fa-solid fa-location-dot"></i> ' + (d.city || '—') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cc-hero-amount"><div class="cc-deal-sum">' + Utils.money(d.amount) + '</div><div class="cc-deal-prob">' + d.prob + '% готовность</div></div>' +
    '</div></div>' +
    '<div class="cc-grid">' +
      '<div class="cc-col">' +
        '<div class="cc-card">' +
          '<div class="cc-tabs" id="dealTabs">' +
            '<div class="cc-tab active" data-tab="d-overview">Обзор</div>' +
            '<div class="cc-tab" data-tab="d-comms">Коммуникации</div>' +
            '<div class="cc-tab" data-tab="d-tasks">Задачи</div>' +
            '<div class="cc-tab" data-tab="d-docs">Документы</div>' +
            '<div class="cc-tab" data-tab="d-history">История</div>' +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="d-overview">' +
            '<div class="pm-actions">' +
              '<button class="btn btn-primary btn-sm" onclick="showToast(\'Звонок ' + d.phone + '\', \'fa-phone\')"><i class="fa-solid fa-phone"></i> Позвонить</button>' +
              '<button class="btn btn-sm" onclick="showToast(\'Открыт чат\', \'fa-message\')"><i class="fa-solid fa-message"></i> Написать</button>' +
              '<button class="btn btn-sm" onclick="showToast(\'Встреча назначена\', \'fa-calendar\')"><i class="fa-solid fa-calendar-plus"></i> Встреча</button>' +
              '<button class="btn btn-sm" onclick="showToast(\'Задача создана\', \'fa-plus\')"><i class="fa-solid fa-plus"></i> Задача</button>' +
            '</div>' +
            '<div class="pm-info-grid">' +
              '<div class="pm-info-card"><div class="pm-info-label">Контактное лицо</div><div class="pm-info-value">' + d.contact + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Телефон</div><div class="pm-info-value">' + d.phone + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Ответственный</div><div class="pm-info-value">' + d.owner + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Стадия</div><div class="pm-info-value" style="color:' + (stage ? stage.color : 'var(--text)') + '">' + (stage ? stage.name : '—') + '</div></div>' +
            '</div>' +
            '<div style="margin-top:20px"><div class="cc-section-h">Следующие шаги</div>' +
              '<div class="cc-next-step"><i class="fa-solid fa-phone cc-ns-ic"></i><div class="cc-ns-body"><div class="cc-ns-t">Позвонить клиенту</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Обсудить условия оплаты и сроки внедрения</div><div style="font-size:11px;color:var(--text-faint);margin-top:4px">Рекомендовано сегодня в 10:00</div></div></div>' +
              '<div class="cc-next-step"><i class="fa-solid fa-file-lines cc-ns-ic"></i><div class="cc-ns-body"><div class="cc-ns-t">Отправить обновлённое КП</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Подготовлен черновик с учётом переговоров</div><div style="font-size:11px;color:var(--text-faint);margin-top:4px">До 16:00</div></div></div>' +
            '</div>' +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="d-comms" style="display:none">' +
            '<div class="cc-section-h">История коммуникаций</div>' +
            (d.commsHtml || '<p class="cc-desc">Нет коммуникаций</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="d-tasks" style="display:none">' +
            '<div class="cc-section-h">Задачи по сделке</div>' +
            (d.tasksHtml || '<p class="cc-desc">Нет задач</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="d-docs" style="display:none">' +
            '<div class="cc-section-h">Документы</div>' +
            (d.docsHtml || '<p class="cc-desc">Нет документов</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="d-history" style="display:none">' +
            '<div class="cc-section-h">История изменений</div>' +
            (d.historyHtml || '<p class="cc-desc">Нет изменений</p>') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cc-col">' +
        '<div class="cc-card"><div class="cc-card-title">Сделка</div>' +
          '<div class="cc-field"><div class="cc-field-label">Сумма</div><div class="cc-field-value">' + Utils.money(d.amount) + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Вероятность</div><div class="cc-field-value">' + d.prob + '%</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Стадия</div><div class="cc-field-value" style="color:' + (stage ? stage.color : 'var(--text)') + '">' + (stage ? stage.name : '—') + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Ответственный</div><div class="cc-field-value">' + d.owner + '</div></div>' +
        '</div>' +
        '<div class="cc-card"><div class="cc-card-title">Контакт</div>' +
          '<div class="cc-field"><div class="cc-field-label">Имя</div><div class="cc-field-value">' + d.contact + '</div></div>' +
          '<div class="cc-field"><div class="cc-field-label">Телефон</div><div class="cc-field-value link">' + d.phone + '</div></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  el.querySelector('#dealTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.cc-tab');
    if (!tab) return;
    el.querySelectorAll('#dealTabs .cc-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    var pane = tab.dataset.tab;
    el.querySelectorAll('.cc-tab-pane').forEach(function(p) {
      p.style.display = p.dataset.pane === pane ? '' : 'none';
    });
  });

  var scrollEl = document.querySelector('.content');
  if (scrollEl) scrollEl.scrollTop = 0;
}

function closeDealCard() {
  navigateTo('deals');
}

function openContactCard(idx, from) {
  window._cardBack = from || 'contacts';
  var c = APP_DATA.contacts[idx];
  if (!c) return;
  var initials = c.n.replace(/[,."]/g, '').split(' ').map(function(w) { return w[0]; }).filter(Boolean).slice(0, 2).join('').toUpperCase();

  navigateTo('contact-card');

  var el = document.getElementById('contactCardContent');
  el.innerHTML =
    '<div class="cc-back" onclick="closeContactCard()"><i class="fa-solid fa-arrow-left"></i> К воронке продаж</div>' +
    '<div class="cc-hero"><div class="cc-hero-top">' +
      '<div class="cc-logo" style="background:' + c.c + '">' + initials + '</div>' +
      '<div class="cc-hero-main">' +
        '<div class="cc-hero-name"><h1>' + c.n + '</h1></div>' +
        '<div class="cc-hero-meta">' +
          '<span><i class="fa-solid fa-building"></i> ' + (c.company || '—') + '</span>' +
          '<span><i class="fa-solid fa-briefcase"></i> ' + (c.role || '—') + '</span>' +
          '<span><i class="fa-solid fa-location-dot"></i> ' + (c.city || '—') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cc-hero-actions">' +
        '<button class="btn btn-ghost" onclick="showToast(\'Открыт чат\', \'fa-envelope\')"><i class="fa-solid fa-envelope"></i> Написать</button>' +
        '<button class="btn btn-primary" onclick="showToast(\'Звонок ' + c.phone + '\', \'fa-phone\')"><i class="fa-solid fa-phone"></i> Позвонить</button>' +
      '</div>' +
    '</div></div>' +
    '<div class="cc-grid">' +
      '<div class="cc-col" style="grid-column:1/3">' +
        '<div class="cc-card">' +
          '<div class="cc-tabs" id="contactTabs">' +
            '<div class="cc-tab active" data-tab="cn-overview">Обзор</div>' +
            '<div class="cc-tab" data-tab="cn-comms">Коммуникации</div>' +
            '<div class="cc-tab" data-tab="cn-deals">Сделки</div>' +
            '<div class="cc-tab" data-tab="cn-tasks">Задачи</div>' +
            '<div class="cc-tab" data-tab="cn-docs">Документы</div>' +
            '<div class="cc-tab" data-tab="cn-history">История</div>' +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-overview">' +
            '<div class="pm-info-grid">' +
              '<div class="pm-info-card"><div class="pm-info-label">Телефон</div><div class="pm-info-value">' + c.phone + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Email</div><div class="pm-info-value">' + (c.email || '—') + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Компания</div><div class="pm-info-value">' + (c.company || '—') + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Должность</div><div class="pm-info-value">' + (c.role || '—') + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Ответственный</div><div class="pm-info-value">' + c.resp + '</div></div>' +
              '<div class="pm-info-card"><div class="pm-info-label">Дата создания</div><div class="pm-info-value">' + c.date + '</div></div>' +
            '</div>' +
            (c.nextSteps && c.nextSteps.length ? '<div style="margin-top:20px"><div class="cc-section-h">Следующие шаги</div>' +
              c.nextSteps.map(function(s) {
                return '<div class="cc-next-step"><i class="fa-solid ' + s.icon + ' cc-ns-ic"></i><div class="cc-ns-body"><div class="cc-ns-t">' + s.text + '</div><div style="font-size:11px;color:var(--text-faint);margin-top:4px">' + (s.when || '') + '</div></div></div>';
              }).join('') + '</div>' : '') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-comms" style="display:none">' +
            '<div class="cc-section-h">История коммуникаций</div>' +
            ((c.comms || []).map(function(a) {
              return '<div class="cc-activity"><div class="cc-act-ic cc-act-' + a.cls.replace('act-', '') + '"><i class="fa-solid ' + a.icon + '"></i></div><div class="cc-act-txt">' + a.text + '<div class="cc-act-time">' + a.time + '</div></div></div>';
            }).join('') || '<p class="cc-desc">Нет коммуникаций</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-deals" style="display:none">' +
            '<div class="cc-section-h">Сделки</div>' +
            ((c.deals || []).map(function(d) {
              return '<div class="cc-deal"><div><div class="cc-deal-name">' + d.name + '</div><div class="cc-deal-sub">' + d.date + '</div><span class="cc-deal-stage b-blue">' + d.stage + '</span></div><div class="cc-deal-sum">' + d.amount + '</div></div>';
            }).join('') || '<p class="cc-desc">Нет сделок</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-tasks" style="display:none">' +
            '<div class="cc-section-h">Задачи</div>' +
            ((c.tasks || []).map(function(t) {
              return '<div class="cc-task"><div class="cc-task-check"><i class="fa-solid fa-check" style="font-size:10px;opacity:0"></i></div><div class="cc-task-txt">' + t.text + '<div class="cc-task-due' + (t.overdue ? '' : ' ok') + '">' + t.due + '</div></div></div>';
            }).join('') || '<p class="cc-desc">Нет задач</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-docs" style="display:none">' +
            '<div class="cc-section-h">Документы</div>' +
            ((c.docs || []).map(function(d) {
              return '<div class="cc-deal"><div><div class="cc-deal-name"><i class="fa-solid ' + d.icon + '" style="color:var(--text-faint)"></i> ' + d.name + '</div><div class="cc-deal-sub">' + d.meta + '</div></div></div>';
            }).join('') || '<p class="cc-desc">Нет документов</p>') +
          '</div>' +
          '<div class="cc-tab-pane" data-pane="cn-history" style="display:none">' +
            '<div class="cc-section-h">История изменений</div>' +
            ((c.history || []).map(function(a) {
              return '<div class="cc-activity"><div class="cc-act-ic cc-act-' + a.cls.replace('act-', '') + '"><i class="fa-solid ' + a.icon + '"></i></div><div class="cc-act-txt">' + a.text + '<div class="cc-act-time">' + a.time + '</div></div></div>';
            }).join('') || '<p class="cc-desc">Нет изменений</p>') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  el.querySelector('#contactTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.cc-tab');
    if (!tab) return;
    el.querySelectorAll('#contactTabs .cc-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    var pane = tab.dataset.tab;
    el.querySelectorAll('.cc-tab-pane').forEach(function(p) {
      p.style.display = p.dataset.pane === pane ? '' : 'none';
    });
  });

  el.querySelectorAll('.cc-task-check').forEach(function(check) {
    check.addEventListener('click', function() {
      check.classList.toggle('done');
      var icon = check.querySelector('i');
      icon.style.opacity = check.classList.contains('done') ? '1' : '0';
      check.closest('.cc-task').classList.toggle('done');
    });
  });

  var scrollEl = document.querySelector('.content');
  if (scrollEl) scrollEl.scrollTop = 0;
}

function closeContactCard() {
  navigateTo(window._cardBack || 'contacts');
}
