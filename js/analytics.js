function renderHomeAnalytics() {
  const { stats, bars, funnel } = APP_DATA.analytics;
  const light = isLightTheme();
  const el = document.getElementById('homeAnalytics');
  if (!el) return;

  const statsHtml = stats.map(s => {
    const iconBg = light ? s.color + '18' : s.color + '22';
    return '<div class="stat-card">' +
      '<div class="stat-icon" style="background:' + iconBg + ';color:' + s.color + '">' +
        '<i class="fa-solid ' + s.icon + '"></i>' +
      '</div>' +
      '<div class="stat-value">' + s.value + '</div>' +
      '<div class="stat-label">' + s.label + '</div>' +
      '<div class="stat-trend" style="color:' + (s.trendUp ? 'var(--green)' : 'var(--amber)') + '">' +
        '<i class="fa-solid ' + (s.trendUp ? 'fa-arrow-up' : 'fa-clock') + '"></i> ' + s.trend +
      '</div>' +
    '</div>';
  }).join('');

  const barsHtml = bars.map(function(b) {
    return '<div class="bar-item" style="height:0" data-height="' + b.v + '%">' +
      '<span>' + Math.round(b.v * 0.35) + '</span>' +
      '<b>' + b.m + '</b>' +
    '</div>';
  }).join('');

  const funnelHtml = funnel.map(function(f) {
    return '<div class="funnel-stage">' +
      '<div class="funnel-info"><span>' + f.n + '</span><span>' + f.cnt + '</span></div>' +
      '<div class="funnel-bar" style="width:' + f.v + '%;background:' + f.c + '">' + f.v + '%</div>' +
    '</div>';
  }).join('');

  el.innerHTML =
    '<div class="stat-row">' + statsHtml + '</div>' +
    '<div class="dashboard">' +
      '<div class="panel">' +
        '<div class="panel-title">Выручка по месяцам</div>' +
        '<div class="panel-sub">Прогноз с доверительным интервалом · 2026</div>' +
        '<div class="bar-chart">' + barsHtml + '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="panel-title">Воронка продаж</div>' +
        '<div class="panel-sub">Текущий квартал</div>' +
        '<div>' + funnelHtml + '</div>' +
      '</div>' +
    '</div>';

  requestAnimationFrame(function() {
    el.querySelectorAll('.bar-item').forEach(function(bar) {
      bar.style.height = bar.dataset.height;
    });
  });
}
