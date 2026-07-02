function renderAnalytics() {
  const { stats, bars, funnel } = APP_DATA.analytics;

  const statRowEl = document.getElementById('statRow');
  if (statRowEl) {
    statRowEl.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-icon" style="background:${s.color}22;color:${s.color}">
          <i class="fa-solid ${s.icon}"></i>
        </div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
        <div class="stat-trend" style="color:${s.trendUp ? 'var(--green)' : 'var(--amber)'}">
          <i class="fa-solid ${s.trendUp ? 'fa-arrow-up' : 'fa-clock'}"></i> ${s.trend}
        </div>
      </div>
    `).join('');
  }

  const barsEl = document.getElementById('barChart');
  if (barsEl) {
    barsEl.innerHTML = bars.map(b => `
      <div class="bar-item" style="height:0" data-height="${b.v}%">
        <span>${Math.round(b.v * 0.35)}</span>
        <b>${b.m}</b>
      </div>
    `).join('');

    requestAnimationFrame(() => {
      barsEl.querySelectorAll('.bar-item').forEach(bar => {
        bar.style.height = bar.dataset.height;
      });
    });
  }

  const funnelEl = document.getElementById('funnel');
  if (funnelEl) {
    funnelEl.innerHTML = funnel.map(f => `
      <div class="funnel-stage">
        <div class="funnel-info">
          <span>${f.n}</span>
          <span>${f.cnt}</span>
        </div>
        <div class="funnel-bar" style="width:${f.v}%;background:${f.c}">${f.v}%</div>
      </div>
    `).join('');
  }
}
