function renderTasks() {
  const container = document.getElementById('taskList');

  container.innerHTML = APP_DATA.tasks.map(t => {
    const badgeStyle = Utils.taskStatusColor(t.status);
    return `
      <div class="task-card ${t.done ? 'completed' : ''}" data-id="${t.id}" onclick="toggleTask(${t.id})">
        <div class="task-checkbox" onclick="event.stopPropagation(); toggleTask(${t.id})">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="task-card-icon" style="background:${t.iconBg};color:${t.iconColor}">
          <i class="fa-solid ${t.icon}"></i>
        </div>
        <div class="task-card-content">
          <div class="task-card-title">${t.name}</div>
          <div class="task-card-sub">${t.sub}</div>
        </div>
        <div class="task-card-badge" style="${badgeStyle}">${Utils.taskStatusLabel(t.status)}</div>
      </div>`;
  }).join('');
}

function toggleTask(id) {
  const task = APP_DATA.tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  task.status = task.done ? 'done' : 'work';

  renderTasks();

  if (task.done) {
    showToast('Задача выполнена! +10 очков', 'fa-check');
  }
}
