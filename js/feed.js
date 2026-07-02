function renderFeed() {
  const container = document.getElementById('feed');
  let lastGroup = '';

  container.innerHTML = APP_DATA.feedItems.map(item => {
    const groupHtml = item.group !== lastGroup
      ? `<div class="feed-group-label"><i class="fa-solid fa-stream"></i> ${item.group}</div>`
      : '';
    lastGroup = item.group;

    const cardClass = 'card feed-card';

    const actionsHtml = item.actions.length
      ? `<div class="feed-card-actions">${item.actions.map(a =>
          `<button class="btn ${a.primary ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="handleFeedAction('${a.action}', event)">${a.label}</button>`
        ).join('')}</div>`
      : '';

    return groupHtml + `
      <div class="${cardClass}">
        <div class="feed-card-icon" style="background:${item.iconBg};color:${item.iconColor}">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="feed-card-body">
          <span class="feed-card-tag" style="background:${item.tagBg};color:${item.tagColor}">${item.tag}</span>
          <div class="feed-card-title">${item.title}</div>
          <div class="feed-card-desc">${item.desc}</div>
          ${actionsHtml}
        </div>
      </div>`;
  }).join('');
}

function handleFeedAction(action, event) {
  if (event) event.stopPropagation();
  const [type, val] = action.split(':');
  if (type === 'deal') openDealModal(parseInt(val));
  else if (type === 'call') showToast('Набираем ' + val + '… запись включена', 'fa-phone');
  else if (type === 'ai') showToast('AI анализирует: ' + val, 'fa-wand-magic-sparkles');
  else if (type === 'toast') showToast(val);
}
