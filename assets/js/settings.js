/**
 * ========================================================
 * NexusPanel - Settings & Preferences Script (settings.js)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------
   * 1. THEME SWITCHER & CORE TEMPLATE BEHAVIOR
   * -------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Theme Sync
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

  // Sidebar Collapse & Mobile Drawer
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

  // Notification Popover & Profile Dropdown
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

  /* --------------------------------------------------------
   * 2. TOAST NOTIFICATION UTILITY
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
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* --------------------------------------------------------
   * 3. TAB NAVIGATION SWITCHING
   * -------------------------------------------------------- */
  const navItems = document.querySelectorAll('.settings-nav-item');
  const tabPanels = document.querySelectorAll('.settings-tab-panel');

  function resolveTabName(name) {
    if (!name) return 'general';
    const lower = name.toLowerCase();
    if (lower === 'account') return 'profile';
    if (lower === 'password') return 'profile';
    return lower;
  }

  function switchTab(tabId) {
    const resolvedId = resolveTabName(tabId);
    navItems.forEach(item => {
      const target = item.getAttribute('data-tab');
      if (target === resolvedId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${resolvedId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update URL hash without scroll jump
    history.replaceState(null, null, `#${resolvedId}`);
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Check URL query param or hash to set active tab
  function applyActiveTabFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const paramTab = params.get('tab');
    const hashTab = window.location.hash.replace('#', '');
    const tabToOpen = resolveTabName(paramTab || hashTab);
    if (tabToOpen && document.getElementById(`tab-${tabToOpen}`)) {
      switchTab(tabToOpen);
    }
  }

  applyActiveTabFromUrl();
  window.addEventListener('hashchange', applyActiveTabFromUrl);

  // In-page dropdown link handlers for instant switching on settings.html
  document.querySelectorAll('.profile-dropdown .pd-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && (href === 'settings.html' || href.startsWith('settings.html#') || href.startsWith('#'))) {
        e.preventDefault();
        closeAllPopovers();
        const hash = href.includes('#') ? href.split('#')[1] : 'general';
        switchTab(hash);
      }
    });
  });

  /* --------------------------------------------------------
   * 4. SAVE CHANGES HANDLERS
   * -------------------------------------------------------- */
  const saveBtns = document.querySelectorAll('.save-settings-btn');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        showToast('Settings saved successfully!');
      }, 600);
    });
  });

  // Global top save button
  const globalSaveBtn = document.getElementById('globalSaveBtn');
  if (globalSaveBtn) {
    globalSaveBtn.addEventListener('click', () => {
      showToast('All configuration changes saved!');
    });
  }

  const globalResetBtn = document.getElementById('globalResetBtn');
  if (globalResetBtn) {
    globalResetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to revert uncommitted changes?')) {
        showToast('Settings reverted to defaults.', 'info');
      }
    });
  }

  /* --------------------------------------------------------
   * 5. PROFILE PHOTO UPLOAD & REMOVE
   * -------------------------------------------------------- */
  const avatarUploadInput = document.getElementById('avatarUploadInput');
  const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
  const removeAvatarBtn = document.getElementById('removeAvatarBtn');
  const profileAvatarPreview = document.getElementById('profileAvatarPreview');
  const defaultAvatarUrl = 'assets/images/avatar.png';

  if (uploadAvatarBtn && avatarUploadInput) {
    uploadAvatarBtn.addEventListener('click', () => {
      avatarUploadInput.click();
    });

    avatarUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (profileAvatarPreview) profileAvatarPreview.src = loadEvt.target.result;
          showToast('Profile photo updated!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', () => {
      if (profileAvatarPreview) profileAvatarPreview.src = defaultAvatarUrl;
      showToast('Profile photo removed.', 'info');
    });
  }

  /* --------------------------------------------------------
   * 6. PASSWORD STRENGTH ANALYZER
   * -------------------------------------------------------- */
  const newPasswordInput = document.getElementById('newPasswordInput');
  const passBars = [
    document.getElementById('passBar1'),
    document.getElementById('passBar2'),
    document.getElementById('passBar3')
  ];
  const passStrengthLabel = document.getElementById('passStrengthLabel');

  if (newPasswordInput && passBars[0] && passStrengthLabel) {
    newPasswordInput.addEventListener('input', () => {
      const val = newPasswordInput.value;
      let score = 0;

      if (val.length >= 6) score++;
      if (val.length >= 10 && (/[A-Z]/.test(val) || /[0-9]/.test(val))) score++;
      if (val.length >= 12 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) score++;

      // Reset bars
      passBars.forEach(bar => {
        bar.className = 'password-bar-segment';
      });

      if (val.length === 0) {
        passStrengthLabel.textContent = 'Enter password to check strength';
        passStrengthLabel.style.color = 'var(--text-muted)';
        return;
      }

      if (score === 1) {
        passBars[0].classList.add('weak');
        passStrengthLabel.textContent = 'Weak password';
        passStrengthLabel.style.color = 'var(--red)';
      } else if (score === 2) {
        passBars[0].classList.add('medium');
        passBars[1].classList.add('medium');
        passStrengthLabel.textContent = 'Medium password';
        passStrengthLabel.style.color = 'var(--amber)';
      } else if (score >= 3) {
        passBars[0].classList.add('strong');
        passBars[1].classList.add('strong');
        passBars[2].classList.add('strong');
        passStrengthLabel.textContent = 'Strong password';
        passStrengthLabel.style.color = 'var(--green)';
      }
    });
  }

  /* --------------------------------------------------------
   * 7. API KEY COPY TO CLIPBOARD
   * -------------------------------------------------------- */
  const copyApiKeyBtn = document.getElementById('copyApiKeyBtn');
  const apiKeyText = document.getElementById('apiKeyText');

  if (copyApiKeyBtn && apiKeyText) {
    copyApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyText.textContent.trim();
      navigator.clipboard.writeText(key).then(() => {
        const originalHtml = copyApiKeyBtn.innerHTML;
        copyApiKeyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        copyApiKeyBtn.classList.add('btn-primary');
        showToast('API Key copied to clipboard!');

        setTimeout(() => {
          copyApiKeyBtn.innerHTML = originalHtml;
          copyApiKeyBtn.classList.remove('btn-primary');
        }, 2000);
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
    });
  }

  // Toggle API Key Visibility
  const toggleKeyVisibilityBtn = document.getElementById('toggleKeyVisibilityBtn');
  let isKeyVisible = false;
  const rawKey = 'nx_live_9942a78f8c091bc2e5d8409e8';

  if (toggleKeyVisibilityBtn && apiKeyText) {
    toggleKeyVisibilityBtn.addEventListener('click', () => {
      isKeyVisible = !isKeyVisible;
      if (isKeyVisible) {
        apiKeyText.textContent = rawKey;
        toggleKeyVisibilityBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
      } else {
        apiKeyText.textContent = 'nx_live_••••••••••••••••••••••••••••';
        toggleKeyVisibilityBtn.innerHTML = `<i class="fa-solid fa-eye"></i>`;
      }
    });
  }

  /* --------------------------------------------------------
   * 8. SESSION MANAGEMENT (REVOKE SESSION)
   * -------------------------------------------------------- */
  const revokeBtns = document.querySelectorAll('.revoke-session-btn');
  revokeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      if (confirm('Are you sure you want to terminate this active login session?')) {
        if (row) {
          row.style.transition = 'opacity 0.3s ease';
          row.style.opacity = '0';
          setTimeout(() => {
            row.remove();
            showToast('Session revoked successfully.');
          }, 300);
        }
      }
    });
  });

  /* --------------------------------------------------------
   * 9. TOGGLE SWITCH FEEDBACK
   * -------------------------------------------------------- */
  const switches = document.querySelectorAll('.switch input[type="checkbox"]');
  switches.forEach(sw => {
    sw.addEventListener('change', () => {
      const label = sw.closest('.switch-row')?.querySelector('.switch-title')?.textContent || 'Setting';
      const state = sw.checked ? 'enabled' : 'disabled';
      showToast(`${label} ${state}.`, 'info');
    });
  });

  /* --------------------------------------------------------
   * 10. HELPER FUNCTIONS
   * -------------------------------------------------------- */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
