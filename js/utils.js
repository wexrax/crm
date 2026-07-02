const Utils = {
  initials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  },

  color(str) {
    const palette = ['#6366f1', '#f59e0b', '#34d399', '#818cf8', '#f87171', '#00cec9', '#a855f7', '#ec4899'];
    let h = 0;
    for (const c of str) h += c.charCodeAt(0);
    return palette[h % palette.length];
  },

  money(n) {
    return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  },

  moneyShort(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'М';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'К';
    return n.toString();
  },

  avatarGradient(name) {
    const gradients = [
      'linear-gradient(135deg, #6366f1, #a855f7)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #8b5cf6, #ec4899)',
      'linear-gradient(135deg, #3b82f6, #6366f1)',
      'linear-gradient(135deg, #ec4899, #f59e0b)',
    ];
    let h = 0;
    for (const c of name) h += c.charCodeAt(0);
    return gradients[h % gradients.length];
  },

  statusLabel(status) {
    const map = {
      online: 'Онлайн',
      meeting: 'На встрече',
      away: 'Отошёл',
      offline: 'Не в сети',
    };
    return map[status] || status;
  },

  statusColor(status) {
    const map = {
      online: '#34d399',
      meeting: '#fbbf24',
      away: '#fbbf24',
      offline: '#6b7280',
    };
    return map[status] || '#6b7280';
  },

  priorityLabel(p) {
    const map = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
    return map[p] || p;
  },

  priorityBadgeColor(p) {
    const map = {
      high: 'background:rgba(239,68,68,.2);color:#f87171',
      medium: 'background:rgba(245,158,11,.2);color:#fbbf24',
      low: 'background:rgba(52,211,153,.2);color:#34d399',
    };
    return map[p] || '';
  },

  taskStatusLabel(s) {
    const map = { work: 'В работе', review: 'Согласование', done: 'Выполнено' };
    return map[s] || s;
  },

  taskStatusColor(s) {
    const map = {
      work: 'background:rgba(99,102,241,.2);color:#818cf8',
      review: 'background:rgba(245,158,11,.2);color:#fbbf24',
      done: 'background:rgba(52,211,153,.2);color:#34d399',
    };
    return map[s] || '';
  },
};
