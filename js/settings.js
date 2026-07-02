function renderSettings() {
  const container = document.getElementById('settingsList');
  if (!container) return;

  container.innerHTML = APP_DATA.settings.map(s => `
    <div class="settings-card" onclick="showToast('Открываю: ${s.title}', '${s.icon}')">
      <div class="settings-card-icon" style="background:${s.bg};color:${s.color}">
        <i class="fa-solid ${s.icon}"></i>
      </div>
      <div class="settings-card-content">
        <div class="settings-card-title">${s.title}</div>
        <div class="settings-card-desc">${s.desc}</div>
      </div>
      <div class="settings-card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
    </div>
  `).join('');
}
