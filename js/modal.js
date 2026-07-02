function openDealModal(dealId) {
  const deal = APP_DATA.deals.find(d => d.id === dealId);
  if (!deal) return;

  const stage = APP_DATA.stages.find(s => s.id === deal.stage);
  const avatarEl = document.getElementById('modalAvatar');
  const nameEl = document.getElementById('modalDealName');
  const metaEl = document.getElementById('modalDealMeta');
  const amountEl = document.getElementById('modalDealAmount');
  const probEl = document.getElementById('modalDealProb');
  const bodyEl = document.getElementById('modalBody');

  avatarEl.textContent = Utils.initials(deal.company);
  avatarEl.style.background = Utils.avatarGradient(deal.company);
  nameEl.textContent = deal.company;
  metaEl.textContent = `${deal.industry} · ${deal.city}`;
  amountEl.textContent = Utils.money(deal.amount);
  probEl.textContent = `${deal.prob}% готовность`;

  bodyEl.innerHTML = `
    <div class="modal-actions">
      <button class="btn btn-primary btn-sm" onclick="showToast('Набираю через WebRTC…', 'fa-phone')"><i class="fa-solid fa-phone"></i> Позвонить</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Открываю чат', 'fa-message')"><i class="fa-solid fa-message"></i> Написать</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Встреча назначена', 'fa-calendar')"><i class="fa-solid fa-calendar-plus"></i> Встреча</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Задача создана', 'fa-plus')"><i class="fa-solid fa-plus"></i> Задача</button>
    </div>

    <div class="modal-info-grid">
      <div class="modal-info-item"><span>Контактное лицо</span><b>${deal.contact}</b></div>
      <div class="modal-info-item"><span>Телефон</span><b>${deal.phone}</b></div>
      <div class="modal-info-item"><span>Ответственный</span><b>${deal.owner}</b></div>
      <div class="modal-info-item"><span>Стадия</span><b style="color:${stage.color}">${stage.name}</b></div>
    </div>

    <h3 style="font-size:15px;margin-bottom:12px;color:#fff">Следующие шаги</h3>
    <div class="timeline-item">
      <div class="timeline-icon" style="background:rgba(99,102,241,.18);color:#818cf8"><i class="fa-solid fa-phone"></i></div>
      <div class="timeline-body">
        <b>Позвонить клиенту</b>
        <p>Обсудить условия оплаты и сроки внедрения</p>
        <div class="timeline-time">Рекомендовано сегодня в 10:00</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon" style="background:rgba(168,85,247,.18);color:#c084fc"><i class="fa-solid fa-file-lines"></i></div>
      <div class="timeline-body">
        <b>Отправить обновлённое КП</b>
        <p>ИИ подготовил черновик с учётом переговоров</p>
        <div class="timeline-time">До 16:00</div>
      </div>
    </div>
  `;

  document.getElementById('dealModal').classList.add('open');
}

function closeDealModal() {
  document.getElementById('dealModal').classList.remove('open');
}

function switchModalTab(tabName, el) {
  el.parentElement.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById('pane-' + tabName);
  if (pane) pane.classList.add('active');
}

document.addEventListener('click', e => {
  if (e.target.id === 'dealModal') closeDealModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDealModal();
    const aiPanel = document.getElementById('aiPanel');
    if (aiPanel.classList.contains('open')) toggleAIPanel();
  }
});
