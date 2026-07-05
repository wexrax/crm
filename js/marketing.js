let mktTabId = 'dash';

function renderMarketing() {
  renderMktTabs();
  renderMktContent();
}

function renderMktTabs() {
  const el = document.getElementById('mktTabs');
  if (!el) return;
  const tabs = [
    { id: 'dash', icon: 'fa-gauge-high', label: 'Дашборд' },
    { id: 'camp', icon: 'fa-rocket', label: 'Кампании' },
    { id: 'aud', icon: 'fa-user-group', label: 'Аудитория' },
    { id: 'chan', icon: 'fa-share-nodes', label: 'Каналы' },
    { id: 'scen', icon: 'fa-sitemap', label: 'Конструктор' },
  ];
  el.innerHTML = tabs.map(t =>
    '<div class="mkt-tab' + (t.id === mktTabId ? ' active' : '') + '" onclick="setMktTab(\'' + t.id + '\')"><i class="fa-solid ' + t.icon + '"></i> ' + t.label + '</div>'
  ).join('');
}

function setMktTab(id) {
  if (id === mktTabId) return;
  mktTabId = id;
  renderMarketing();
}

function renderMktContent() {
  const el = document.getElementById('mktContent');
  if (!el) return;
  const m = APP_DATA.marketing;

  if (mktTabId === 'dash') {
    el.innerHTML = '<div class="tab-content">' + renderMktDashboard(m) + '</div>';
  } else if (mktTabId === 'camp') {
    el.innerHTML = '<div class="tab-content">' + renderMktCampaigns(m) + '</div>';
  } else if (mktTabId === 'aud') {
    el.innerHTML = '<div class="tab-content">' + renderMktAudience(m) + '</div>';
  } else if (mktTabId === 'chan') {
    el.innerHTML = '<div class="tab-content">' + renderMktChannels(m) + '</div>';
  } else if (mktTabId === 'scen') {
    el.innerHTML = '<div class="tab-content">' + renderMktScenario(m) + '</div>';
  }
}

function renderMktDashboard(m) {
  var kpis = [
    { l: 'ROI', v: '412%', t: '+38%', up: true, ic: 'fa-coins', c: '#34d399', spark: [30,45,40,65,80,100] },
    { l: 'Лиды', v: '1 847', t: '+22%', up: true, ic: 'fa-user-plus', c: '#818cf8', spark: [40,55,50,70,85,95] },
    { l: 'Конверсия', v: '4.8%', t: '+0.9пп', up: true, ic: 'fa-percent', c: '#f472b6', spark: [35,50,60,55,75,90] },
    { l: 'CAC', v: '₽ 1 240', t: '−14%', up: true, ic: 'fa-hand-holding-dollar', c: '#fbbf24', spark: [100,85,80,65,55,45] },
    { l: 'LTV', v: '₽ 68К', t: '+11%', up: true, ic: 'fa-gem', c: '#c084fc', spark: [45,55,60,72,88,100] },
    { l: 'Open Rate', v: '34.2%', t: '−1.2пп', up: false, ic: 'fa-envelope-open', c: '#34d399', spark: [80,90,75,85,70,65] },
  ];

  var kpiHtml = '<div class="kpi-row">' + kpis.map(function(k) {
    var sparkHtml = k.spark.map(function(v, i) {
      var bg = i < 4 ? 'var(--accent)' : 'var(--accent-purple)';
      if (i === 5) bg = 'var(--accent-pink)';
      return '<i style="height:' + v + '%;background:' + bg + '"></i>';
    }).join('');
    return '<div class="kpi-card">' +
      '<div class="kpi-label"><i class="fa-solid ' + k.ic + '" style="color:' + k.c + '"></i> ' + k.l + '</div>' +
      '<div class="kpi-value">' + k.v + '</div>' +
      '<div class="kpi-trend" style="color:' + (k.up ? 'var(--green)' : 'var(--red)') + '"><i class="fa-solid fa-arrow-' + (k.up ? 'up' : 'down') + '"></i> ' + k.t + '</div>' +
      '<div class="kpi-spark">' + sparkHtml + '</div>' +
    '</div>';
  }).join('') + '</div>';

  var aiHtml = '<div class="mkt-ai-insight">' +
    '<div class="mkt-ai-icon"><i class="fa-solid fa-brain"></i></div>' +
    '<div style="flex:1">' +
      '<div style="font-weight:700;color:var(--text);font-size:13px;margin-bottom:5px">Рекомендация AI · Next Best Campaign</div>' +
      '<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.55">Сегмент <b style="color:var(--text)">«Спящие VIP»</b> (312 контактов) не покупал 45 дней, но имеет высокий LTV. Прогноз реактивации <b style="color:var(--green)">27%</b>. Рекомендую WhatsApp-цепочку с персональной скидкой 15% — ожидаемая выручка <b style="color:var(--accent-pink)">₽ 2,1М</b>.</div>' +
      '<div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">' +
        '<button class="btn btn-primary btn-sm" onclick="showToast(\'AI сгенерировал сценарий\', \'fa-bolt\')"><i class="fa-solid fa-bolt"></i> Запустить</button>' +
        '<button class="btn btn-sm" onclick="showToast(\'Детали сегмента\', \'fa-magnifying-glass-chart\')"><i class="fa-solid fa-magnifying-glass-chart"></i> Детали</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  var ld = m.leadDynamics;
  var maxVal = Math.max.apply(null, ld.series.reduce(function(a, s) { return a.concat(s.data); }, []));
  var chartH = 180;
  var svgW = 620;

  var seriesA = ld.series[0];
  var seriesB = ld.series[1];
  var makeAreaPath = function(s) {
    var linePts = s.data.map(function(v, i) {
      return (i / (s.data.length - 1)) * svgW + ',' + (chartH - (v / maxVal) * chartH);
    }).join(' ');
    var areaPts = linePts + ' ' + svgW + ',' + chartH + ' 0,' + chartH;
    return { line: linePts, area: areaPts };
  };
  var a = makeAreaPath(seriesA);
  var b = makeAreaPath(seriesB);

  var lastA = seriesA.data[seriesA.data.length - 1];
  var lastB = seriesB.data[seriesB.data.length - 1];

  var lineChartHtml = '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-chart-line" style="color:var(--accent-purple)"></i> Динамика лидов и выручки</div>' +
    '<div class="mkt-chart-legend-row"><span class="mkt-chart-legend"><span class="mkt-chart-dot" style="background:var(--accent-light)"></span>Лиды</span><span class="mkt-chart-legend"><span class="mkt-chart-dot" style="background:var(--accent-pink)"></span>Выручка, ₽ млн</span></div>' +
    '<svg viewBox="0 0 ' + svgW + ' ' + (chartH + 24) + '" class="mkt-line-chart" preserveAspectRatio="none">' +
    '<defs>' +
      '<linearGradient id="mktGradA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#818cf8" stop-opacity=".35"/><stop offset="1" stop-color="#818cf8" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="mktGradB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec4899" stop-opacity=".3"/><stop offset="1" stop-color="#ec4899" stop-opacity="0"/></linearGradient>' +
    '</defs>' +
    '<line x1="0" y1="50" x2="' + svgW + '" y2="50" stroke="var(--border)" stroke-width="1"/>' +
    '<line x1="0" y1="100" x2="' + svgW + '" y2="100" stroke="var(--border)" stroke-width="1"/>' +
    '<line x1="0" y1="150" x2="' + svgW + '" y2="150" stroke="var(--border)" stroke-width="1"/>' +
    '<polygon points="' + a.area + '" fill="url(#mktGradA)"/>' +
    '<polyline points="' + a.line + '" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<polygon points="' + b.area + '" fill="url(#mktGradB)"/>' +
    '<polyline points="' + b.line + '" fill="none" stroke="#ec4899" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="' + svgW + '" cy="' + (chartH - (lastA / maxVal) * chartH) + '" r="4" fill="#818cf8"/>' +
    '<circle cx="' + svgW + '" cy="' + (chartH - (lastB / maxVal) * chartH) + '" r="4" fill="#ec4899"/>' +
    '</svg>' +
    '<div style="display:flex;justify-content:space-between;padding:0 4px;margin-top:6px">' +
    ld.months.map(function(m) { return '<span style="font-size:10.5px;color:var(--text-faint)">' + m + '</span>'; }).join('') +
    '</div></div>';

  var distTotal = m.leadDistribution.reduce(function(a, d) { return a + d.v; }, 0);
  var cumPct = 0;
  var donutSegments = m.leadDistribution.map(function(d) {
    var pct = d.v / distTotal;
    var dash = pct * 100;
    var offset = 25 - cumPct * 100;
    cumPct += pct;
    return '<circle cx="21" cy="21" r="15.9" fill="none" stroke="' + d.c + '" stroke-width="5" stroke-dasharray="' + dash + ' ' + (100 - dash) + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 21 21)"/>';
  }).join('');

  var donutHtml = '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-chart-pie" style="color:var(--accent-pink)"></i> Лиды по источникам</div>' +
    '<div class="mkt-donut-wrap"><svg viewBox="0 0 42 42" class="mkt-donut">' +
    '<circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--surface-3)" stroke-width="5"/>' +
    donutSegments +
    '<text x="21" y="21" text-anchor="middle" fill="var(--text)" font-size="7" font-weight="800" dominant-baseline="central">1.8K</text>' +
    '<text x="21" y="26" text-anchor="middle" fill="var(--text-faint)" font-size="3.2">лидов</text>' +
    '</svg><div class="mkt-donut-legend">' +
    m.leadDistribution.map(function(d) {
      return '<span class="mkt-donut-item"><span class="mkt-chart-dot" style="background:' + d.c + '"></span>' + d.n + ' <b>' + d.v + '%</b></span>';
    }).join('') + '</div></div></div>';

  var funnelData = [
    { n: 'Показы', v: 100, c: '#6366f1', cnt: '248 000', conv: '' },
    { n: 'Клики', v: 72, c: '#7c3aed', cnt: '34 700', conv: '14%' },
    { n: 'Лиды', v: 52, c: '#a855f7', cnt: '1 847', conv: '5.3%' },
    { n: 'Сделки', v: 34, c: '#db2777', cnt: '268', conv: '14.5%' },
    { n: 'Продажи', v: 20, c: '#f59e0b', cnt: '89', conv: '33%' },
  ];
  var funnelHtml = '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-filter" style="color:var(--accent-light)"></i> Воронка конверсии</div>' +
    '<div class="mkt-funnel">' + funnelData.map(function(f) {
      return '<div class="mkt-fun-row">' +
        '<span class="mkt-fun-lbl">' + f.n + '</span>' +
        '<div class="mkt-fun-bar-wrap"><div class="mkt-fun-bar" style="width:' + f.v + '%;background:linear-gradient(90deg,' + f.c + ',' + f.c + 'cc)">' + f.cnt + '</div></div>' +
        '<span class="mkt-fun-conv">' + f.conv + '</span>' +
      '</div>';
    }).join('') + '</div></div>';

  var calendarData = [
    { day: 'Пн', title: 'Email «Новинки недели»', desc: 'Сегмент: Активные · 12 400 адресов · A/B тема', ic: 'fa-envelope', c: 'var(--accent-pink)', bg: 'rgba(236,72,153,0.12)' },
    { day: 'Ср', title: 'Пост в Telegram-канал', desc: 'Кейс клиента · запланировано на 12:00', ic: 'fa-brands fa-telegram', c: '#2aabee', bg: 'rgba(42,171,238,0.12)' },
    { day: 'Пт', title: 'WhatsApp промо-акция', desc: 'Сегмент: Спящие VIP · шаблон с кнопками', ic: 'fa-brands fa-whatsapp', c: '#25d366', bg: 'rgba(37,211,102,0.12)' },
  ];
  var calendarHtml = '<div class="mkt-panel"><div class="mkt-panel-title"><i class="fa-solid fa-calendar-days" style="color:var(--green)"></i> Календарь контента · неделя</div>' +
    '<div class="mkt-cal-list">' + calendarData.map(function(e) {
      var isBrand = e.ic.indexOf('brands') > -1;
      var iconClass = isBrand ? 'fa-brands ' + e.ic.replace('fa-brands ', '') : 'fa-solid ' + e.ic;
      return '<div class="mkt-cal-item" onclick="showToast(\'Открываю: ' + e.title + '\', \'' + e.ic + '\')">' +
        '<div class="mkt-cal-ic" style="background:' + e.bg + ';color:' + e.c + '"><i class="' + iconClass + '"></i></div>' +
        '<div class="mkt-cal-info"><div class="mkt-cal-title">' + e.day + ' · ' + e.title + '</div><div class="mkt-cal-desc">' + e.desc + '</div></div>' +
      '</div>';
    }).join('') + '</div></div>';

  return kpiHtml + aiHtml +
    '<div class="mkt-dashboard-grid">' + lineChartHtml + donutHtml + '</div>' +
    '<div class="mkt-dashboard-grid">' + funnelHtml + calendarHtml + '</div>';
}

function renderMktCampaigns(m) {
  return '<div class="camp-list">' + m.campaigns.map(c => {
    const isTg = c.ic === 'fa-telegram';
    const iconHtml = isTg ? '<i class="fa-brands fa-telegram"></i>' : '<i class="fa-solid ' + c.ic + '"></i>';
    return '<div class="camp-row" onclick="showToast(\'Открываю: ' + c.n.replace(/'/g, '') + '\', \'' + c.ic + '\')">' +
      '<div class="camp-icon" style="background:' + c.c + '">' + iconHtml + '</div>' +
      '<div class="camp-info"><div class="camp-title">' + c.n + '</div><div class="camp-meta"><span><i class="fa-solid fa-share-nodes" style="color:#818cf8"></i> ' + c.ch + '</span><span><i class="fa-solid fa-wallet" style="color:var(--amber)"></i> ' + c.budget + '</span></div></div>' +
      '<div class="camp-metrics"><div class="camp-metric"><div class="mv" style="color:#34d399">' + c.roi + '</div><div class="ml">ROI</div></div><div class="camp-metric"><div class="mv">' + c.leads + '</div><div class="ml">Лиды</div></div><div class="camp-metric"><div class="mv">' + c.conv + '</div><div class="ml">Конв.</div></div></div>' +
      '<span class="camp-status" style="' + c.stc + '">' + c.st + '</span></div>';
  }).join('') + '</div>';
}

function renderMktAudience(m) {
  return '<div class="seg-grid">' + m.segments.map(s => {
    const tags = s.tags.map(t => '<span class="seg-tag" style="background:' + t[1] + ';color:' + t[2] + '">' + t[0] + '</span>').join('');
    return '<div class="seg-card" onclick="showToast(\'Сегмент: ' + s.n + '\', \'' + s.ic + '\')">' +
      '<div class="seg-top"><div class="seg-icon" style="background:' + s.c + '"><i class="fa-solid ' + s.ic + '"></i></div><div><div class="seg-name">' + s.n + '</div><div class="seg-cnt">' + s.cnt + '</div></div></div>' +
      '<div class="seg-tags">' + tags + '</div></div>';
  }).join('') + '</div>';
}

function renderMktChannels(m) {
  return '<div class="mkt-panel" style="margin-bottom:18px"><div class="mkt-panel-title"><i class="fa-solid fa-signal" style="color:var(--accent-purple)"></i> Эффективность каналов · конверсия и ROI</div>' +
    '<div class="hbar-list">' + m.channels.map(ch => {
      return '<div class="hbar-row"><div class="hbar-icon" style="background:' + ch.c + '">' + (ch.ic.includes('brands') ? '<i class="fa-brands ' + ch.ic.replace('fa-brands ', '') + '"></i>' : '<i class="fa-solid ' + ch.ic + '"></i>') + '</div><div class="hbar-info"><div class="hbar-top"><span class="n">' + ch.n + '</span><span class="v">ROI ' + ch.roi + ' · ' + ch.leads + ' лидов</span></div><div class="hbar-track"><div class="hbar-fill" style="width:' + ch.pct + '%;background:' + ch.c + '"></div></div></div></div>';
    }).join('') + '</div></div>';
}

function renderMktScenario(m) {
  var palette = [
    { ic: 'fa-flag', bg: '#34d399', label: 'Старт (триггер)' },
    { ic: 'fa-envelope', bg: '#ec4899', label: 'Email' },
    { ic: 'fa-comment-sms', bg: '#f59e0b', label: 'SMS' },
    { ic: 'fa-whatsapp', bg: '#25d366', label: 'Мессенджер', brand: true },
    { ic: 'fa-code-branch', bg: '#6366f1', label: 'Условие' },
    { ic: 'fa-clock', bg: '#a855f7', label: 'Задержка' },
    { ic: 'fa-briefcase', bg: '#818cf8', label: 'Действие CRM' },
    { ic: 'fa-plug', bg: '#f472b6', label: 'Интеграция API' },
  ];

  var paletteHtml = palette.map(function(p) {
    var iconClass = p.brand ? 'fa-brands ' + p.ic : 'fa-solid ' + p.ic;
    return '<div class="mkt-pal-item" onclick="showToast(\'Добавлен: ' + p.label + '\', \'' + p.ic + '\')">' +
      '<div class="mkt-pal-ic" style="background:' + p.bg + '"><i class="' + iconClass + '"></i></div>' + p.label + '</div>';
  }).join('');

  return '<div class="mkt-scen-toolbar">' +
    '<span class="mkt-scen-badge"><i class="fa-solid fa-sitemap"></i> Low-code · Welcome-цепочка</span>' +
    '<div style="flex:1"></div>' +
    '<button class="btn btn-sm" onclick="showToast(\'Сценарий сохранён\', \'fa-floppy-disk\')"><i class="fa-solid fa-floppy-disk"></i> Сохранить</button>' +
    '<button class="btn btn-primary btn-sm" onclick="showToast(\'Сценарий запущен!\', \'fa-play\')"><i class="fa-solid fa-play"></i> Запустить</button>' +
  '</div>' +
  '<div class="mkt-scen-wrap">' +
    '<div class="mkt-palette"><div class="mkt-pal-title">Палитра элементов</div>' + paletteHtml + '</div>' +
    '<div class="mkt-canvas">' +
      '<div class="mkt-node" onclick="showToast(\'Триггер: регистрация\', \'fa-flag\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#34d399"><i class="fa-solid fa-flag"></i></div><div class="mkt-node-title">Старт</div></div><div class="mkt-node-sub">Триггер: регистрация нового пользователя</div></div>' +
      '<div class="mkt-connector"></div>' +
      '<div class="mkt-node" onclick="showToast(\'Приветственный Email\', \'fa-envelope\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#ec4899"><i class="fa-solid fa-envelope"></i></div><div class="mkt-node-title">Email · Приветствие</div></div><div class="mkt-node-sub">Шаблон «Welcome» + промокод −10% · открыто 42%</div></div>' +
      '<div class="mkt-connector"></div>' +
      '<div class="mkt-node" onclick="showToast(\'Пауза 2 дня\', \'fa-clock\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#a855f7"><i class="fa-solid fa-clock"></i></div><div class="mkt-node-title">Задержка</div></div><div class="mkt-node-sub">Пауза 2 дня</div></div>' +
      '<div class="mkt-connector"></div>' +
      '<div class="mkt-node mkt-node-condition" onclick="showToast(\'Ветвление\', \'fa-code-branch\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#6366f1"><i class="fa-solid fa-code-branch"></i></div><div class="mkt-node-title">Условие · Покупка?</div></div><div class="mkt-node-sub">Проверка: совершена ли покупка</div></div>' +
      '<div class="mkt-connector"></div>' +
      '<div class="mkt-branch">' +
        '<div class="mkt-branch-col"><span class="mkt-branch-lbl" style="background:rgba(52,211,153,.15);color:var(--green)">ДА</span>' +
          '<div class="mkt-node mkt-node-sm" onclick="showToast(\'Благодарность\', \'fa-heart\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#ec4899"><i class="fa-solid fa-heart"></i></div><div class="mkt-node-title">Email · Спасибо</div></div><div class="mkt-node-sub">Благодарность + подписка</div></div>' +
        '</div>' +
        '<div class="mkt-branch-col"><span class="mkt-branch-lbl" style="background:rgba(245,158,11,.15);color:var(--amber)">НЕТ</span>' +
          '<div class="mkt-node mkt-node-sm" onclick="showToast(\'SMS-напоминание\', \'fa-comment-sms\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#f59e0b"><i class="fa-solid fa-comment-sms"></i></div><div class="mkt-node-title">SMS · Напоминание</div></div><div class="mkt-node-sub">Промокод скоро сгорит</div></div>' +
          '<div class="mkt-connector"></div>' +
          '<div class="mkt-node mkt-node-sm" onclick="showToast(\'WhatsApp оффер\', \'fa-whatsapp\')"><div class="mkt-node-head"><div class="mkt-node-ic" style="background:#25d366"><i class="fa-brands fa-whatsapp"></i></div><div class="mkt-node-title">WhatsApp · Оффер</div></div><div class="mkt-node-sub">Персональное предложение через 3 дня</div></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}
