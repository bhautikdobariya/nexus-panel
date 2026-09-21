/**
 * NexusPanel Admin Dashboard – Analytics JavaScript
 * ─────────────────────────────────────────────
 * Features:
 *  - Audience Growth & Traffic Chart (Dual-line Chart.js with dynamic date range toggle)
 *  - Device Distribution Donut Chart
 *  - 4 Mini Sparkline Charts on KPI cards
 *  - Real-time active users ticker simulation
 *  - Date range switcher (Today, 7D, 30D, 90D, 1Y)
 *  - Sidebar collapse & mobile drawer handling
 *  - Dark / Light mode sync
 *  - Notification popover & profile dropdown
 *  - Responsive resize listeners
 */

'use strict';

/* ─── DOM References ────────────────────────────────────── */
const sidebar         = document.getElementById('sidebar');
const sidebarToggle   = document.getElementById('sidebarToggle');
const mobileMenuBtn   = document.getElementById('mobileMenuBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const themeToggle     = document.getElementById('themeToggle');
const themeIcon       = document.getElementById('themeIcon');
const notifBtn       = document.getElementById('notificationBtn');
const notifPopover   = document.getElementById('notifPopover');
const notifDot       = document.getElementById('notifDot');
const notifList      = document.getElementById('notifList');
const markAllBtn     = document.getElementById('markAllReadBtn');
const notifCountEl   = document.getElementById('notifCountBadge');
const profileBtn     = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const popoverBackdrop = document.getElementById('popoverBackdrop');

/* ─── Toast Notification Helper ──────────────────────────── */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ─── Sidebar Toggle ─────────────────────────────────────── */
sidebarToggle.addEventListener('click', () => {
  if (window.innerWidth > 900) {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
    setTimeout(() => {
      resizeAllCharts();
    }, 460);
  } else {
    document.body.classList.remove('sidebar-open');
  }
});

mobileMenuBtn.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-open');
});

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
  setTimeout(() => { updateAnalyticsChartsTheme(); }, 50);
});

function applyLightMode() {
  document.documentElement.classList.add('light-mode');
  document.body.classList.add('light-mode');
  themeIcon.className = 'fa-solid fa-sun';
}

/* ─── Mini Sparklines Factory ────────────────────────────── */
function createSparkline(canvasId, data, color) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

const sparkPageviews = createSparkline('sparkPageviews', [18, 24, 21, 32, 28, 42, 38, 49], '#7c6ff7');
const sparkVisitors  = createSparkline('sparkVisitors',  [12, 16, 14, 22, 19, 29, 25, 34], '#4f8ef7');
const sparkDuration  = createSparkline('sparkDuration',  [180, 195, 210, 200, 225, 218, 230, 228], '#34d399');
const sparkBounce    = createSparkline('sparkBounce',    [44, 42, 40, 39, 37, 36, 35, 34], '#fb923c');

/* ─── Audience Growth Line Chart ─────────────────────────── */
const audienceDataSets = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pageviews: [28400, 36200, 31800, 42900, 39500, 54200, 48900],
    visitors:  [12100, 15400, 14200, 19100, 17800, 24300, 21500]
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    pageviews: [184000, 212000, 246000, 284590],
    visitors:  [72000, 84000, 91000, 96820]
  },
  '90d': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    pageviews: [620000, 715000, 842000],
    visitors:  [240000, 278000, 312000]
  },
  '1y': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    pageviews: [140000, 165000, 195000, 220000, 250000, 280000, 310000, 340000, 370000, 410000, 450000, 490000],
    visitors:  [55000, 68000, 82000, 91000, 104000, 118000, 132000, 145000, 158000, 172000, 189000, 205000]
  }
};

const audienceCtx = document.getElementById('audienceChart')?.getContext('2d');

function getAudienceGradient(ctx, color1, color2) {
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  return grad;
}

let audienceChart = null;
if (audienceCtx) {
  audienceChart = new Chart(audienceCtx, {
    type: 'line',
    data: {
      labels: audienceDataSets['7d'].labels,
      datasets: [
        {
          label: 'Total Pageviews',
          data: audienceDataSets['7d'].pageviews,
          borderColor: '#7c6ff7',
          borderWidth: 2.5,
          pointBackgroundColor: '#7c6ff7',
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
          backgroundColor: getAudienceGradient(audienceCtx, 'rgba(124,111,247,0.25)', 'rgba(124,111,247,0.0)'),
        },
        {
          label: 'Unique Visitors',
          data: audienceDataSets['7d'].visitors,
          borderColor: '#4f8ef7',
          borderWidth: 2.5,
          pointBackgroundColor: '#4f8ef7',
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
          backgroundColor: getAudienceGradient(audienceCtx, 'rgba(79,142,247,0.2)', 'rgba(79,142,247,0.0)'),
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#8b92a9',
            font: { size: 12, family: 'Inter' },
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: '#1c1f2b',
          titleColor: '#e8eaf6',
          bodyColor: '#8b92a9',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`
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
            callback: v => (v >= 1000 ? (v / 1000) + 'k' : v)
          }
        }
      }
    }
  });
}

// Filter pills switcher
document.querySelectorAll('.filter-pill[data-range]').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill[data-range]').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const range = pill.dataset.range;
    const data = audienceDataSets[range] || audienceDataSets['7d'];

    if (audienceChart) {
      audienceChart.data.labels = data.labels;
      audienceChart.data.datasets[0].data = data.pageviews;
      audienceChart.data.datasets[1].data = data.visitors;
      audienceChart.update();
    }
  });
});

/* ─── Device Breakdown Donut Chart ───────────────────────── */
const deviceData = [
  { label: 'Desktop', percentage: 58, color: '#7c6ff7' },
  { label: 'Mobile',  percentage: 34, color: '#4f8ef7' },
  { label: 'Tablet',  percentage: 8,  color: '#34d399' },
];

const deviceCtx = document.getElementById('deviceChart')?.getContext('2d');
let deviceChart = null;

if (deviceCtx) {
  deviceChart = new Chart(deviceCtx, {
    type: 'doughnut',
    data: {
      labels: deviceData.map(d => d.label),
      datasets: [{
        data: deviceData.map(d => d.percentage),
        backgroundColor: deviceData.map(d => d.color),
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
}

// Device custom legend
const deviceLegend = document.getElementById('deviceLegend');
if (deviceLegend) {
  deviceLegend.innerHTML = deviceData.map(item => `
    <div class="legend-item">
      <span class="legend-label">
        <span class="legend-dot" style="background:${item.color}"></span>
        ${item.label}
      </span>
      <span class="legend-value">${item.percentage}%</span>
    </div>
  `).join('');
}

/* ─── Real-Time Active Users Simulation ──────────────────── */
const realtimeCountEl = document.getElementById('realtimeCount');
let baseActiveUsers = 142;

setInterval(() => {
  if (!realtimeCountEl) return;
  // Gentle random fluctuation (+/- 3 users)
  const delta = Math.floor(Math.random() * 7) - 3;
  baseActiveUsers = Math.max(115, Math.min(185, baseActiveUsers + delta));
  realtimeCountEl.textContent = baseActiveUsers;
}, 3000);

/* ─── Resize All Charts Helper ───────────────────────────── */
function resizeAllCharts() {
  if (audienceChart) audienceChart.resize();
  if (deviceChart) deviceChart.resize();
  if (sparkPageviews) sparkPageviews.resize();
  if (sparkVisitors) sparkVisitors.resize();
  if (sparkDuration) sparkDuration.resize();
  if (sparkBounce) sparkBounce.resize();
}

/* ─── Window Resize Listener ─────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    document.body.classList.remove('sidebar-open');
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
  } else {
    document.body.classList.remove('sidebar-collapsed');
  }

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeAllCharts();
  }, 100);
});

/* ─── Theme Update for Charts ────────────────────────────── */
function updateAnalyticsChartsTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = isLight ? '#4b5563' : '#8b92a9';
  const tooltipBg = isLight ? '#ffffff' : '#1c1f2b';
  const tooltipTitle = isLight ? '#111827' : '#e8eaf6';

  if (audienceChart) {
    audienceChart.options.scales.x.grid.color = gridColor;
    audienceChart.options.scales.y.grid.color = gridColor;
    audienceChart.options.scales.x.ticks.color = tickColor;
    audienceChart.options.scales.y.ticks.color = tickColor;
    audienceChart.options.plugins.tooltip.backgroundColor = tooltipBg;
    audienceChart.options.plugins.tooltip.titleColor = tooltipTitle;
    audienceChart.options.plugins.legend.labels.color = tickColor;
    audienceChart.update();
  }

  if (deviceChart) {
    deviceChart.options.plugins.tooltip.backgroundColor = tooltipBg;
    deviceChart.options.plugins.tooltip.titleColor = tooltipTitle;
    deviceChart.update();
  }
}

/* ─── Notification Popover ───────────────────────────────── */
const notifications = [
  { id: 1, icon: 'fa-chart-line',         color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)', title: 'Traffic Spike',             text: 'Organic traffic increased by +42% today.',   time: '5 mins ago',   unread: true  },
  { id: 2, icon: 'fa-triangle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)',  title: 'High Bounce Alert',          text: 'Page /pricing bounce rate reached 52%.',     time: '25 mins ago',  unread: true  },
  { id: 3, icon: 'fa-bolt',               color: '#34d399', bg: 'rgba(52,211,153,0.15)',  title: 'Page Speed Optimized',       text: 'LCP improved to 0.9s on mobile devices.',    time: '2 hrs ago',    unread: false },
];

function renderNotifications() {
  const unreadCount = notifications.filter(n => n.unread).length;
  if (!notifList) return;
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

  if (unreadCount > 0) {
    if (notifCountEl) notifCountEl.textContent = `${unreadCount} New`;
    if (notifDot) notifDot.style.display = '';
  } else {
    if (notifCountEl) {
      notifCountEl.textContent = 'All read';
      notifCountEl.style.background = 'var(--text-muted)';
    }
    if (notifDot) notifDot.style.display = 'none';
  }
}

if (markAllBtn) {
  markAllBtn.addEventListener('click', () => {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
  });
}

function openPopover(popover, btn) {
  popover.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
  if (popoverBackdrop) popoverBackdrop.classList.add('active');
}
function closeAllPopovers() {
  if (notifPopover) notifPopover.classList.remove('open');
  if (profileDropdown) profileDropdown.classList.remove('open');
  if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
  if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
  if (popoverBackdrop) popoverBackdrop.classList.remove('active');
}

if (notifBtn) {
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = notifPopover.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      renderNotifications();
      openPopover(notifPopover, notifBtn);
    }
  });
}

if (profileBtn) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = profileDropdown.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) openPopover(profileDropdown, profileBtn);
  });
}

if (popoverBackdrop) popoverBackdrop.addEventListener('click', closeAllPopovers);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllPopovers();
});

// Profile sign out
document.getElementById('pdLogout')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAllPopovers();
  if (confirm('Are you sure you want to sign out?')) {
    window.location.href = 'login.html';
  }
});

// Export CSV / Report buttons
document.getElementById('exportBtn')?.addEventListener('click', () => {
  showToast('Exporting Analytics report in CSV format...', 'info');
});

// Initial notifications render
renderNotifications();

console.log('%c NexusPanel Analytics v1.0.0 ready 📈', 'color:#7c6ff7;font-weight:700;font-size:14px;');
