function renderKanban() {
  const container = document.getElementById('kanban');

  container.innerHTML = APP_DATA.stages.map(stage => {
    const deals = APP_DATA.deals.filter(d => d.stage === stage.id);
    const sum = deals.reduce((a, d) => a + d.amount, 0);

    return `
      <div class="kanban-column" data-stage="${stage.id}">
        <div class="kanban-column-header">
          <div style="display:flex;align-items:center">
            <span class="kanban-column-dot" style="background:${stage.color}"></span>
            ${stage.name}
            <span class="kanban-column-count">${deals.length}</span>
          </div>
          <span class="kanban-column-sum">${Utils.moneyShort(sum)}</span>
        </div>
        ${deals.map(d => `
          <div class="deal-card" draggable="true" data-id="${d.id}" onclick="openDealModal(${d.id})">
            <div class="deal-card-title">${d.company}</div>
            <div class="deal-card-amount">${Utils.money(d.amount)}</div>
            <div class="deal-card-progress"><div class="deal-card-progress-fill" style="width:${d.prob}%"></div></div>
            <div class="deal-card-meta">
              <div style="display:flex;align-items:center;gap:6px">
                <div class="deal-card-avatar" style="background:${Utils.color(d.owner)}">${Utils.initials(d.owner)}</div>
                <span>${d.owner.split(' ')[0]}</span>
              </div>
              <div class="deal-card-prob" style="background:${d.prob >= 70 ? '#34d399' : d.prob >= 40 ? '#f59e0b' : '#f87171'}">${d.prob}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }).join('');

  setupDragAndDrop();
}

function setupDragAndDrop() {
  let draggedEl = null;

  document.querySelectorAll('.deal-card').forEach(el => {
    el.addEventListener('dragstart', e => {
      draggedEl = el;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    el.addEventListener('dragend', () => {
      if (draggedEl) draggedEl.classList.remove('dragging');
      draggedEl = null;
    });
  });

  document.querySelectorAll('.kanban-column').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    col.addEventListener('drop', e => {
      e.preventDefault();
      if (!draggedEl) return;

      const dealId = parseInt(draggedEl.dataset.id);
      const newStage = col.dataset.stage;
      const deal = APP_DATA.deals.find(d => d.id === dealId);
      const stage = APP_DATA.stages.find(s => s.id === newStage);

      if (deal) {
        deal.stage = newStage;
        renderKanban();
        showToast(`«${deal.company}» → ${stage.name}`, 'fa-arrow-right');
      }
    });
  });
}
