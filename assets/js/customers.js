/**
 * NexusPanel Admin Dashboard – Customers & CRM JavaScript
 * ───────────────────────────────────────────────────────
 * Features:
 *  - Dynamic customer table rendering with avatars, company, and tier badges
 *  - Customer segmentation tabs (All, VIP, Active, Trial, Churn Risk)
 *  - Multi-criteria real-time filtering (Search query, status dropdown, sorting)
 *  - Customer 360° Profile Details modal with order history and activity timeline
 *  - Add New Customer modal with live table update
 *  - Multi-select checkbox and floating bulk actions bar
 *  - Dark / Light mode sync
 *  - Mobile sidebar drawer and responsive resize handling
 */

'use strict';

/* ─── Mock Customers Dataset ─────────────────────────────── */
const customersData = [
  {
    id: 1,
    name: 'Sophie Turner',
    email: 'sophie.t@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    company: 'Stark Enterprises',
    role: 'Chief Technology Officer',
    country: 'United States',
    flag: '🇺🇸',
    city: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    totalOrders: 14,
    totalSpent: 4210.00,
    tier: 'vip',
    tierLabel: 'VIP Elite',
    status: 'active',
    online: true,
    memberSince: 'Jan 2024',
    orders: [
      { id: '#ORD-0192', date: 'Sep 19, 2026', total: 299.00, status: 'completed' },
      { id: '#ORD-0174', date: 'Aug 12, 2026', total: 899.00, status: 'completed' },
      { id: '#ORD-0140', date: 'Jun 24, 2026', total: 199.00, status: 'completed' }
    ],
    activities: [
      { icon: 'fa-bag-shopping', text: 'Placed order <strong>#ORD-0192</strong> for NexusPanel Pro.', time: '14 mins ago' },
      { icon: 'fa-right-to-bracket', text: 'Logged in from IP <strong>192.168.1.42</strong> (San Francisco).', time: '2 hrs ago' },
      { icon: 'fa-ticket', text: 'Resolved support ticket <strong>#SUP-8821</strong> regarding API keys.', time: '2 days ago' }
    ]
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james.w@acme.corp',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    company: 'Acme Global Corp',
    role: 'VP of Engineering',
    country: 'United States',
    flag: '🇺🇸',
    city: 'New York, NY',
    timezone: 'EST (UTC-5)',
    totalOrders: 9,
    totalSpent: 6890.00,
    tier: 'enterprise',
    tierLabel: 'Enterprise',
    status: 'active',
    online: true,
    memberSince: 'Mar 2023',
    orders: [
      { id: '#ORD-0191', date: 'Sep 19, 2026', total: 899.00, status: 'processing' },
      { id: '#ORD-0155', date: 'Jul 04, 2026', total: 2490.00, status: 'completed' }
    ],
    activities: [
      { icon: 'fa-credit-card', text: 'Payment of <strong>$899.00</strong> verified via Mastercard.', time: '4 hrs ago' },
      { icon: 'fa-key', text: 'Generated 3 new <strong>Production API Keys</strong>.', time: '1 day ago' }
    ]
  },
  {
    id: 3,
    name: 'Anya Roberts',
    email: 'anya.r@designhub.io',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    company: 'DesignHub Studios',
    role: 'Creative Director',
    country: 'United Kingdom',
    flag: '🇬🇧',
    city: 'London',
    timezone: 'GMT (UTC+0)',
    totalOrders: 3,
    totalSpent: 147.00,
    tier: 'trial',
    tierLabel: 'Free Trial',
    status: 'lead',
    online: false,
    memberSince: 'Aug 2026',
    orders: [
      { id: '#ORD-0190', date: 'Sep 18, 2026', total: 49.00, status: 'pending' }
    ],
    activities: [
      { icon: 'fa-user-plus', text: 'Registered 14-day trial account.', time: '2 days ago' },
      { icon: 'fa-download', text: 'Downloaded starter documentation PDF.', time: '2 days ago' }
    ]
  },
  {
    id: 4,
    name: 'Carlos Mendez',
    email: 'carlos.m@techops.net',
    phone: '+34 91 123 4567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    company: 'TechOps Iberia',
    role: 'Head of Infrastructure',
    country: 'Spain',
    flag: '🇪🇸',
    city: 'Madrid',
    timezone: 'CET (UTC+1)',
    totalOrders: 8,
    totalSpent: 2140.00,
    tier: 'pro',
    tierLabel: 'Pro Member',
    status: 'active',
    online: true,
    memberSince: 'Nov 2024',
    orders: [
      { id: '#ORD-0189', date: 'Sep 18, 2026', total: 299.00, status: 'completed' },
      { id: '#ORD-0162', date: 'Jul 21, 2026', total: 299.00, status: 'completed' }
    ],
    activities: [
      { icon: 'fa-rotate', text: 'Renewed monthly Pro subscription.', time: '1 day ago' },
      { icon: 'fa-sliders', text: 'Updated Webhook endpoints to v2.', time: '3 days ago' }
    ]
  },
  {
    id: 5,
    name: 'Mei Lin',
    email: 'mei.lin@zenith.ai',
    phone: '+65 6789 0123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    company: 'Zenith Artificial Intelligence',
    role: 'Lead ML Researcher',
    country: 'Singapore',
    flag: '🇸🇬',
    city: 'Singapore',
    timezone: 'SGT (UTC+8)',
    totalOrders: 2,
    totalSpent: 499.00,
    tier: 'pro',
    tierLabel: 'Pro Member',
    status: 'churned',
    online: false,
    memberSince: 'Feb 2025',
    orders: [
      { id: '#ORD-0188', date: 'Sep 17, 2026', total: 499.00, status: 'cancelled' }
    ],
    activities: [
      { icon: 'fa-ban', text: 'Cancelled Team Bundle order #ORD-0188.', time: '2 days ago' },
      { icon: 'fa-triangle-exclamation', text: 'Subscription marked as churn risk.', time: '3 days ago' }
    ]
  },
  {
    id: 6,
    name: 'David Park',
    email: 'd.park@nexuscorp.kr',
    phone: '+82 2 3456 7890',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    company: 'Nexus Korea Ltd',
    role: 'Operations Manager',
    country: 'South Korea',
    flag: '🇰🇷',
    city: 'Seoul',
    timezone: 'KST (UTC+9)',
    totalOrders: 11,
    totalSpent: 7420.00,
    tier: 'enterprise',
    tierLabel: 'Enterprise',
    status: 'active',
    online: true,
    memberSince: 'Dec 2023',
    orders: [
      { id: '#ORD-0187', date: 'Sep 17, 2026', total: 899.00, status: 'completed' },
      { id: '#ORD-0120', date: 'Apr 10, 2026', total: 1800.00, status: 'completed' }
    ],
    activities: [
      { icon: 'fa-server', text: 'Allocated dedicated server cluster in Asia-East.', time: '3 days ago' },
      { icon: 'fa-shield', text: 'Enabled 2-Factor Authentication (2FA).', time: '1 week ago' }
    ]
  },
  {
    id: 7,
    name: 'Elena Rostova',
    email: 'elena.rostova@cloudscale.de',
    phone: '+49 30 1234567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    company: 'CloudScale Munich',
    role: 'DevOps Lead',
    country: 'Germany',
    flag: '🇩🇪',
    city: 'Berlin',
    timezone: 'CET (UTC+1)',
    totalOrders: 6,
    totalSpent: 1890.00,
    tier: 'pro',
    tierLabel: 'Pro Member',
    status: 'active',
    online: false,
    memberSince: 'May 2024',
    orders: [
      { id: '#ORD-0186', date: 'Sep 16, 2026', total: 349.00, status: 'processing' }
    ],
    activities: [
      { icon: 'fa-certificate', text: 'Downloaded SOC2 Compliance verification report.', time: '4 days ago' },
      { icon: 'fa-envelope', text: 'Opened product update newsletter.', time: '5 days ago' }
    ]
  },
  {
    id: 8,
    name: 'Liam O\'Connor',
    email: 'liam@dublinfintech.ie',
    phone: '+353 1 496 0123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    company: 'Dublin Fintech Solutions',
    role: 'Managing Director',
    country: 'Ireland',
    flag: '🇮🇪',
    city: 'Dublin',
    timezone: 'IST (UTC+1)',
    totalOrders: 1,
    totalSpent: 129.00,
    tier: 'trial',
    tierLabel: 'Free Trial',
    status: 'inactive',
    online: false,
    memberSince: 'Jul 2026',
    orders: [
      { id: '#ORD-0185', date: 'Sep 16, 2026', total: 129.00, status: 'pending' }
    ],
    activities: [
      { icon: 'fa-clock', text: 'Account inactive for 14 consecutive days.', time: '4 days ago' }
    ]
  }
];

/* ─── State ──────────────────────────────────────────────── */
let currentSegmentTab = 'all';
let currentSearchQuery = '';
let currentStatusFilter = 'all';
let currentSort = 'ltv-desc';
let selectedCustomerIds = new Set();

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

const customersTableBody = document.getElementById('customersTableBody');
const selectAllCustomers = document.getElementById('selectAllCustomers');
const searchCustomersInput = document.getElementById('searchCustomersInput');
const statusFilterSelect = document.getElementById('statusFilterSelect');
const sortCustomersSelect = document.getElementById('sortCustomersSelect');
const bulkActionsBar  = document.getElementById('bulkActionsBar');
const bulkCountBadge  = document.getElementById('bulkCountBadge');
const deselectAllBtn  = document.getElementById('deselectAllBtn');

// Customer Details Modal
const customerProfileModalBackdrop = document.getElementById('customerProfileModalBackdrop');
const modalCloseProfileBtn = document.getElementById('modalCloseProfileBtn');
const modalCloseProfileFooterBtn = document.getElementById('modalCloseProfileFooterBtn');
const modalSendEmailBtn = document.getElementById('modalSendEmailBtn');

// Add Customer Modal
const addCustomerModalBackdrop = document.getElementById('addCustomerModalBackdrop');
const openAddCustomerBtn = document.getElementById('openAddCustomerBtn');
const modalCloseAddBtn = document.getElementById('modalCloseAddBtn');
const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
const addCustomerForm = document.getElementById('addCustomerForm');

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

/* ─── Badges Helpers ─────────────────────────────────────── */
function statusBadge(status) {
  const map = {
    active:   { label: '● Active',   cls: 'status-completed' },
    lead:     { label: '★ Lead',     cls: 'status-processing' },
    inactive: { label: '⏱ Inactive', cls: 'status-pending' },
    churned:  { label: '✕ Churned',  cls: 'status-cancelled' }
  };
  const item = map[status] || map.active;
  return `<span class="status-badge ${item.cls}">${item.label}</span>`;
}

function tierBadge(tier, label) {
  const map = {
    vip:        'tier-vip',
    enterprise: 'tier-enterprise',
    pro:        'tier-pro',
    trial:      'tier-trial'
  };
  const cls = map[tier] || 'tier-pro';
  return `<span class="tier-badge ${cls}"><i class="fa-solid fa-crown" style="font-size:10px;"></i> ${label}</span>`;
}

/* ─── Filter & Sort Logic ────────────────────────────────── */
function getFilteredCustomers() {
  let list = customersData.filter(c => {
    // Segment Tab
    if (currentSegmentTab === 'vip' && c.tier !== 'vip' && c.tier !== 'enterprise') return false;
    if (currentSegmentTab === 'active' && c.status !== 'active') return false;
    if (currentSegmentTab === 'trial' && c.tier !== 'trial') return false;
    if (currentSegmentTab === 'churn' && c.status !== 'churned') return false;

    // Status Dropdown
    if (currentStatusFilter !== 'all' && c.status !== currentStatusFilter) return false;

    // Search Query
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchComp = c.company.toLowerCase().includes(q);
      const matchCountry = c.country.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchComp && !matchCountry) return false;
    }
    return true;
  });

  // Sorting
  if (currentSort === 'ltv-desc') {
    list.sort((a, b) => b.totalSpent - a.totalSpent);
  } else if (currentSort === 'orders-desc') {
    list.sort((a, b) => b.totalOrders - a.totalOrders);
  } else if (currentSort === 'newest') {
    list.sort((a, b) => b.id - a.id);
  } else if (currentSort === 'name-asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

/* ─── Render Customers Table ─────────────────────────────── */
function renderCustomersTable() {
  const list = getFilteredCustomers();

  if (list.length === 0) {
    customersTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-users-slash" style="font-size: 32px; margin-bottom: 10px; display:block;"></i>
          No customers match your search or segmentation filter.
        </td>
      </tr>
    `;
    updateBulkBar();
    return;
  }

  customersTableBody.innerHTML = list.map(c => {
    const isChecked = selectedCustomerIds.has(c.id) ? 'checked' : '';
    return `
      <tr data-id="${c.id}">
        <td>
          <input type="checkbox" class="order-check cust-checkbox" data-id="${c.id}" ${isChecked} />
        </td>
        <td>
          <div class="cust-cell">
            <div style="position:relative;">
              <img src="${c.avatar}" alt="${c.name}" class="cust-avatar-sm" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7c6ff7&color=fff&rounded=true';" />
              ${c.online ? '<span class="online-dot-sm" style="position:absolute; bottom:0; right:0; border:2px solid var(--bg-surface);"></span>' : ''}
            </div>
            <div class="cust-meta">
              <a href="#" class="cust-meta-name view-profile-btn" data-id="${c.id}">${c.name}</a>
              <span class="cust-meta-email">${c.email}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="company-cell">
            <span class="company-name">${c.company}</span>
            <span class="company-role">${c.role}</span>
          </div>
        </td>
        <td>
          <span style="font-size:13px; display:inline-flex; align-items:center; gap:6px;">
            <span style="font-size:15px;">${c.flag}</span> ${c.country}
          </span>
        </td>
        <td>
          <strong style="color:var(--text-primary); font-size:13.5px;">${c.totalOrders} orders</strong>
        </td>
        <td>
          <strong style="color:var(--accent-light); font-size:14px;">$${c.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
        </td>
        <td>
          ${tierBadge(c.tier, c.tierLabel)}
        </td>
        <td>
          ${statusBadge(c.status)}
        </td>
        <td style="text-align:right;">
          <div class="action-btns" style="justify-content:flex-end;">
            <button class="action-icon-btn primary view-profile-btn" data-id="${c.id}" title="View 360° Profile">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="action-icon-btn send-email-btn" data-id="${c.id}" title="Send Email Message">
              <i class="fa-solid fa-envelope"></i>
            </button>
            <button class="action-icon-btn delete-cust-btn" data-id="${c.id}" title="Delete Customer">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
  updateBulkBar();
}

/* ─── Event Handlers for Rows ────────────────────────────── */
function attachRowListeners() {
  customersTableBody.querySelectorAll('.cust-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.checked) selectedCustomerIds.add(id);
      else selectedCustomerIds.delete(id);
      updateBulkBar();
    });
  });

  customersTableBody.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      openCustomerProfileModal(id);
    });
  });

  customersTableBody.querySelectorAll('.send-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      const c = customersData.find(item => item.id === id);
      if (c) showToast(`Opening email composer for ${c.name} (${c.email})...`, 'info');
    });
  });

  customersTableBody.querySelectorAll('.delete-cust-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      deleteCustomer(id);
    });
  });
}

function deleteCustomer(id) {
  const c = customersData.find(item => item.id === id);
  if (!c) return;
  if (confirm(`Are you sure you want to remove customer "${c.name}"?`)) {
    const idx = customersData.findIndex(item => item.id === id);
    if (idx !== -1) customersData.splice(idx, 1);
    selectedCustomerIds.delete(id);
    renderCustomersTable();
  }
}

/* ─── Checkbox & Bulk Actions ────────────────────────────── */
function updateBulkBar() {
  const visibleList = getFilteredCustomers();
  const visibleIds = visibleList.map(c => c.id);
  const count = selectedCustomerIds.size;

  if (selectAllCustomers) {
    selectAllCustomers.checked = visibleIds.length > 0 && visibleIds.every(id => selectedCustomerIds.has(id));
  }

  if (count > 0) {
    bulkCountBadge.textContent = `${count} customer${count > 1 ? 's' : ''} selected`;
    bulkActionsBar.classList.add('show');
  } else {
    bulkActionsBar.classList.remove('show');
  }
}

selectAllCustomers?.addEventListener('change', (e) => {
  const visibleList = getFilteredCustomers();
  if (e.target.checked) {
    visibleList.forEach(c => selectedCustomerIds.add(c.id));
  } else {
    visibleList.forEach(c => selectedCustomerIds.delete(c.id));
  }
  renderCustomersTable();
});

deselectAllBtn?.addEventListener('click', () => {
  selectedCustomerIds.clear();
  renderCustomersTable();
});

document.getElementById('bulkTierBtn')?.addEventListener('click', () => {
  const count = selectedCustomerIds.size;
  customersData.forEach(c => {
    if (selectedCustomerIds.has(c.id)) {
      c.tier = 'vip';
      c.tierLabel = 'VIP Elite';
    }
  });
  selectedCustomerIds.clear();
  renderCustomersTable();
  showToast(`Upgraded ${count} customer(s) to VIP tier!`, 'success');
});

document.getElementById('bulkEmailBtn')?.addEventListener('click', () => {
  showToast(`Preparing bulk broadcast email to ${selectedCustomerIds.size} customer(s)...`, 'info');
});

document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
  if (confirm(`Are you sure you want to delete ${selectedCustomerIds.size} customer(s)?`)) {
    const remaining = customersData.filter(c => !selectedCustomerIds.has(c.id));
    customersData.length = 0;
    remaining.forEach(c => customersData.push(c));
    selectedCustomerIds.clear();
    renderCustomersTable();
  }
});

/* ─── Segment Tabs & Filters ─────────────────────────────── */
document.querySelectorAll('.order-tab-btn[data-segment]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.order-tab-btn[data-segment]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSegmentTab = btn.dataset.segment;
    renderCustomersTable();
  });
});

searchCustomersInput?.addEventListener('input', (e) => {
  currentSearchQuery = e.target.value.trim();
  renderCustomersTable();
});

statusFilterSelect?.addEventListener('change', (e) => {
  currentStatusFilter = e.target.value;
  renderCustomersTable();
});

sortCustomersSelect?.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderCustomersTable();
});

/* ─── Customer Details Modal / Drawer ────────────────────── */
function openCustomerProfileModal(id) {
  const c = customersData.find(item => item.id === id);
  if (!c) return;

  // Hero section
  const heroAvatar = document.getElementById('profileHeroAvatar');
  if (heroAvatar) {
    heroAvatar.src = c.avatar;
    heroAvatar.onerror = function() {
      this.onerror = null;
      this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7c6ff7&color=fff&rounded=true`;
    };
  }
  document.getElementById('profileHeroName').innerHTML = `${c.name} ${tierBadge(c.tier, c.tierLabel)}`;
  document.getElementById('profileHeroRole').textContent = `${c.role} at ${c.company}`;
  document.getElementById('profileOnlineDot').style.display = c.online ? '' : 'none';

  // Stats row
  document.getElementById('profileSpent').textContent = `$${c.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  document.getElementById('profileOrders').textContent = `${c.totalOrders} orders`;
  const aov = c.totalOrders > 0 ? (c.totalSpent / c.totalOrders) : 0;
  document.getElementById('profileAov').textContent = `$${aov.toFixed(2)}`;
  document.getElementById('profileMemberSince').textContent = c.memberSince;

  // Contact details
  document.getElementById('profileEmail').textContent = c.email;
  document.getElementById('profilePhone').textContent = c.phone;
  document.getElementById('profileCity').textContent = `${c.flag} ${c.city}, ${c.country}`;
  document.getElementById('profileTimezone').textContent = c.timezone;

  // Recent Orders table
  const ordersTbody = document.getElementById('profileOrdersTbody');
  if (c.orders && c.orders.length > 0) {
    ordersTbody.innerHTML = c.orders.map(o => `
      <tr>
        <td><span class="order-id">${o.id}</span></td>
        <td>${o.date}</td>
        <td><strong>$${o.total.toFixed(2)}</strong></td>
        <td>${statusBadge(o.status)}</td>
      </tr>
    `).join('');
  } else {
    ordersTbody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted); text-align:center;">No recent orders recorded.</td></tr>`;
  }

  // Activity feed
  const actList = document.getElementById('profileActivityList');
  if (c.activities && c.activities.length > 0) {
    actList.innerHTML = c.activities.map(a => `
      <div class="cust-activity-item">
        <div class="cust-act-icon"><i class="fa-solid ${a.icon}"></i></div>
        <div class="cust-act-text">${a.text}</div>
        <div class="cust-act-time">${a.time}</div>
      </div>
    `).join('');
  } else {
    actList.innerHTML = `<p style="color:var(--text-muted); font-size:12px;">No activity logged yet.</p>`;
  }

  // Hook Send Email button
  modalSendEmailBtn.onclick = () => {
    showToast(`Opening email composer for ${c.email}...`, 'info');
  };

  customerProfileModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCustomerProfileModal() {
  customerProfileModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

modalCloseProfileBtn?.addEventListener('click', closeCustomerProfileModal);
modalCloseProfileFooterBtn?.addEventListener('click', closeCustomerProfileModal);

customerProfileModalBackdrop?.addEventListener('click', (e) => {
  if (e.target === customerProfileModalBackdrop) closeCustomerProfileModal();
});

/* ─── Add Customer Modal ─────────────────────────────────── */
function openAddCustomerModal() {
  addCustomerForm.reset();
  addCustomerModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAddCustomerModal() {
  addCustomerModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

openAddCustomerBtn?.addEventListener('click', openAddCustomerModal);
modalCloseAddBtn?.addEventListener('click', closeAddCustomerModal);
cancelCustomerBtn?.addEventListener('click', closeAddCustomerModal);

addCustomerModalBackdrop?.addEventListener('click', (e) => {
  if (e.target === addCustomerModalBackdrop) closeAddCustomerModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCustomerProfileModal();
    closeAddCustomerModal();
    closeAllPopovers();
  }
});

// Add Customer Form Submit
addCustomerForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('custNameInput').value.trim();
  const email = document.getElementById('custEmailInput').value.trim();
  const phone = document.getElementById('custPhoneInput').value.trim() || '+1 (555) 000-0000';
  const company = document.getElementById('custCompanyInput').value.trim() || 'Freelance / Self';
  const role = document.getElementById('custRoleInput').value.trim() || 'Member';
  const tier = document.getElementById('custTierSelect').value;
  const country = document.getElementById('custCountryInput').value.trim() || 'United States';
  const status = document.getElementById('custStatusSelect').value;

  const tierLabels = {
    vip: 'VIP Elite',
    enterprise: 'Enterprise',
    pro: 'Pro Member',
    trial: 'Free Trial'
  };

  const newCust = {
    id: Date.now(),
    name,
    email,
    phone,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c6ff7&color=fff&rounded=true`,
    company,
    role,
    country,
    flag: '🌐',
    city: 'Location Unspecified',
    timezone: 'UTC',
    totalOrders: 0,
    totalSpent: 0.00,
    tier,
    tierLabel: tierLabels[tier] || 'Member',
    status,
    online: true,
    memberSince: 'Just now',
    orders: [],
    activities: [
      { icon: 'fa-user-plus', text: 'Customer account created manually.', time: 'Just now' }
    ]
  };

  customersData.unshift(newCust);
  closeAddCustomerModal();
  renderCustomersTable();
  showToast(`Customer "${name}" created successfully!`, 'success');
});

/* ─── Sidebar Toggle ─────────────────────────────────────── */
sidebarToggle?.addEventListener('click', () => {
  if (window.innerWidth > 900) {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
  } else {
    document.body.classList.remove('sidebar-open');
  }
});

mobileMenuBtn?.addEventListener('click', () => {
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

themeToggle?.addEventListener('click', () => {
  if (document.body.classList.contains('light-mode')) {
    document.documentElement.classList.remove('light-mode');
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    applyLightMode();
    localStorage.setItem('theme', 'light');
  }
});

function applyLightMode() {
  document.documentElement.classList.add('light-mode');
  document.body.classList.add('light-mode');
  if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
}

/* ─── Window Resize Handler ──────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    document.body.classList.remove('sidebar-open');
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
  } else {
    document.body.classList.remove('sidebar-collapsed');
  }
});

/* ─── Notification Popover ───────────────────────────────── */
const notifications = [
  { id: 1, icon: 'fa-user-plus', color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)', title: 'New Customer Signup', text: 'Sophie Turner registered as VIP customer.', time: '5 mins ago', unread: true },
  { id: 2, icon: 'fa-arrow-up-right-dots', color: '#34d399', bg: 'rgba(52,211,153,0.15)', title: 'High LTV Milestone', text: 'James Wilson reached $6,890 lifetime spend.', time: '2 hrs ago', unread: true },
  { id: 3, icon: 'fa-triangle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)', title: 'Churn Risk Warning', text: 'Mei Lin cancelled their team subscription.', time: '1 day ago', unread: false },
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

markAllBtn?.addEventListener('click', () => {
  notifications.forEach(n => n.unread = false);
  renderNotifications();
});

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

notifBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = notifPopover.classList.contains('open');
  closeAllPopovers();
  if (!isOpen) {
    renderNotifications();
    openPopover(notifPopover, notifBtn);
  }
});

profileBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = profileDropdown.classList.contains('open');
  closeAllPopovers();
  if (!isOpen) openPopover(profileDropdown, profileBtn);
});

popoverBackdrop?.addEventListener('click', closeAllPopovers);

document.getElementById('pdLogout')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAllPopovers();
  if (confirm('Are you sure you want to sign out?')) {
    window.location.href = 'login.html';
  }
});

document.getElementById('exportAllCustomersBtn')?.addEventListener('click', () => {
  showToast('Exporting customer directory (18,740 contacts) to CSV...', 'info');
});

// Initial Render
renderCustomersTable();
renderNotifications();

console.log('%c NexusPanel Customers v1.0.0 ready 👥', 'color:#7c6ff7;font-weight:700;font-size:14px;');
