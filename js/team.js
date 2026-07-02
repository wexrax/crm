function renderTeam() {
  const container = document.getElementById('teamGrid');

  container.innerHTML = APP_DATA.team.map(m => `
    <div class="team-member" onclick="showToast('Открываю чат с ${m.name.split(' ')[0]}', 'fa-message')">
      <div class="team-member-avatar" style="background:${Utils.avatarGradient(m.name)}">
        ${Utils.initials(m.name)}
        <span class="team-member-status status-${m.status}"></span>
      </div>
      <div class="team-member-info">
        <div class="team-member-name">${m.name}</div>
        <div class="team-member-role">${m.role}</div>
      </div>
      <div class="team-member-status-label" style="color:${Utils.statusColor(m.status)}">
        <span class="team-member-status-dot" style="background:${Utils.statusColor(m.status)}"></span>
        ${Utils.statusLabel(m.status)}
      </div>
    </div>
  `).join('');
}
