/**
 * ========================================================
 * NexusPanel - Help & Support Script (help.js)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------
   * 1. THEME SWITCHER & SIDEBAR
   * -------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') applyLightMode();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (document.body.classList.contains('light-mode')) {
        document.documentElement.classList.remove('light-mode');
        document.body.classList.remove('light-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
      } else {
        applyLightMode();
        localStorage.setItem('theme', 'light');
      }
    });
  }

  function applyLightMode() {
    document.documentElement.classList.add('light-mode');
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (window.innerWidth > 900) {
        document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
      } else {
        document.body.classList.remove('sidebar-open');
      }
    });
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }

  if (window.innerWidth > 900 && localStorage.getItem('sidebarCollapsed') === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  /* --------------------------------------------------------
   * 2. NOTIFICATION POPOVER & PROFILE DROPDOWN
   * -------------------------------------------------------- */
  const notifBtn = document.getElementById('notificationBtn');
  const notifPopover = document.getElementById('notifPopover');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const popoverBackdrop = document.getElementById('popoverBackdrop');

  function closeAllPopovers() {
    if (notifPopover) notifPopover.classList.remove('open');
    if (profileDropdown) profileDropdown.classList.remove('open');
    if (popoverBackdrop) popoverBackdrop.classList.remove('active');
    if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
    if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
  }

  if (notifBtn && notifPopover) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifPopover.classList.contains('open');
      closeAllPopovers();
      if (!isOpen) {
        notifPopover.classList.add('open');
        if (popoverBackdrop) popoverBackdrop.classList.add('active');
        notifBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileDropdown.classList.contains('open');
      closeAllPopovers();
      if (!isOpen) {
        profileDropdown.classList.add('open');
        if (popoverBackdrop) popoverBackdrop.classList.add('active');
        profileBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (popoverBackdrop) {
    popoverBackdrop.addEventListener('click', closeAllPopovers);
  }

  document.addEventListener('click', (e) => {
    if (notifPopover && !notifPopover.contains(e.target) && notifBtn && !notifBtn.contains(e.target) &&
        profileDropdown && !profileDropdown.contains(e.target) && profileBtn && !profileBtn.contains(e.target)) {
      closeAllPopovers();
    }
  });

  // Mark all read button
  const markAllBtn = document.getElementById('markAllReadBtn');
  const notifDot = document.getElementById('notifDot');
  const notifCountBadge = document.getElementById('notifCountBadge');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      document.querySelectorAll('#notifList .notif-item').forEach(item => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-unread-dot');
        if (dot) dot.remove();
      });
      if (notifCountBadge) {
        notifCountBadge.textContent = 'All read';
        notifCountBadge.style.background = 'var(--text-muted)';
      }
      if (notifDot) notifDot.style.display = 'none';
    });
  }

  // Logout handler
  document.getElementById('pdLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllPopovers();
    if (confirm('Are you sure you want to sign out?')) {
      window.location.href = 'login.html';
    }
  });

  /* --------------------------------------------------------
   * 3. TOAST NOTIFICATIONS
   * -------------------------------------------------------- */
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color: ${type === 'success' ? 'var(--green)' : type === 'error' ? 'var(--red)' : 'var(--blue)'};"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
  window.showToast = showToast;

  /* --------------------------------------------------------
   * 4. FAQ ACCORDION
   * -------------------------------------------------------- */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close other items
      document.querySelectorAll('.faq-item').forEach(el => {
        if (el !== item) el.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      } else {
        item.classList.remove('open');
      }
    });
  });

  /* --------------------------------------------------------
   * 5. SEARCH FILTER FOR FAQ & TOPICS
   * -------------------------------------------------------- */
  const helpSearchInput = document.getElementById('helpSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (helpSearchInput) {
    helpSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
          if (query.length > 2) item.classList.add('open');
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Search tag pill click
  document.querySelectorAll('.help-tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const tagText = pill.textContent.replace('#', '').trim();
      if (helpSearchInput) {
        helpSearchInput.value = tagText;
        helpSearchInput.dispatchEvent(new Event('input'));
        showToast(`Filtered FAQs for "${tagText}"`, 'info');
      }
    });
  });

  /* --------------------------------------------------------
   * 6. SUPPORT TICKET SUBMISSION
   * -------------------------------------------------------- */
  const supportTicketForm = document.getElementById('supportTicketForm');
  if (supportTicketForm) {
    supportTicketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = supportTicketForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        supportTicketForm.reset();
        showToast('Support ticket #TK-8429 submitted! Our team will reply within 2 hours.', 'success');
      }, 900);
    });
  }
});
