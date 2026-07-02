function renderComms() {
  const container = document.getElementById('commsGrid');
  if (!container) return;

  container.innerHTML = APP_DATA.comms.map(c => `
    <div class="comm-card" onclick="showToast('Открываю ${c.title}…', '${c.icon}')">
      <div class="comm-card-icon" style="color:${c.color}">
        <i class="fa-solid ${c.icon}"></i>
      </div>
      <div class="comm-card-title">${c.title}</div>
      <div class="comm-card-desc">${c.desc}</div>
    </div>
  `).join('');
}
