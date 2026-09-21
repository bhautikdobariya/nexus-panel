/**
 * NexusPanel Admin Dashboard – Products & Inventory JavaScript
 * ────────────────────────────────────────────────────────────
 * Features:
 *  - Grid View & Table View switcher
 *  - Dynamic product catalog rendering with stock health meters
 *  - Multi-criteria filtering (Category tabs, search query, stock status, sorting)
 *  - Add New Product modal with validation and live catalog update
 *  - Multi-select checkbox and floating bulk actions bar
 *  - Dark / Light mode sync
 *  - Mobile sidebar drawer and responsive resize handling
 */

'use strict';

/* ─── Mock Products Dataset ──────────────────────────────── */
const productsData = [
  {
    id: 1,
    title: 'NexusPanel Pro SaaS License',
    sku: 'SKU-NX-8821',
    category: 'saas',
    categoryLabel: 'SaaS & Software',
    price: 199.00,
    comparePrice: 249.00,
    stock: 142,
    maxStock: 200,
    sales: 1240,
    rating: 4.9,
    reviews: 148,
    status: 'in-stock',
    icon: 'fa-solid fa-cloud-bolt',
    bg: 'linear-gradient(135deg, rgba(124,111,247,0.15), rgba(192,132,252,0.1))'
  },
  {
    id: 2,
    title: 'Enterprise Server Node Cluster',
    sku: 'SKU-NX-9042',
    category: 'hardware',
    categoryLabel: 'Hardware & IoT',
    price: 899.00,
    comparePrice: 999.00,
    stock: 14,
    maxStock: 50,
    sales: 320,
    rating: 4.8,
    reviews: 64,
    status: 'low-stock',
    icon: 'fa-solid fa-server',
    bg: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(56,189,248,0.1))'
  },
  {
    id: 3,
    title: 'Ultimate UI Dashboard Kit & Templates',
    sku: 'SKU-NX-3310',
    category: 'templates',
    categoryLabel: 'Templates & Themes',
    price: 49.00,
    comparePrice: 79.00,
    stock: 320,
    maxStock: 500,
    sales: 2480,
    rating: 5.0,
    reviews: 312,
    status: 'in-stock',
    icon: 'fa-solid fa-layer-group',
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.1))'
  },
  {
    id: 4,
    title: 'Security Hardware FIDO2 YubiKey',
    sku: 'SKU-NX-5519',
    category: 'hardware',
    categoryLabel: 'Hardware & IoT',
    price: 65.00,
    comparePrice: 75.00,
    stock: 0,
    maxStock: 100,
    sales: 850,
    rating: 4.7,
    reviews: 92,
    status: 'out-of-stock',
    icon: 'fa-solid fa-key',
    bg: 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(239,68,68,0.1))'
  },
  {
    id: 5,
    title: 'Vector 3D Illustrations & Icons Asset Pack',
    sku: 'SKU-NX-1240',
    category: 'digital',
    categoryLabel: 'Digital Assets',
    price: 39.00,
    comparePrice: 59.00,
    stock: 210,
    maxStock: 300,
    sales: 1690,
    rating: 4.9,
    reviews: 184,
    status: 'in-stock',
    icon: 'fa-solid fa-shapes',
    bg: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(245,158,11,0.1))'
  },
  {
    id: 6,
    title: 'NexusPanel Analytics AI Module',
    sku: 'SKU-NX-7704',
    category: 'saas',
    categoryLabel: 'SaaS & Software',
    price: 149.00,
    comparePrice: 199.00,
    stock: 18,
    maxStock: 100,
    sales: 610,
    rating: 4.8,
    reviews: 79,
    status: 'low-stock',
    icon: 'fa-solid fa-brain',
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,111,247,0.1))'
  },
  {
    id: 7,
    title: 'React Native Mobile App Boilerplate',
    sku: 'SKU-NX-4109',
    category: 'templates',
    categoryLabel: 'Templates & Themes',
    price: 89.00,
    comparePrice: 129.00,
    stock: 94,
    maxStock: 150,
    sales: 980,
    rating: 4.9,
    reviews: 115,
    status: 'in-stock',
    icon: 'fa-solid fa-mobile-screen',
    bg: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(79,142,247,0.1))'
  },
  {
    id: 8,
    title: 'Smart Office IoT Sensor Gateway',
    sku: 'SKU-NX-9981',
    category: 'hardware',
    categoryLabel: 'Hardware & IoT',
    price: 249.00,
    comparePrice: 299.00,
    stock: 8,
    maxStock: 40,
    sales: 190,
    rating: 4.6,
    reviews: 38,
    status: 'low-stock',
    icon: 'fa-solid fa-microchip',
    bg: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(248,113,113,0.1))'
  }
];

/* ─── State ──────────────────────────────────────────────── */
let currentViewMode = 'grid'; // 'grid' | 'table'
let currentCategory = 'all';
let currentSearchQuery = '';
let currentStockFilter = 'all';
let currentSort = 'newest';
let selectedProductIds = new Set();

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

const productsGrid    = document.getElementById('productsGrid');
const productsTableContainer = document.getElementById('productsTableContainer');
const productsTableBody = document.getElementById('productsTableBody');
const viewGridBtn     = document.getElementById('viewGridBtn');
const viewTableBtn    = document.getElementById('viewTableBtn');
const searchProductsInput = document.getElementById('searchProductsInput');
const stockFilterSelect = document.getElementById('stockFilterSelect');
const sortSelect      = document.getElementById('sortSelect');
const selectAllProducts = document.getElementById('selectAllProducts');
const bulkActionsBar  = document.getElementById('bulkActionsBar');
const bulkCountBadge  = document.getElementById('bulkCountBadge');
const deselectAllBtn  = document.getElementById('deselectAllBtn');

// Add Product Modal
const productModalBackdrop = document.getElementById('productModalBackdrop');
const openAddProductBtn    = document.getElementById('openAddProductBtn');
const modalCloseBtn        = document.getElementById('modalCloseBtn');
const cancelProductBtn     = document.getElementById('cancelProductBtn');
const addProductForm       = document.getElementById('addProductForm');

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

/* ─── Status Helpers ─────────────────────────────────────── */
function statusBadge(status) {
  if (status === 'in-stock') {
    return '<span class="status-badge status-completed">● In Stock</span>';
  } else if (status === 'low-stock') {
    return '<span class="status-badge status-pending">▲ Low Stock</span>';
  } else {
    return '<span class="status-badge status-cancelled">✕ Out of Stock</span>';
  }
}

function stockMeter(stock, maxStock) {
  const pct = Math.min(100, Math.round((stock / maxStock) * 100));
  let fillCls = 'stock-healthy';
  if (stock === 0) fillCls = 'stock-out';
  else if (stock <= 20) fillCls = 'stock-low';

  return `
    <div class="product-stock-wrap">
      <div class="stock-info">
        <span class="stock-label">Inventory</span>
        <span class="stock-qty ${fillCls}">${stock} in stock</span>
      </div>
      <div class="stock-bar-track">
        <div class="stock-bar-fill ${fillCls}" style="width: ${stock === 0 ? 100 : pct}%"></div>
      </div>
    </div>
  `;
}

/* ─── Filtering & Sorting ────────────────────────────────── */
function getFilteredProducts() {
  let list = productsData.filter(p => {
    // Category tab
    if (currentCategory !== 'all' && p.category !== currentCategory) return false;
    // Stock filter
    if (currentStockFilter !== 'all' && p.status !== currentStockFilter) return false;
    // Search query
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const mTitle = p.title.toLowerCase().includes(q);
      const mSku = p.sku.toLowerCase().includes(q);
      const mCat = p.categoryLabel.toLowerCase().includes(q);
      if (!mTitle && !mSku && !mCat) return false;
    }
    return true;
  });

  // Sorting
  if (currentSort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'best-selling') {
    list.sort((a, b) => b.sales - a.sales);
  } else if (currentSort === 'stock') {
    list.sort((a, b) => b.stock - a.stock);
  } else {
    // newest (by id desc)
    list.sort((a, b) => b.id - a.id);
  }

  return list;
}

/* ─── Render Functions ───────────────────────────────────── */
function renderProducts() {
  const list = getFilteredProducts();

  if (currentViewMode === 'grid') {
    productsGrid.style.display = 'grid';
    productsTableContainer.classList.remove('active');
    renderGrid(list);
  } else {
    productsGrid.style.display = 'none';
    productsTableContainer.classList.add('active');
    renderTable(list);
  }

  updateBulkBar();
}

function renderGrid(list) {
  if (list.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border); color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 38px; margin-bottom: 12px; display:block;"></i>
        <h3 style="font-size: 16px; color: var(--text-primary); margin-bottom: 6px;">No products found</h3>
        <p style="font-size: 13px;">Try adjusting your category filter or search keywords.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image-wrap" style="background:${p.bg}">
        <i class="${p.icon} product-image-icon"></i>
        <span class="product-cat-badge">${p.categoryLabel}</span>
        <div class="product-status-tag">${statusBadge(p.status)}</div>
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <span class="product-sku">${p.sku}</span>
          <h3 class="product-title">${p.title}</h3>
        </div>

        <div class="product-rating">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <span class="rating-val">${p.rating}</span>
          <span class="review-count">(${p.reviews})</span>
        </div>

        ${stockMeter(p.stock, p.maxStock)}
      </div>

      <div class="product-footer">
        <div class="price-box">
          <span class="current-price">$${p.price.toFixed(2)}</span>
          ${p.comparePrice ? `<span class="compare-price">$${p.comparePrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="action-btns">
          <button class="action-icon-btn primary edit-prod-btn" data-id="${p.id}" title="Edit Product">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="action-icon-btn delete-prod-btn" data-id="${p.id}" title="Delete Product">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  attachGridListeners();
}

function renderTable(list) {
  if (list.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 32px; margin-bottom: 10px; display:block;"></i>
          No products match your search or filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  productsTableBody.innerHTML = list.map(p => {
    const isChecked = selectedProductIds.has(p.id) ? 'checked' : '';
    const pct = Math.min(100, Math.round((p.stock / p.maxStock) * 100));
    let fillCls = 'stock-healthy';
    if (p.stock === 0) fillCls = 'stock-out';
    else if (p.stock <= 20) fillCls = 'stock-low';

    return `
      <tr data-id="${p.id}">
        <td>
          <input type="checkbox" class="order-check prod-checkbox" data-id="${p.id}" ${isChecked} />
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:8px; background:${p.bg}; display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:16px; flex-shrink:0;">
              <i class="${p.icon}"></i>
            </div>
            <div>
              <a href="#" class="order-id" style="font-size:13.5px; font-weight:600; color:var(--text-primary);">${p.title}</a>
              <div style="font-size:11px; font-family:monospace; color:var(--text-muted);">${p.sku}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="cat-pill">${p.categoryLabel}</span>
        </td>
        <td>
          <strong style="color:var(--text-primary); font-size:14px;">$${p.price.toFixed(2)}</strong>
          ${p.comparePrice ? `<span style="font-size:11px; color:var(--text-muted); text-decoration:line-through; margin-left:4px;">$${p.comparePrice.toFixed(2)}</span>` : ''}
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px; width:110px;">
            <span style="font-size:12px; font-weight:600;">${p.stock} units</span>
            <div class="stock-bar-track">
              <div class="stock-bar-fill ${fillCls}" style="width:${p.stock === 0 ? 100 : pct}%"></div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size:13px; font-weight:600; color:var(--text-secondary);">${p.sales.toLocaleString()}</span>
        </td>
        <td>
          ${statusBadge(p.status)}
        </td>
        <td>
          <div class="action-btns">
            <button class="action-icon-btn primary edit-prod-btn" data-id="${p.id}" title="Edit Product">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-icon-btn delete-prod-btn" data-id="${p.id}" title="Delete Product">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachTableListeners();
}

/* ─── Row & Card Listeners ───────────────────────────────── */
function attachGridListeners() {
  productsGrid.querySelectorAll('.edit-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      openEditModal(id);
    });
  });

  productsGrid.querySelectorAll('.delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      deleteProduct(id);
    });
  });
}

function attachTableListeners() {
  productsTableBody.querySelectorAll('.prod-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.checked) selectedProductIds.add(id);
      else selectedProductIds.delete(id);
      updateBulkBar();
    });
  });

  productsTableBody.querySelectorAll('.edit-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      openEditModal(id);
    });
  });

  productsTableBody.querySelectorAll('.delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      deleteProduct(id);
    });
  });
}

function deleteProduct(id) {
  const p = productsData.find(item => item.id === id);
  if (!p) return;
  if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
    const idx = productsData.findIndex(item => item.id === id);
    if (idx !== -1) productsData.splice(idx, 1);
    selectedProductIds.delete(id);
    renderProducts();
  }
}

/* ─── Checkbox & Bulk Actions ────────────────────────────── */
function updateBulkBar() {
  const visibleList = getFilteredProducts();
  const visibleIds = visibleList.map(p => p.id);
  const count = selectedProductIds.size;

  if (selectAllProducts) {
    selectAllProducts.checked = visibleIds.length > 0 && visibleIds.every(id => selectedProductIds.has(id));
  }

  if (count > 0) {
    bulkCountBadge.textContent = `${count} product${count > 1 ? 's' : ''} selected`;
    bulkActionsBar.classList.add('show');
  } else {
    bulkActionsBar.classList.remove('show');
  }
}

selectAllProducts?.addEventListener('change', (e) => {
  const visibleList = getFilteredProducts();
  if (e.target.checked) {
    visibleList.forEach(p => selectedProductIds.add(p.id));
  } else {
    visibleList.forEach(p => selectedProductIds.delete(p.id));
  }
  renderProducts();
});

deselectAllBtn?.addEventListener('click', () => {
  selectedProductIds.clear();
  renderProducts();
});

document.getElementById('bulkStatusBtn')?.addEventListener('click', () => {
  const count = selectedProductIds.size;
  productsData.forEach(p => {
    if (selectedProductIds.has(p.id)) p.status = 'in-stock';
  });
  selectedProductIds.clear();
  renderProducts();
  showToast(`Updated status to In Stock for ${count} product(s)!`, 'success');
});

document.getElementById('bulkExportBtn')?.addEventListener('click', () => {
  showToast(`Exporting CSV for ${selectedProductIds.size} selected product(s)...`, 'info');
});

document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
  if (confirm(`Delete ${selectedProductIds.size} selected product(s)?`)) {
    const remaining = productsData.filter(p => !selectedProductIds.has(p.id));
    productsData.length = 0;
    remaining.forEach(p => productsData.push(p));
    selectedProductIds.clear();
    renderProducts();
  }
});

/* ─── View Switcher ──────────────────────────────────────── */
viewGridBtn?.addEventListener('click', () => {
  currentViewMode = 'grid';
  viewGridBtn.classList.add('active');
  viewTableBtn.classList.remove('active');
  renderProducts();
});

viewTableBtn?.addEventListener('click', () => {
  currentViewMode = 'table';
  viewTableBtn.classList.add('active');
  viewGridBtn.classList.remove('active');
  renderProducts();
});

/* ─── Category Tabs & Filter Selectors ───────────────────── */
document.querySelectorAll('.order-tab-btn[data-category]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.order-tab-btn[data-category]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

searchProductsInput?.addEventListener('input', (e) => {
  currentSearchQuery = e.target.value.trim();
  renderProducts();
});

stockFilterSelect?.addEventListener('change', (e) => {
  currentStockFilter = e.target.value;
  renderProducts();
});

sortSelect?.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderProducts();
});

/* ─── Add / Edit Product Modal ───────────────────────────── */
function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add New Product';
  addProductForm.reset();
  document.getElementById('editProductId').value = '';
  productModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openEditModal(id) {
  const p = productsData.find(item => item.id === id);
  if (!p) return;

  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('editProductId').value = p.id;
  document.getElementById('prodNameInput').value = p.title;
  document.getElementById('prodSkuInput').value = p.sku;
  document.getElementById('prodCategorySelect').value = p.category;
  document.getElementById('prodPriceInput').value = p.price;
  document.getElementById('prodCompareInput').value = p.comparePrice || '';
  document.getElementById('prodStockInput').value = p.stock;
  document.getElementById('prodStatusSelect').value = p.status;

  productModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  productModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

openAddProductBtn?.addEventListener('click', openAddModal);
modalCloseBtn?.addEventListener('click', closeProductModal);
cancelProductBtn?.addEventListener('click', closeProductModal);

productModalBackdrop?.addEventListener('click', (e) => {
  if (e.target === productModalBackdrop) closeProductModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeAllPopovers();
  }
});

// Add / Edit Form Submission
addProductForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodNameInput').value.trim();
  const sku = document.getElementById('prodSkuInput').value.trim() || 'SKU-NX-' + Math.floor(1000 + Math.random() * 9000);
  const cat = document.getElementById('prodCategorySelect').value;
  const price = parseFloat(document.getElementById('prodPriceInput').value) || 0;
  const comp = parseFloat(document.getElementById('prodCompareInput').value) || 0;
  const stock = parseInt(document.getElementById('prodStockInput').value, 10) || 0;
  const status = document.getElementById('prodStatusSelect').value;

  const catLabels = {
    saas: 'SaaS & Software',
    templates: 'Templates & Themes',
    digital: 'Digital Assets',
    hardware: 'Hardware & IoT'
  };

  const icons = {
    saas: 'fa-solid fa-cloud-bolt',
    templates: 'fa-solid fa-layer-group',
    digital: 'fa-solid fa-shapes',
    hardware: 'fa-solid fa-server'
  };

  if (editId) {
    // Edit existing
    const item = productsData.find(p => p.id === parseInt(editId));
    if (item) {
      item.title = name;
      item.sku = sku;
      item.category = cat;
      item.categoryLabel = catLabels[cat] || 'Product';
      item.price = price;
      item.comparePrice = comp;
      item.stock = stock;
      item.status = status;
    }
  } else {
    // Add new
    const newProd = {
      id: Date.now(),
      title: name,
      sku: sku,
      category: cat,
      categoryLabel: catLabels[cat] || 'Product',
      price: price,
      comparePrice: comp,
      stock: stock,
      maxStock: Math.max(stock, 100),
      sales: 0,
      rating: 5.0,
      reviews: 0,
      status: status,
      icon: icons[cat] || 'fa-solid fa-box',
      bg: 'linear-gradient(135deg, rgba(124,111,247,0.15), rgba(192,132,252,0.1))'
    };
    productsData.unshift(newProd);
  }

  closeProductModal();
  renderProducts();
  showToast(editId ? 'Product updated successfully!' : 'New product added successfully!', 'success');
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
  { id: 1, icon: 'fa-triangle-exclamation', color: '#fb923c', bg: 'rgba(251,146,60,0.15)', title: 'Low Stock Alert', text: 'Server Node Cluster down to 14 units.', time: '10 mins ago', unread: true },
  { id: 2, icon: 'fa-circle-exclamation', color: '#f87171', bg: 'rgba(248,113,113,0.15)', title: 'Out of Stock', text: 'Security YubiKey is completely out of stock.', time: '1 hr ago', unread: true },
  { id: 3, icon: 'fa-bolt', color: '#34d399', bg: 'rgba(52,211,153,0.15)', title: 'Top Seller', text: 'SaaS Pro reached 1,200 total sales.', time: '4 hrs ago', unread: false },
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

document.getElementById('exportAllProductsBtn')?.addEventListener('click', () => {
  showToast('Exporting entire product catalog (1,420 items) to CSV...', 'info');
});

// Initial Render
renderProducts();
renderNotifications();

console.log('%c NexusPanel Products v1.0.0 ready 📦', 'color:#7c6ff7;font-weight:700;font-size:14px;');
