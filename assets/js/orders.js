/**
 * NexusPanel Admin Dashboard – Orders JavaScript
 * ─────────────────────────────────────────────
 * Features:
 *  - Dynamic orders rendering with status and payment badges
 *  - Real-time search filtering (Order ID, Customer, Email, Product)
 *  - Status tab switching (All, Completed, Processing, Pending, Cancelled)
 *  - Payment status filter dropdown
 *  - Row selection & floating bulk actions bar
 *  - Interactive Order Details modal with fulfillment timeline
 *  - Theme toggle (Dark/Light mode sync)
 *  - Responsive sidebar toggle & mobile drawer
 *  - Pagination interaction
 */

'use strict';

/* ─── Mock Orders Data ───────────────────────────────────── */
const ordersData = [
  {
    id: '#ORD-0192',
    customer: { name: 'Sophie Turner', email: 'sophie.t@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 19, 2026 14:24',
    productSummary: 'NexusPanel Pro Plan + 2 Add-ons',
    items: [
      { name: 'NexusPanel Pro Annual License', qty: 1, price: 199.00 },
      { name: 'Priority 24/7 VIP Support', qty: 1, price: 50.00 },
      { name: 'Extra Cloud Storage (500GB)', qty: 1, price: 50.00 },
    ],
    payment: { method: 'Visa ending in 4242', icon: 'fa-brands fa-cc-visa', class: 'card', status: 'paid' },
    subtotal: 299.00,
    tax: 0.00,
    discount: 0.00,
    total: 299.00,
    fulfillment: 'completed',
    timelineStep: 5, // 1: Placed, 2: Paid, 3: Processing, 4: Shipped, 5: Delivered
    shipping: { address: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477', country: 'United States' }
  },
  {
    id: '#ORD-0191',
    customer: { name: 'James Wilson', email: 'james.w@acme.corp', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 19, 2026 11:05',
    productSummary: 'NexusPanel Enterprise Tier',
    items: [
      { name: 'Enterprise Cluster License (10 Seats)', qty: 1, price: 799.00 },
      { name: 'Custom Domain Setup & Migration', qty: 1, price: 100.00 },
    ],
    payment: { method: 'Mastercard ending in 8819', icon: 'fa-brands fa-cc-mastercard', class: 'card', status: 'paid' },
    subtotal: 899.00,
    tax: 0.00,
    discount: 0.00,
    total: 899.00,
    fulfillment: 'processing',
    timelineStep: 3,
    shipping: { address: '120 Market Street, Suite 400', city: 'San Francisco', state: 'CA', zip: '94105', country: 'United States' }
  },
  {
    id: '#ORD-0190',
    customer: { name: 'Anya Roberts', email: 'anya.r@designhub.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 18, 2026 19:40',
    productSummary: 'UI Starter Kit Bundle',
    items: [
      { name: 'Figma UI Kit & HTML Templates', qty: 1, price: 49.00 }
    ],
    payment: { method: 'PayPal (anya.r@designhub.io)', icon: 'fa-brands fa-paypal', class: 'paypal', status: 'pending' },
    subtotal: 49.00,
    tax: 0.00,
    discount: 0.00,
    total: 49.00,
    fulfillment: 'pending',
    timelineStep: 1,
    shipping: { address: '18 Victoria Road', city: 'London', state: 'Greater London', zip: 'SW1A 1AA', country: 'United Kingdom' }
  },
  {
    id: '#ORD-0189',
    customer: { name: 'Carlos Mendez', email: 'carlos.m@techops.net', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 18, 2026 15:12',
    productSummary: 'Pro Plan (Monthly Renewal)',
    items: [
      { name: 'Pro Monthly License', qty: 1, price: 29.00 },
      { name: 'Advanced Audit Logs Module', qty: 1, price: 270.00 }
    ],
    payment: { method: 'Apple Pay (Card 1192)', icon: 'fa-brands fa-apple-pay', class: 'apple', status: 'paid' },
    subtotal: 299.00,
    tax: 0.00,
    discount: 0.00,
    total: 299.00,
    fulfillment: 'completed',
    timelineStep: 5,
    shipping: { address: 'Calle Gran Vía 42', city: 'Madrid', state: 'Madrid', zip: '28013', country: 'Spain' }
  },
  {
    id: '#ORD-0188',
    customer: { name: 'Mei Lin', email: 'mei.lin@zenith.ai', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 17, 2026 21:30',
    productSummary: 'Team Bundle (5 Licenses)',
    items: [
      { name: 'Team Productivity Suite', qty: 1, price: 499.00 }
    ],
    payment: { method: 'Visa ending in 9031', icon: 'fa-brands fa-cc-visa', class: 'card', status: 'refunded' },
    subtotal: 499.00,
    tax: 0.00,
    discount: 0.00,
    total: 499.00,
    fulfillment: 'cancelled',
    timelineStep: 1,
    shipping: { address: '88 Orchard Road', city: 'Singapore', state: 'Central', zip: '238839', country: 'Singapore' }
  },
  {
    id: '#ORD-0187',
    customer: { name: 'David Park', email: 'd.park@nexuscorp.kr', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 17, 2026 16:50',
    productSummary: 'Enterprise Dedicated Server',
    items: [
      { name: 'Dedicated Cloud Instance (Annual)', qty: 1, price: 899.00 }
    ],
    payment: { method: 'Mastercard ending in 3120', icon: 'fa-brands fa-cc-mastercard', class: 'card', status: 'paid' },
    subtotal: 899.00,
    tax: 0.00,
    discount: 0.00,
    total: 899.00,
    fulfillment: 'completed',
    timelineStep: 5,
    shipping: { address: 'Teheran-ro 152', city: 'Seoul', state: 'Gangnam-gu', zip: '06236', country: 'South Korea' }
  },
  {
    id: '#ORD-0186',
    customer: { name: 'Elena Rostova', email: 'elena.rostova@cloudscale.de', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 16, 2026 10:15',
    productSummary: 'Pro Plan + Security Add-on',
    items: [
      { name: 'Pro Plan License', qty: 1, price: 199.00 },
      { name: 'SOC2 Compliance Suite', qty: 1, price: 150.00 }
    ],
    payment: { method: 'Visa ending in 6604', icon: 'fa-brands fa-cc-visa', class: 'card', status: 'paid' },
    subtotal: 349.00,
    tax: 0.00,
    discount: 0.00,
    total: 349.00,
    fulfillment: 'processing',
    timelineStep: 3,
    shipping: { address: 'Friedrichstraße 43', city: 'Berlin', state: 'Berlin', zip: '10117', country: 'Germany' }
  },
  {
    id: '#ORD-0185',
    customer: { name: 'Liam O\'Connor', email: 'liam@dublinfintech.ie', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80' },
    date: 'Sep 16, 2026 08:45',
    productSummary: 'Starter Kit + Branding Pack',
    items: [
      { name: 'Starter Kit License', qty: 1, price: 49.00 },
      { name: 'White-label Branding Removal', qty: 1, price: 80.00 }
    ],
    payment: { method: 'PayPal (liam@dublinfintech.ie)', icon: 'fa-brands fa-paypal', class: 'paypal', status: 'pending' },
    subtotal: 129.00,
    tax: 0.00,
    discount: 0.00,
    total: 129.00,
    fulfillment: 'pending',
    timelineStep: 2,
    shipping: { address: '22 Grafton Street', city: 'Dublin', state: 'Leinster', zip: 'D02 Y620', country: 'Ireland' }
  }
];

/* ─── State ──────────────────────────────────────────────── */
let currentTabFilter = 'all';
let currentSearchQuery = '';
let currentPaymentFilter = 'all';
let selectedOrderIds = new Set();

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

const ordersTableBody = document.getElementById('ordersTableBody');
const selectAllOrders = document.getElementById('selectAllOrders');
const searchOrdersInput = document.getElementById('searchOrdersInput');
const paymentFilterSelect = document.getElementById('paymentFilterSelect');
const bulkActionsBar  = document.getElementById('bulkActionsBar');
const bulkCountBadge  = document.getElementById('bulkCountBadge');
const deselectAllBtn  = document.getElementById('deselectAllBtn');

// Modal Elements
const orderModalBackdrop = document.getElementById('orderModalBackdrop');
const modalOrderId       = document.getElementById('modalOrderId');
const modalFulfillmentBadge = document.getElementById('modalFulfillmentBadge');
const modalCloseBtn      = document.getElementById('modalCloseBtn');
const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
const modalCustName      = document.getElementById('modalCustName');
const modalOrderDate     = document.getElementById('modalOrderDate');
const modalPaymentStatus = document.getElementById('modalPaymentStatus');
const modalOrderTotal    = document.getElementById('modalOrderTotal');
const modalTimelineTrack = document.getElementById('modalTimelineTrack');
const modalItemsTbody    = document.getElementById('modalItemsTbody');
const modalSubtotal      = document.getElementById('modalSubtotal');
const modalGrandTotal    = document.getElementById('modalGrandTotal');

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
function fulfillmentBadge(status) {
  const map = {
    completed:  { label: '✓ Completed',  cls: 'status-completed' },
    processing: { label: '⟳ Processing', cls: 'status-processing' },
    pending:    { label: '⏱ Pending',    cls: 'status-pending' },
    cancelled:  { label: '✕ Cancelled',  cls: 'status-cancelled' }
  };
  const item = map[status] || map.completed;
  return `<span class="status-badge ${item.cls}">${item.label}</span>`;
}

function paymentBadge(pay) {
  const statusMap = {
    paid:     { label: 'Paid',     cls: 'pay-paid' },
    pending:  { label: 'Pending',  cls: 'pay-pending' },
    refunded: { label: 'Refunded', cls: 'pay-refunded' }
  };
  const s = statusMap[pay.status] || statusMap.paid;
  return `
    <div style="display:flex; flex-direction:column; gap:3px;">
      <span class="payment-badge ${pay.class}">
        <i class="${pay.icon}"></i> ${pay.method}
      </span>
      <span class="pay-status ${s.cls}">${s.label}</span>
    </div>
  `;
}

/* ─── Filter & Render ────────────────────────────────────── */
function getFilteredOrders() {
  return ordersData.filter(order => {
    // Tab filter
    if (currentTabFilter !== 'all' && order.fulfillment !== currentTabFilter) {
      return false;
    }
    // Payment filter
    if (currentPaymentFilter !== 'all' && order.payment.status !== currentPaymentFilter) {
      return false;
    }
    // Search query
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCust = order.customer.name.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchProd = order.productSummary.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchEmail && !matchProd) return false;
    }
    return true;
  });
}

function renderOrdersTable() {
  const list = getFilteredOrders();
  if (list.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 32px; margin-bottom: 10px; display:block;"></i>
          No orders match your filter criteria.
        </td>
      </tr>
    `;
    updateBulkBar();
    return;
  }

  ordersTableBody.innerHTML = list.map(o => {
    const isChecked = selectedOrderIds.has(o.id) ? 'checked' : '';
    return `
      <tr data-order-id="${o.id}">
        <td>
          <input type="checkbox" class="order-check row-checkbox" data-id="${o.id}" ${isChecked} />
        </td>
        <td>
          <a href="#" class="order-id view-order-btn" data-id="${o.id}">${o.id}</a>
        </td>
        <td>
          <div class="cust-cell">
            <img src="${o.customer.avatar}" alt="${o.customer.name}" class="cust-avatar-sm" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(o.customer.name)}&background=7c6ff7&color=fff&rounded=true';" />
            <div class="cust-meta">
              <span class="cust-meta-name">${o.customer.name}</span>
              <span class="cust-meta-email">${o.customer.email}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size:12.5px; color:var(--text-secondary);">${o.date}</span>
        </td>
        <td>
          <span style="font-size:13px; font-weight:500;">${o.productSummary}</span>
        </td>
        <td>
          ${paymentBadge(o.payment)}
        </td>
        <td>
          <strong style="color:var(--text-primary); font-size:14px;">$${o.total.toFixed(2)}</strong>
        </td>
        <td>
          ${fulfillmentBadge(o.fulfillment)}
        </td>
        <td>
          <div class="action-btns">
            <button class="action-icon-btn primary view-order-btn" data-id="${o.id}" title="View Order Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="action-icon-btn invoice-btn" data-id="${o.id}" title="Download Invoice">
              <i class="fa-solid fa-file-invoice-dollar"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
  updateBulkBar();
}

/* ─── Checkbox & Bulk Actions ────────────────────────────── */
function attachRowListeners() {
  // Individual checkboxes
  ordersTableBody.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) selectedOrderIds.add(id);
      else selectedOrderIds.delete(id);
      updateBulkBar();
    });
  });

  // View Details click (link and button)
  ordersTableBody.querySelectorAll('.view-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      openOrderModal(id);
    });
  });

  // Invoice click
  ordersTableBody.querySelectorAll('.invoice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      showToast(`Generating and downloading invoice for order ${id}...`, 'info');
    });
  });
}

function updateBulkBar() {
  const visibleList = getFilteredOrders();
  const visibleIds = visibleList.map(o => o.id);
  const count = selectedOrderIds.size;

  if (selectAllOrders) {
    selectAllOrders.checked = visibleIds.length > 0 && visibleIds.every(id => selectedOrderIds.has(id));
  }

  if (count > 0) {
    bulkCountBadge.textContent = `${count} order${count > 1 ? 's' : ''} selected`;
    bulkActionsBar.classList.add('show');
  } else {
    bulkActionsBar.classList.remove('show');
  }
}

// Select all checkbox
selectAllOrders?.addEventListener('change', (e) => {
  const visibleList = getFilteredOrders();
  if (e.target.checked) {
    visibleList.forEach(o => selectedOrderIds.add(o.id));
  } else {
    visibleList.forEach(o => selectedOrderIds.delete(o.id));
  }
  renderOrdersTable();
});

// Deselect all
deselectAllBtn?.addEventListener('click', () => {
  selectedOrderIds.clear();
  renderOrdersTable();
});

// Bulk action buttons
document.getElementById('bulkCompleteBtn')?.addEventListener('click', () => {
  const count = selectedOrderIds.size;
  ordersData.forEach(o => {
    if (selectedOrderIds.has(o.id)) o.fulfillment = 'completed';
  });
  selectedOrderIds.clear();
  renderOrdersTable();
  showToast(`Marked ${count} order(s) as completed!`, 'success');
});

document.getElementById('bulkExportBtn')?.addEventListener('click', () => {
  showToast(`Exporting CSV for ${selectedOrderIds.size} selected order(s)...`, 'info');
});

document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
  if (confirm(`Are you sure you want to delete ${selectedOrderIds.size} order(s)?`)) {
    const remaining = ordersData.filter(o => !selectedOrderIds.has(o.id));
    ordersData.length = 0;
    remaining.forEach(o => ordersData.push(o));
    selectedOrderIds.clear();
    renderOrdersTable();
  }
});

/* ─── Tabs & Filters ─────────────────────────────────────── */
document.querySelectorAll('.order-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTabFilter = btn.dataset.tab;
    renderOrdersTable();
  });
});

searchOrdersInput?.addEventListener('input', (e) => {
  currentSearchQuery = e.target.value.trim();
  renderOrdersTable();
});

paymentFilterSelect?.addEventListener('change', (e) => {
  currentPaymentFilter = e.target.value;
  renderOrdersTable();
});

/* ─── Order Details Modal ────────────────────────────────── */
function openOrderModal(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;

  modalOrderId.textContent = order.id;
  modalFulfillmentBadge.innerHTML = fulfillmentBadge(order.fulfillment);
  modalCustName.innerHTML = `
    <span style="display:inline-flex; align-items:center; gap:8px;">
      <img src="${order.customer.avatar}" alt="${order.customer.name}" class="cust-avatar-sm" style="width:24px; height:24px; min-width:24px; min-height:24px;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer.name)}&background=7c6ff7&color=fff&rounded=true';" />
      <span>${order.customer.name}</span>
    </span>
  `;
  modalOrderDate.textContent = order.date;
  modalPaymentStatus.innerHTML = `<span class="pay-status ${order.payment.status === 'paid' ? 'pay-paid' : order.payment.status === 'pending' ? 'pay-pending' : 'pay-refunded'}">${order.payment.status.toUpperCase()}</span>`;
  modalOrderTotal.textContent = `$${order.total.toFixed(2)}`;

  // Update Timeline steps
  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4'),
    document.getElementById('step5')
  ];

  steps.forEach((stepEl, idx) => {
    if (!stepEl) return;
    const stepNum = idx + 1;
    stepEl.classList.remove('completed', 'active');
    if (stepNum < order.timelineStep) {
      stepEl.classList.add('completed');
    } else if (stepNum === order.timelineStep) {
      stepEl.classList.add('active');
    }
  });

  // Timeline fill track width
  const fillPercents = [0, 0, 25, 50, 75, 100];
  if (modalTimelineTrack) {
    modalTimelineTrack.style.width = `${fillPercents[order.timelineStep] || 0}%`;
  }

  // Populate Items Table
  modalItemsTbody.innerHTML = order.items.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.qty}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><strong>$${(item.qty * item.price).toFixed(2)}</strong></td>
    </tr>
  `).join('');

  modalSubtotal.textContent = `$${order.subtotal.toFixed(2)}`;
  modalGrandTotal.textContent = `$${order.total.toFixed(2)}`;

  orderModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

modalCloseBtn?.addEventListener('click', closeOrderModal);
modalCloseFooterBtn?.addEventListener('click', closeOrderModal);

orderModalBackdrop?.addEventListener('click', (e) => {
  if (e.target === orderModalBackdrop) closeOrderModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOrderModal();
    closeAllPopovers();
  }
});

document.getElementById('printInvoiceModalBtn')?.addEventListener('click', () => {
  window.print();
});

document.getElementById('resendReceiptBtn')?.addEventListener('click', () => {
  showToast('Receipt has been resent to customer email!', 'success');
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
  { id: 1, icon: 'fa-bag-shopping', color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)', title: 'New Order Placed', text: 'Sophie Turner placed order #ORD-0192.', time: '14 mins ago', unread: true },
  { id: 2, icon: 'fa-circle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)', title: 'Order Cancelled', text: '#ORD-0188 was cancelled by customer.', time: '38 mins ago', unread: true },
  { id: 3, icon: 'fa-credit-card', color: '#34d399', bg: 'rgba(52,211,153,0.15)', title: 'Payment Received', text: '$899 received from James Wilson.', time: '2 hrs ago', unread: false },
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

// Top bar action buttons
document.getElementById('exportAllOrdersBtn')?.addEventListener('click', () => {
  showToast('Exporting all 3,248 orders to CSV format...', 'info');
});

document.getElementById('newOrderBtn')?.addEventListener('click', () => {
  showToast('Create Order wizard opening...', 'info');
});

// Initial Page Load
renderOrdersTable();
renderNotifications();

console.log('%c NexusPanel Orders v1.0.0 ready 📦', 'color:#7c6ff7;font-weight:700;font-size:14px;');
