let hrTabId = 'dash';

function renderHR() {
  renderHrTabs();
  renderHrContent();
}

function renderHrTabs() {
  const el = document.getElementById('hrTabs');
  if (!el) return;
  const tabs = [
    { id: 'dash', icon: 'fa-gauge-high', label: 'Дашборд' },
    { id: 'hire', icon: 'fa-filter', label: 'Воронка найма' },
    { id: 'vac', icon: 'fa-briefcase', label: 'Вакансии' },
    { id: 'onb', icon: 'fa-person-walking-arrow-right', label: 'Адаптация' },
    { id: 'grow', icon: 'fa-chart-line', label: 'Развитие · ИПР' },
  ];
  el.innerHTML = tabs.map(t =>
    '<div class="mkt-tab' + (t.id === hrTabId ? ' active' : '') + '" onclick="setHrTab(\'' + t.id + '\')"><i class="fa-solid ' + t.icon + '"></i> ' + t.label + '</div>'
  ).join('');
}

function setHrTab(id) {
  if (id === hrTabId) return;
  hrTabId = id;
  renderHR();
}

function renderHrContent() {
  const el = document.getElementById('hrContent');
  if (!el) return;
  const hr = APP_DATA.hr;

  if (hrTabId === 'dash') el.innerHTML = '<div class="tab-content">' + renderHrDashboard(hr) + '</div>';
  else if (hrTabId === 'hire') el.innerHTML = '<div class="tab-content">' + renderHrHire(hr) + '</div>';
  else if (hrTabId === 'vac') el.innerHTML = '<div class="tab-content">' + renderHrVacancies(hr) + '</div>';
  else if (hrTabId === 'onb') el.innerHTML = '<div class="tab-content">' + renderHrOnboarding(hr) + '</div>';
  else if (hrTabId === 'grow') el.innerHTML = '<div class="tab-content">' + renderHrGrowth(hr) + '</div>';
}

function renderHrDashboard(hr) {
  const kpis = [
    { l: 'Открытых вакансий', v: '14', t: '3 срочные', up: false, ic: 'fa-briefcase', c: '#818cf8' },
    { l: 'Кандидатов в работе', v: '187', t: '+32', up: true, ic: 'fa-users', c: '#a855f7' },
    { l: 'Time-to-fill', v: '18 дн', t: '−34%', up: true, ic: 'fa-stopwatch', c: '#34d399' },
    { l: 'Cost-per-hire', v: '₽ 42К', t: '−12%', up: true, ic: 'fa-hand-holding-dollar', c: '#fbbf24' },
    { l: 'Текучесть, год', v: '9.4%', t: '−2.1пп', up: true, ic: 'fa-user-slash', c: '#f87171' },
  ];
  return '<div class="kpi-row">' + kpis.map(k =>
    '<div class="kpi-card"><div class="kpi-label"><i class="fa-solid ' + k.ic + '" style="color:' + k.c + '"></i> ' + k.l + '</div><div class="kpi-value">' + k.v + '</div><div class="kpi-trend" style="color:' + (k.up ? 'var(--green)' : 'var(--amber)') + '"><i class="fa-solid ' + (k.up ? 'fa-arrow-up' : 'fa-clock') + '"></i> ' + k.t + '</div></div>'
  ).join('') + '</div>' +
  '<div class="hr-dashboard-grid">' +
  '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-filter" style="color:#a855f7"></i> Воронка найма · конверсия этапов</div>' +
  '<div class="funnel-list">' +
  [
    { n: 'Отклики', v: 100, c: '#6366f1', cnt: '1 240', conv: '' },
    { n: 'Скрининг', v: 64, c: '#7c3aed', cnt: '512', conv: '41%' },
    { n: 'Интервью HR', v: 44, c: '#a855f7', cnt: '214', conv: '42%' },
    { n: 'Интервью рук.', v: 30, c: '#db2777', cnt: '96', conv: '45%' },
    { n: 'Оффер', v: 18, c: '#f59e0b', cnt: '38', conv: '40%' },
    { n: 'Вышли на работу', v: 12, c: '#10b981', cnt: '29', conv: '76%' },
  ].map(f => '<div class="funnel-row"><span class="funnel-label">' + f.n + '</span><div class="funnel-bar-wrap"><div class="funnel-bar" style="width:' + f.v + '%;background:linear-gradient(90deg,' + f.c + ',' + f.c + 'cc)">' + f.cnt + '</div></div><span class="funnel-conv">' + f.conv + '</span></div>').join('') +
  '</div></div>' +
  '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-chart-pie" style="color:#f472b6"></i> Источники кандидатов</div>' +
  '<div class="hr-source-chart">' +
  '<div class="source-donut"><svg viewBox="0 0 42 42">' +
  '<circle cx="21" cy="21" r="15.9" fill="none" class="donut-bg" stroke-width="6"/>' +
  '<circle cx="21" cy="21" r="15.9" fill="none" stroke="#6366f1" stroke-width="6" stroke-dasharray="44 56" stroke-dashoffset="25" transform="rotate(-90 21 21)"/>' +
  '<circle cx="21" cy="21" r="15.9" fill="none" stroke="#ec4899" stroke-width="6" stroke-dasharray="24 76" stroke-dashoffset="-19" transform="rotate(-90 21 21)"/>' +
  '<circle cx="21" cy="21" r="15.9" fill="none" stroke="#f59e0b" stroke-width="6" stroke-dasharray="18 82" stroke-dashoffset="-43" transform="rotate(-90 21 21)"/>' +
  '<circle cx="21" cy="21" r="15.9" fill="none" stroke="#34d399" stroke-width="6" stroke-dasharray="14 86" stroke-dashoffset="-61" transform="rotate(-90 21 21)"/>' +
  '</svg><div class="source-donut-center"><strong>1,2К</strong><span>откликов</span></div></div>' +
  '<div class="source-legend">' +
  '<div class="source-legend-row"><span class="source-legend-color" style="background:#6366f1"></span> hh.ru <b>44%</b></div>' +
  '<div class="source-legend-row"><span class="source-legend-color" style="background:#ec4899"></span> Referral <b>24%</b></div>' +
  '<div class="source-legend-row"><span class="source-legend-color" style="background:#f59e0b"></span> Карьерный сайт <b>18%</b></div>' +
  '<div class="source-legend-row"><span class="source-legend-color" style="background:#34d399"></span> LinkedIn <b>14%</b></div>' +
  '</div></div></div></div>' +
  '<div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px"><i class="fa-solid fa-bolt" style="color:var(--amber)"></i> Срочные действия на сегодня</div>' +
  '<div class="grid-3">' +
  '<div class="card feed-card" onclick="showToast(\'Собеседования\', \'fa-calendar\')"><div class="feed-card-icon" style="background:rgba(99,102,241,.18);color:#818cf8"><i class="fa-solid fa-calendar-day"></i></div><div class="feed-card-body"><div class="feed-card-title">5 собеседований</div><div class="feed-card-desc">Ближайшее — 11:00</div></div></div>' +
  '<div class="card feed-card" onclick="showToast(\'Офферы\', \'fa-file-signature\')"><div class="feed-card-icon" style="background:rgba(236,72,153,.18);color:#f472b6"><i class="fa-solid fa-file-signature"></i></div><div class="feed-card-body"><div class="feed-card-title">3 оффера ждут ответа</div><div class="feed-card-desc">Дедлайн — сегодня 18:00</div></div></div>' +
  '<div class="card feed-card" onclick="setHrTab(\'onb\')"><div class="feed-card-icon" style="background:rgba(52,211,153,.18);color:#34d399"><i class="fa-solid fa-person-walking-arrow-right"></i></div><div class="feed-card-body"><div class="feed-card-title">2 адаптации на контроле</div><div class="feed-card-desc">Чек-лист выполнен на 60%</div></div></div>' +
  '</div>';
}

function renderHrHire(hr) {
  const cols = hr.hireCols;
  return '<div class="hire-scroll"><div class="hire-cols">' + cols.map(col => {
    const cards = col.idx.map(i => {
      const c = hr.candidates[i];
      const tags = c.tags.map(t => '<span class="cand-tag" style="background:' + t[1] + ';color:' + t[2] + '">' + t[0] + '</span>').join('');
      return '<div class="cand-card" onclick="showToast(\'Открываю: ' + c.n + '\', \'fa-id-card\')">' +
        '<span class="cand-score" style="background:' + c.sc + '">' + c.score + '%</span>' +
        '<div class="cand-top"><div class="cand-av" style="background:' + c.avc + '">' + c.av + '</div><div><div class="cand-name">' + c.n + '</div><div class="cand-role">' + c.r + '</div></div></div>' +
        '<div class="cand-tags">' + tags + '</div>' +
        '<div class="cand-foot"><span><i class="fa-solid fa-globe" style="color:#818cf8"></i> ' + c.src + '</span></div></div>';
    }).join('');
    return '<div class="hire-col"><div class="hire-colh"><i class="fa-solid ' + col.ic + '" style="color:' + col.c + '"></i> ' + col.name + ' <span class="cnt">' + col.idx.length + '</span></div>' + cards + '</div>';
  }).join('') + '</div></div>';
}

function renderHrVacancies(hr) {
  return '<div class="tbl-toolbar"><button class="btn btn-primary btn-sm" onclick="showToast(\'Мастер создания вакансии\', \'fa-plus\')"><i class="fa-solid fa-plus"></i> Создать вакансию</button></div>' +
    hr.vacancies.map(v =>
      '<div class="vac-row" onclick="showToast(\'' + v.n + '\', \'' + v.ic + '\')">' +
      '<div class="vac-icon" style="background:' + v.c + '"><i class="fa-solid ' + v.ic + '"></i></div>' +
      '<div class="vac-info"><div class="vac-title">' + v.n + '</div><div class="vac-meta"><span><i class="fa-solid fa-building" style="color:#818cf8"></i> ' + v.dep + '</span><span><i class="fa-solid fa-location-dot" style="color:#f472b6"></i> ' + v.loc + '</span><span><i class="fa-solid fa-users" style="color:#a855f7"></i> ' + v.cand + ' кандидатов</span></div></div>' +
      '<div class="vac-prog"><div class="lbl"><span>Заполнено</span><span>' + v.prog + '%</span></div><div style="height:6px;background:var(--surface-3);border-radius:6px;overflow:hidden"><div style="height:100%;width:' + v.prog + '%;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:6px"></div></div></div>' +
      '<span class="vac-status" style="' + v.stc + '">' + v.st + '</span></div>'
    ).join('');
}

function renderHrOnboarding(hr) {
  return '<div class="onb-list">' + hr.onboarding.map(o => {
    const steps = o.steps.map(s => {
      const col = s.d ? '#34d399' : (s.cur ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'var(--surface-3)');
      const ic = s.d ? '<i class="fa-solid fa-check"></i>' : (s.cur ? '<i class="fa-solid fa-hourglass-half"></i>' : '');
      return '<div class="onb-step"><div class="onb-dot" style="background:' + col + '">' + ic + '</div><div class="onb-lbl">' + s.l + '</div></div>';
    }).join('');
    return '<div class="onb-row" onclick="showToast(\'План адаптации: ' + o.n + '\', \'fa-clipboard-list\')">' +
      '<div class="onb-top"><div class="onb-av" style="background:' + o.c + '">' + o.av + '</div>' +
      '<div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--text)">' + o.n + '</div><div style="font-size:11.5px;color:var(--text-secondary);margin-top:2px">' + o.role + ' · наставник: ' + o.mentor + '</div></div>' +
      '<span class="vac-status" style="' + o.stc + '">' + o.day + '</span></div>' +
      '<div class="onb-steps">' + steps + '</div></div>';
  }).join('') + '</div>';
}

function renderHrGrowth(hr) {
  return '<div class="ipr-grid">' + hr.ipr.map(p => {
    const skills = p.skills.map(s =>
      '<div class="skill-row"><span>' + s[0] + '</span><span style="color:' + s[2] + '">' + s[1] + '%</span></div><div class="skill-track"><div class="skill-fill" style="width:' + s[1] + '%;background:' + s[2] + '"></div></div>'
    ).join('');
    return '<div class="ipr-card" onclick="showToast(\'ИПР: ' + p.n + '\', \'fa-chart-line\')">' +
      '<div class="onb-top"><div class="onb-av" style="width:40px;height:40px;background:' + p.c + '">' + p.av + '</div>' +
      '<div style="flex:1"><div style="font-size:13.5px;font-weight:700;color:var(--text)">' + p.n + '</div><div style="font-size:11px;color:var(--text-secondary)">' + p.role + ' → ' + p.goal + '</div></div></div>' +
      '<div style="margin-top:11px">' + skills + '</div></div>';
  }).join('') + '</div>';
}
