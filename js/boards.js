let bdView = 'kanban';

function switchBdView(mode) {
  if (mode === bdView) return;
  bdView = mode;
  document.querySelectorAll('.bd-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.mode === mode);
  });
  document.getElementById('bdKanban').style.display = mode === 'kanban' ? '' : 'none';
  document.getElementById('bdTable').style.display = mode === 'table' ? '' : 'none';
  document.getElementById('bdGantt').style.display = mode === 'gantt' ? '' : 'none';
  document.getElementById('bdCal').style.display = mode === 'cal' ? '' : 'none';
  if (mode === 'kanban') renderBoards();
  if (mode === 'table') renderBoardTable();
  if (mode === 'gantt') renderGantt();
  if (mode === 'cal') renderBoardCalendar();
}

function renderBoards() {
  var el = document.getElementById('bdKanban');
  if (!el) return;
  var lanes = APP_DATA.boards.lanes;
  var html = '<div class="bd-scroll"><div class="bd">' +
    '<div class="bd-cols">' +
    '<div class="bd-colh"><i class="fa-solid fa-inbox" style="color:#818cf8"></i> Очередь <span class="cnt">2</span></div>' +
    '<div class="bd-colh"><i class="fa-solid fa-code" style="color:#fbbf24"></i> В работе <span class="wip">WIP 5</span><span class="cnt">5</span></div>' +
    '<div class="bd-colh"><i class="fa-solid fa-vial" style="color:#f472b6"></i> Тестирование <span class="cnt">1</span></div>' +
    '<div class="bd-colh"><i class="fa-solid fa-circle-check" style="color:#34d399"></i> Готово <span class="cnt">1</span></div>' +
    '</div>';

  lanes.forEach(function(lane, li) {
    var cells = '';
    lane.cols.forEach(function(col) {
      var cards = '';
      col.forEach(function(c) {
        var tags = (c.tags || []).map(function(t) { return '<span class="tk-tag" style="background:' + t[1] + ';color:' + t[2] + '">' + t[0] + '</span>'; }).join('');
        var avs = '';
        if (c.avs) avs = c.avs.map(function(a) { return '<span class="tk-av" style="background:' + a[1] + ';margin-left:-6px">' + a[0] + '</span>'; }).join('');
        else if (c.av) avs = '<span class="tk-av" style="background:' + c.avc + '">' + c.av + '</span>';
        var due = c.due ? '<span class="tk-due" style="background:' + c.due[1] + '"><i class="fa-solid fa-hourglass-half"></i> ' + c.due[0] + '</span>' : '';
        var block = c.block ? '<i class="fa-solid fa-lock tk-block"></i>' : '';
        cards += '<div class="tk-card" onclick="showToast(\'' + c.t.replace(/'/g, '') + '\', \'fa-clipboard-check\')">' +
          '<div class="tk-bar" style="background:' + (c.bar || '#6366f1') + '"></div>' + block +
          '<div class="tk-title">' + c.t + '</div>' + (tags ? '<div class="tk-tags">' + tags + '</div>' : '') +
          '<div class="tk-foot">' + avs + due + '</div></div>';
      });
      cells += '<div class="bd-cell">' + cards + '</div>';
    });
    html += '<div class="lane' + (lane.open ? '' : ' collapsed') + '" id="lane' + li + '">' +
      '<div class="lane-header" onclick="document.getElementById(\'lane' + li + '\').classList.toggle(\'collapsed\')"><i class="fa-solid fa-chevron-down ch"></i> ' + lane.name + ' <span class="cnt">' + lane.cnt + '</span></div>' +
      '<div class="lane-body">' + cells + '</div></div>';
  });
  html += '</div></div>';

  html += '<div style="margin-top:18px;background:linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.08));border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:16px 20px;display:flex;gap:14px;align-items:flex-start">' +
    '<i class="fa-solid fa-brain" style="color:var(--accent-pink);font-size:18px;margin-top:2px"></i>' +
    '<div style="flex:1">' +
      '<div style="font-weight:700;color:var(--text);font-size:13px;margin-bottom:5px">AI-прогноз рисков · метод Монте-Карло</div>' +
      '<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.55">Задача <b style="color:var(--text)">«Настройка в BPMSoft»</b> с вероятностью 68% сорвёт дедлайн из-за перегрузки исполнителя. Рекомендую перенести 12 ч трудозатрат на другого сотрудника — критический путь сократится на 4 дня.</div>' +
      '<div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">' +
        '<button class="btn btn-primary btn-sm" onclick="showToast(\'Ресурсы перераспределены\', \'fa-people-arrows\')"><i class="fa-solid fa-people-arrows"></i> Перераспределить</button>' +
        '<button class="btn btn-sm" onclick="showToast(\'Критический путь\', \'fa-route\')"><i class="fa-solid fa-route"></i> Критический путь</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  el.innerHTML = html;
}

function renderBoardTable() {
  var el = document.getElementById('bdTable');
  if (!el) return;
  var allCards = [];
  APP_DATA.boards.lanes.forEach(function(lane) {
    var colNames = ['Очередь', 'В работе', 'Тестирование', 'Готово'];
    lane.cols.forEach(function(col, ci) {
      col.forEach(function(c) {
        allCards.push({ t: c.t, lane: lane.name, col: colNames[ci] || '—', av: c.av || '', prio: c.prio || 'Средний', bar: c.bar || '#6366f1' });
      });
    });
  });
  el.innerHTML = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">' +
    '<thead><tr style="border-bottom:1px solid var(--border)">' +
    '<th style="text-align:left;padding:10px 14px;color:var(--text-faint);font-size:11px;font-weight:600">Задача</th>' +
    '<th style="text-align:left;padding:10px 14px;color:var(--text-faint);font-size:11px;font-weight:600">Дорожка</th>' +
    '<th style="text-align:left;padding:10px 14px;color:var(--text-faint);font-size:11px;font-weight:600">Статус</th>' +
    '<th style="text-align:left;padding:10px 14px;color:var(--text-faint);font-size:11px;font-weight:600">Приоритет</th>' +
    '</tr></thead><tbody>' +
    allCards.map(function(c) {
      return '<tr style="border-bottom:1px solid var(--border-subtle);cursor:pointer" onclick="showToast(\'' + c.t.replace(/'/g, '') + '\', \'fa-clipboard-check\')">' +
        '<td style="padding:10px 14px;color:var(--text)"><span style="display:inline-block;width:4px;height:16px;border-radius:2px;background:' + c.bar + ';margin-right:8px;vertical-align:middle"></span>' + c.t + '</td>' +
        '<td style="padding:10px 14px;color:var(--text-secondary)">' + c.lane + '</td>' +
        '<td style="padding:10px 14px;color:var(--text-secondary)">' + c.col + '</td>' +
        '<td style="padding:10px 14px;color:var(--text-secondary)">' + c.prio + '</td>' +
      '</tr>';
    }).join('') +
    '</tbody></table></div>';
}

var ganttNow = 38.9;
var ganttData = [
  { lvl: 0, n: 'Пилот MVP · полный цикл', ds: '01.01.2026', de: '30.06.2026', s: 0, e: 60, type: 'epic', prog: 38 },
  { lvl: 1, n: 'Проектирование', ds: '01.01.2026', de: '15.02.2026', s: 0, e: 18, type: 'done', prog: 100 },
  { lvl: 1, n: 'Разработка бэкенда', ds: '10.02.2026', de: '30.04.2026', s: 14, e: 44, type: 'task', prog: 65 },
  { lvl: 1, n: 'Разработка фронтенда', ds: '01.03.2026', de: '15.05.2026', s: 25, e: 52, type: 'task', prog: 40 },
  { lvl: 1, n: 'Тестирование и QA', ds: '01.04.2026', de: '20.05.2026', s: 39, e: 55, type: 'task', prog: 15 },
  { lvl: 1, n: 'Деплой и запуск', ds: '15.05.2026', de: '30.06.2026', s: 52, e: 67, type: 'grp', prog: 0 },
  { lvl: 0, n: 'Интеграция с 1С', ds: '01.03.2026', de: '30.09.2026', s: 25, e: 83, type: 'epic', prog: 10 },
  { lvl: 1, n: 'Анализ процессов', ds: '01.03.2026', de: '01.04.2026', s: 25, e: 39, type: 'done', prog: 100 },
  { lvl: 1, n: 'Настройка BPMSoft', ds: '15.03.2026', de: '15.06.2026', s: 28, e: 61, type: 'task', prog: 30 },
];

function renderGantt() {
  var el = document.getElementById('bdGantt');
  if (!el) return;
  var months = ['Дек', 'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг'];

  var rows = ganttData.map(function(r) {
    var w = Math.max(r.e - r.s, 2);
    var lvClass = 'lv' + r.lvl;
    var barClass = r.type;
    var fill = r.prog > 0 && r.type !== 'epic' ? '<div class="gantt-fill" style="width:' + r.prog + '%"></div>' : '';
    return '<div class="gantt-row">' +
      '<div class="gantt-cell gantt-name ' + lvClass + '">' + r.n + '</div>' +
      '<div class="gantt-cell gantt-date">' + r.ds + '</div>' +
      '<div class="gantt-cell gantt-date">' + r.de + '</div>' +
      '<div class="gantt-cell gantt-time"><div class="gantt-lane">' +
      '<div style="position:absolute;top:0;bottom:0;left:' + ganttNow + '%;width:2px;background:#f87171;z-index:3"></div>' +
      fill +
      '<div class="gantt-bar ' + barClass + '" style="left:' + r.s + '%;width:' + w + '%" onclick="showToast(\'' + r.n.replace(/'/g, '') + ' · ' + r.prog + '%\', \'fa-diagram-project\')">' +
      '<span class="gantt-text">' + r.n + '</span></div>' +
      '</div></div></div>';
  }).join('');

  var toolbar = '<div class="gantt-toolbar">' +
    '<span class="gantt-tool" onclick="showToast(\'На весь экран\', \'fa-expand\')"><i class="fa-solid fa-expand"></i> На весь экран</span>' +
    '<span class="gantt-tool" onclick="showToast(\'Масштаб\', \'fa-magnifying-glass\')"><i class="fa-solid fa-magnifying-glass"></i> Масштаб</span>' +
    '<span class="gantt-tool" onclick="this.classList.toggle(\'active\')"><i class="fa-solid fa-lock-open"></i> Ручной режим</span>' +
    '<span class="gantt-tool" onclick="this.classList.toggle(\'active\')"><i class="fa-solid fa-route"></i> Критический путь</span>' +
    '<span class="gantt-tool" onclick="this.classList.toggle(\'active\')"><i class="fa-solid fa-link"></i> Связи</span>' +
    '<div style="flex:1"></div>' +
    '<span class="gantt-tool" style="color:var(--accent-purple)" onclick="showToast(\'AI-анализ рисков\', \'fa-brain\')"><i class="fa-solid fa-brain"></i> AI-риски</span>' +
    '<span class="gantt-tool" onclick="showToast(\'Настройка колонок\', \'fa-table-columns\')"><i class="fa-solid fa-table-columns"></i> Настройка</span>' +
    '<span class="gantt-tool active" onclick="showToast(\'Сегодня\', \'fa-location-crosshairs\')"><i class="fa-solid fa-location-crosshairs"></i> Сегодня</span>' +
  '</div>';

  var resources = [
    { n: 'Дмитрий Орлов', role: 'Менеджер', av: 'ДО', c: 'linear-gradient(135deg,#6366f1,#a855f7)', load: [40, 60, 80, 120, 90, 50] },
    { n: 'Анна Ковалёва', role: 'Руководитель', av: 'АК', c: 'linear-gradient(135deg,#f59e0b,#ef4444)', load: [50, 70, 75, 85, 80, 60] },
    { n: 'Елена Соколова', role: 'Менеджер', av: 'ЕС', c: 'linear-gradient(135deg,#10b981,#059669)', load: [30, 55, 65, 90, 75, 45] },
  ];
  var resRows = resources.map(function(r) {
    var cells = r.load.map(function(v) {
      var col = v > 100 ? '#f87171' : v > 75 ? '#fbbf24' : v > 0 ? '#34d399' : 'var(--surface-3)';
      return '<div class="res-cell"><div class="res-load" style="background:' + col + ';color:' + (v > 0 ? '#fff' : 'transparent') + '">' + (v > 0 ? v + '%' : '') + '</div></div>';
    }).join('');
    return '<div class="res-row"><div class="res-name"><div class="res-av" style="background:' + r.c + '">' + r.av + '</div><div><div style="color:var(--text);font-weight:600">' + r.n + '</div><div style="font-size:10.5px;color:var(--text-secondary)">' + r.role + '</div></div></div><div class="res-cells">' + cells + '</div></div>';
  }).join('');

  el.innerHTML = toolbar +
    '<div class="gantt-wrap"><div class="gantt-scroll"><div class="gantt">' +
    '<div class="gantt-row gantt-head"><div class="gantt-cell">Задача</div><div class="gantt-cell gantt-date">Начало</div><div class="gantt-cell gantt-date">Конец</div><div class="gantt-cell gantt-time" style="flex-direction:column;align-items:stretch;padding:0"><div style="padding:4px 12px 2px;font-size:11px;color:var(--text-dim);font-weight:700">2026</div><div class="gantt-months">' + months.map(function(m) { return '<div class="gantt-month' + (m === 'Март' ? ' now' : '') + '">' + m + '</div>'; }).join('') + '</div></div></div>' +
    rows +
    '</div></div></div>' +
    '<div class="res-wrap"><div class="res-header"><i class="fa-solid fa-users-gear" style="color:#818cf8"></i> Загрузка ресурсов, %<span style="flex:1"></span><span style="font-size:10.5px;font-weight:600;display:inline-flex;gap:12px;color:var(--text-faint)"><span><i class="fa-solid fa-square" style="color:var(--green)"></i> норма</span><span><i class="fa-solid fa-square" style="color:var(--amber)"></i> высокая</span><span><i class="fa-solid fa-square" style="color:var(--red)"></i> перегрузка</span></span></div><div class="res-scroll"><div>' + resRows + '</div></div></div>';
}

function renderBoardCalendar() {
  var el = document.getElementById('bdCal');
  if (!el) return;
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = now.getDate();
  var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  var dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  var calEvents = {};
  APP_DATA.boards.lanes.forEach(function(lane) {
    lane.cols.forEach(function(col) {
      col.forEach(function(c) {
        if (c.due) {
          var day = Math.floor(Math.random() * daysInMonth) + 1;
          if (!calEvents[day]) calEvents[day] = [];
          calEvents[day].push({ t: c.t, bar: c.bar || '#6366f1' });
        }
      });
    });
  });

  var header = dayNames.map(function(d) { return '<div style="text-align:center;font-size:11px;font-weight:600;color:var(--text-faint);padding:8px 0">' + d + '</div>'; }).join('');
  var cells = '';
  var startOffset = (firstDay + 6) % 7;
  for (var i = 0; i < startOffset; i++) cells += '<div style="min-height:80px"></div>';
  for (var d = 1; d <= daysInMonth; d++) {
    var isToday = d === today;
    var evts = calEvents[d] || [];
    var evtsHtml = evts.slice(0, 2).map(function(e) {
      return '<div style="font-size:9.5px;padding:2px 5px;border-radius:4px;background:' + e.bar + '22;color:' + e.bar + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px">' + e.t + '</div>';
    }).join('');
    cells += '<div style="min-height:80px;border:1px solid var(--border-subtle);border-radius:8px;padding:6px;background:' + (isToday ? 'rgba(99,102,241,0.06)' : 'transparent') + '">' +
      '<div style="font-size:12px;font-weight:' + (isToday ? '700' : '500') + ';color:' + (isToday ? 'var(--accent)' : 'var(--text)') + '">' + d + '</div>' +
      evtsHtml + '</div>';
  }

  el.innerHTML = '<div class="gantt-wrap" style="padding:16px">' +
    '<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:14px">' + monthNames[month] + ' ' + year + '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">' + header + cells + '</div>' +
  '</div>';
}
