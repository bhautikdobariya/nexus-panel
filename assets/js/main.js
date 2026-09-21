/**
 * NexusPanel Admin Dashboard – Main JavaScript
 * ─────────────────────────────────────────────
 * Features:
 *  - Sidebar collapse / mobile toggle
 *  - Dark / Light mode toggle
 *  - Counter animations on stat cards
 *  - Revenue chart (Chart.js) with weekly/monthly switch
 *  - Traffic donut chart
 *  - Dynamic orders table population
 *  - Activity feed population
 *  - Search filtering
 *  - Active nav item highlighting
 *  - Notification popover with unread management
 *  - Profile dropdown menu
 */

'use strict';

/* ─── DOM References ────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const sidebarToggle  = document.getElementById('sidebarToggle');
const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mainWrapper    = document.getElementById('mainWrapper');
const themeToggle    = document.getElementById('themeToggle');
const themeIcon      = document.getElementById('themeIcon');
const searchInput    = document.getElementById('searchInput');
const ordersTableBody = document.getElementById('ordersTableBody');
const activityList   = document.getElementById('activityList');

/* ─── Sidebar Toggle ─────────────────────────────────────── */
sidebarToggle.addEventListener('click', () => {
  if (window.innerWidth > 900) {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
    // Trigger chart redraw after sidebar collapse/expand animation completes
    setTimeout(() => {
      if (typeof revenueChart !== 'undefined' && revenueChart) revenueChart.resize();
      if (typeof trafficChart !== 'undefined' && trafficChart) trafficChart.resize();
    }, 460);
  } else {
    // On mobile, clicking the toggle inside sidebar closes it
    document.body.classList.remove('sidebar-open');
  }
});

mobileMenuBtn.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-open');
});

// Close mobile sidebar on backdrop click or outside click
if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });
}

document.addEventListener('click', (e) => {
  if (
    window.innerWidth <= 900 &&
    document.body.classList.contains('sidebar-open') &&
    !sidebar.contains(e.target) &&
    !mobileMenuBtn.contains(e.target) &&
    (!sidebarBackdrop || !sidebarBackdrop.contains(e.target))
  ) {
    document.body.classList.remove('sidebar-open');
  }
});

// Restore collapsed state (desktop only)
if (window.innerWidth > 900 && localStorage.getItem('sidebarCollapsed') === 'true') {
  document.body.classList.add('sidebar-collapsed');
}

/* ─── Theme Toggle ───────────────────────────────────────── */
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') applyLightMode();

themeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light-mode')) {
    document.documentElement.classList.remove('light-mode');
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    applyLightMode();
    localStorage.setItem('theme', 'light');
  }
  // Redraw charts on theme change
  setTimeout(() => { updateChartsTheme(); }, 50);
});

function applyLightMode() {
  document.documentElement.classList.add('light-mode');
  document.body.classList.add('light-mode');
  themeIcon.className = 'fa-solid fa-sun';
}

/* ─── Active Nav Highlight ───────────────────────────────── */
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ─── Counter Animation ──────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const isPercent = el.textContent.includes('%');
  const prefix = el.textContent.startsWith('$') ? '$' : '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString() + (isPercent ? '%' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toLocaleString() + (isPercent ? '%' : '');
  }

  requestAnimationFrame(step);
}

// Intersection observer to trigger on view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-target]').forEach(el => counterObserver.observe(el));

/* ─── Chart.js – Revenue Chart ───────────────────────────── */
const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data:   [4200, 6800, 5100, 9200, 7300, 11500, 8900],
};
const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data:   [31000, 28000, 42000, 38000, 55000, 47000, 62000, 58000, 71000, 65000, 80000, 84320],
};

const revenueCtx = document.getElementById('revenueChart').getContext('2d');

function getGradient(ctx, color1, color2) {
  const grad = ctx.createLinearGradient(0, 0, 0, 280);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  return grad;
}

let revenueChart = new Chart(revenueCtx, {
  type: 'line',
  data: {
    labels: weeklyData.labels,
    datasets: [{
      label: 'Revenue ($)',
      data: weeklyData.data,
      borderColor: '#7c6ff7',
      borderWidth: 2.5,
      pointBackgroundColor: '#7c6ff7',
      pointRadius: 4,
      pointHoverRadius: 7,
      tension: 0.45,
      fill: true,
      backgroundColor: getGradient(revenueCtx, 'rgba(124,111,247,0.3)', 'rgba(124,111,247,0.0)'),
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1f2b',
        titleColor: '#e8eaf6',
        bodyColor: '#8b92a9',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#8b92a9', font: { size: 12 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#8b92a9',
          font: { size: 12 },
          callback: v => '$' + (v >= 1000 ? (v / 1000) + 'k' : v)
        }
      }
    }
  }
});

// Chart tab switcher
document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const period = tab.dataset.period;
    const d = period === 'weekly' ? weeklyData : monthlyData;
    revenueChart.data.labels = d.labels;
    revenueChart.data.datasets[0].data = d.data;
    revenueChart.update('active');
  });
});

/* ─── Chart.js – Traffic Donut ───────────────────────────── */
const trafficData = [
  { label: 'Organic Search', value: 42, color: '#7c6ff7' },
  { label: 'Direct',         value: 24, color: '#4f8ef7' },
  { label: 'Social Media',   value: 19, color: '#34d399' },
  { label: 'Referral',       value: 15, color: '#fb923c' },
];

const trafficCtx = document.getElementById('trafficChart').getContext('2d');
let trafficChart = new Chart(trafficCtx, {
  type: 'doughnut',
  data: {
    labels: trafficData.map(d => d.label),
    datasets: [{
      data: trafficData.map(d => d.value),
      backgroundColor: trafficData.map(d => d.color),
      borderWidth: 0,
      hoverOffset: 8,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1f2b',
        titleColor: '#e8eaf6',
        bodyColor: '#8b92a9',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
      }
    }
  }
});

// Custom legend
const legendContainer = document.getElementById('trafficLegend');
trafficData.forEach(item => {
  legendContainer.innerHTML += `
    <div class="legend-item">
      <span class="legend-label">
        <span class="legend-dot" style="background:${item.color}"></span>
        ${item.label}
      </span>
      <span class="legend-value">${item.value}%</span>
    </div>`;
});

/* ─── Orders Table Data ──────────────────────────────────── */
const orders = [
  { id: '#ORD-0192', customer: 'Sophie Turner',  product: 'Pro Plan',     amount: '$299',  status: 'completed'  },
  { id: '#ORD-0191', customer: 'James Wilson',   product: 'Enterprise',   amount: '$899',  status: 'processing' },
  { id: '#ORD-0190', customer: 'Anya Roberts',   product: 'Starter Kit',  amount: '$49',   status: 'pending'    },
  { id: '#ORD-0189', customer: 'Carlos Mendez',  product: 'Pro Plan',     amount: '$299',  status: 'completed'  },
  { id: '#ORD-0188', customer: 'Mei Lin',        product: 'Team Bundle',  amount: '$499',  status: 'cancelled'  },
  { id: '#ORD-0187', customer: 'David Park',     product: 'Enterprise',   amount: '$899',  status: 'completed'  },
];

function statusBadge(status) {
  const labels = { completed: '✓ Completed', processing: '⟳ Processing', pending: '⏱ Pending', cancelled: '✕ Cancelled' };
  return `<span class="status-badge status-${status}">${labels[status]}</span>`;
}

function renderOrders(list) {
  ordersTableBody.innerHTML = list.map(o => `
    <tr>
      <td><span class="order-id">${o.id}</span></td>
      <td><span class="cust-name">${o.customer}</span></td>
      <td>${o.product}</td>
      <td>${o.amount}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>`).join('');
}

renderOrders(orders);

/* ─── Activity Feed Data ─────────────────────────────────── */
const activities = [
  { icon: 'fa-user-plus',          color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)', text: '<strong>New user</strong> Sophie Turner registered.',         time: '2 mins ago' },
  { icon: 'fa-bag-shopping',       color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)',  text: 'Order <strong>#ORD-0192</strong> marked as completed.',        time: '14 mins ago' },
  { icon: 'fa-circle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)',  text: 'Order <strong>#ORD-0188</strong> was cancelled by customer.', time: '38 mins ago' },
  { icon: 'fa-chart-line',         color: '#34d399', bg: 'rgba(52,211,153,0.15)',  text: 'Revenue hit <strong>$84k</strong> this month. 🎉',              time: '1 hr ago' },
  { icon: 'fa-gear',               color: '#8b92a9', bg: 'rgba(139,146,169,0.15)', text: 'System <strong>maintenance</strong> scheduled for tomorrow.',  time: '3 hrs ago' },
];

activityList.innerHTML = activities.map(a => `
  <li class="activity-item">
    <div class="activity-icon" style="background:${a.bg}; color:${a.color}">
      <i class="fa-solid ${a.icon}"></i>
    </div>
    <div class="activity-body">
      <p class="activity-text">${a.text}</p>
      <p class="activity-time">${a.time}</p>
    </div>
  </li>`).join('');

/* ─── Search Filter ──────────────────────────────────────── */
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(q) ||
    o.customer.toLowerCase().includes(q) ||
    o.product.toLowerCase().includes(q) ||
    o.status.includes(q)
  );
  renderOrders(filtered.length ? filtered : orders);
});

/* ─── Chart theme update ─────────────────────────────────── */
function updateChartsTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = isLight ? '#4b5563' : '#8b92a9';
  const tooltipBg = isLight ? '#ffffff' : '#1c1f2b';
  const tooltipTitle = isLight ? '#111827' : '#e8eaf6';

  revenueChart.options.scales.x.grid.color = gridColor;
  revenueChart.options.scales.y.grid.color = gridColor;
  revenueChart.options.scales.x.ticks.color = tickColor;
  revenueChart.options.scales.y.ticks.color = tickColor;
  revenueChart.options.plugins.tooltip.backgroundColor = tooltipBg;
  revenueChart.options.plugins.tooltip.titleColor = tooltipTitle;
  revenueChart.update();
}


/* ─── Notification Popover ───────────────────────────────── */

const notifBtn      = document.getElementById('notificationBtn');
const notifPopover  = document.getElementById('notifPopover');
const notifDot      = document.getElementById('notifDot');
const notifList     = document.getElementById('notifList');
const markAllBtn    = document.getElementById('markAllReadBtn');
const notifCountEl  = document.getElementById('notifCountBadge');
const profileBtn    = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const popoverBackdrop = document.getElementById('popoverBackdrop');

const notifications = [
  { id: 1, icon: 'fa-user-plus',          color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)', title: 'New User Registered',        text: 'Sophie Turner joined the platform.',         time: '2 mins ago',   unread: true  },
  { id: 2, icon: 'fa-bag-shopping',       color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)',  title: 'Order Completed',            text: 'Order #ORD-0192 marked as completed.',       time: '14 mins ago',  unread: true  },
  { id: 3, icon: 'fa-circle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)',  title: 'Order Cancelled',            text: '#ORD-0188 was cancelled by customer.',       time: '38 mins ago',  unread: true  },
  { id: 4, icon: 'fa-chart-line',         color: '#34d399', bg: 'rgba(52,211,153,0.15)',  title: 'Revenue Milestone 🎉',      text: 'Revenue hit $84k this month!',              time: '1 hr ago',     unread: true  },
  { id: 5, icon: 'fa-gear',               color: '#8b92a9', bg: 'rgba(139,146,169,0.15)', title: 'Maintenance Scheduled',      text: 'System maintenance tomorrow at 2 AM.',       time: '3 hrs ago',    unread: true  },
  { id: 6, icon: 'fa-envelope',           color: '#34d399', bg: 'rgba(52,211,153,0.15)',  title: 'New Message',                text: 'Carlos Mendez sent you a message.',          time: '5 hrs ago',    unread: false },
];

function getUnreadCount() { return notifications.filter(n => n.unread).length; }

function renderNotifications() {
  const unreadCount = getUnreadCount();
  notifList.innerHTML = notifications.map(n => `
    <li class="notif-item${n.unread ? ' unread' : ''}" data-id="${n.id}">
      <div class="notif-icon-wrap" style="background:${n.bg}; color:${n.color}">
        <i class="fa-solid ${n.icon}"></i>
      </div>
      <div class="notif-body">
        <p class="notif-title">${n.title}</p>
        <p class="notif-text">${n.text}</p>
        <p class="notif-time">${n.time}</p>
      </div>
      ${n.unread ? '<span class="notif-unread-dot"></span>' : ''}
    </li>`).join('');

  // update count badge
  if (unreadCount > 0) {
    notifCountEl.textContent = `${unreadCount} New`;
    notifCountEl.style.display = '';
    notifDot.style.display = '';
  } else {
    notifCountEl.textContent = 'All read';
    notifCountEl.style.background = 'var(--text-muted)';
    notifDot.style.display = 'none';
  }

  // click to mark individual as read
  notifList.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      const notif = notifications.find(n => n.id === id);
      if (notif && notif.unread) {
        notif.unread = false;
        renderNotifications();
      }
    });
  });
}

// Mark all read
markAllBtn.addEventListener('click', () => {
  notifications.forEach(n => n.unread = false);
  renderNotifications();
});

// ─── Popover toggle helpers ───────────────────────────────
function openPopover(popover, btn) {
  popover.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
  popoverBackdrop.classList.add('active');
}
function closeAllPopovers() {
  notifPopover.classList.remove('open');
  profileDropdown.classList.remove('open');
  notifBtn.setAttribute('aria-expanded', 'false');
  profileBtn.setAttribute('aria-expanded', 'false');
  popoverBackdrop.classList.remove('active');
}

// Notification button
notifBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = notifPopover.classList.contains('open');
  closeAllPopovers();
  if (!isOpen) {
    renderNotifications();
    openPopover(notifPopover, notifBtn);
  }
});

// Profile button
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = profileDropdown.classList.contains('open');
  closeAllPopovers();
  if (!isOpen) openPopover(profileDropdown, profileBtn);
});

// Backdrop click closes everything
popoverBackdrop.addEventListener('click', closeAllPopovers);

// Escape key closes
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllPopovers();
});

// Profile menu item handlers
document.getElementById('pdLogout')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAllPopovers();
  if (confirm('Are you sure you want to sign out?')) {
    window.location.href = 'login.html';
  }
});

// Initialize notification dot
renderNotifications();

/* ─── Window Resize Handler ──────────────────────────────── */
let resizeDebounceTimer;
window.addEventListener('resize', () => {
  // If user expands screen to desktop, remove mobile drawer open class
  if (window.innerWidth > 900) {
    document.body.classList.remove('sidebar-open');
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
  } else {
    // If shrunk to mobile, ensure desktop collapsed class doesn't linger
    document.body.classList.remove('sidebar-collapsed');
  }

  // Debounce chart resizing to prevent lag during rapid window dragging
  clearTimeout(resizeDebounceTimer);
  resizeDebounceTimer = setTimeout(() => {
    if (typeof revenueChart !== 'undefined' && revenueChart) {
      revenueChart.resize();
    }
    if (typeof trafficChart !== 'undefined' && trafficChart) {
      trafficChart.resize();
    }
  }, 100);
});

console.log('%c NexusPanel v1.0.0 ready ⚡', 'color:#7c6ff7;font-weight:700;font-size:14px;');
