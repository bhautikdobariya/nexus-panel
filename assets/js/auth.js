/**
 * NexusPanel – Authentication Logic (auth.js)
 * ──────────────────────────────────────────
 * Handles:
 *  - Theme synchronization & floating toggle
 *  - Password visibility toggle (show / hide)
 *  - Demo credentials one-click auto-fill
 *  - Real-time password strength calculation (register)
 *  - Interactive login & register submission flows
 *  - Forgot password modal dialog
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Theme Synchronization ──────────────────────────── */
  const themeToggle = document.getElementById('authThemeToggle');
  const themeIcon = document.getElementById('authThemeIcon');

  function applyLightMode() {
    document.documentElement.classList.add('light-mode');
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
  }

  function applyDarkMode() {
    document.documentElement.classList.remove('light-mode');
    document.body.classList.remove('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
  }

  // Initial theme state from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    applyLightMode();
  } else {
    applyDarkMode();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (document.body.classList.contains('light-mode')) {
        applyDarkMode();
        localStorage.setItem('theme', 'dark');
      } else {
        applyLightMode();
        localStorage.setItem('theme', 'light');
      }
    });
  }

  /* ─── 2. Password Visibility Toggle ─────────────────────── */
  const passToggles = document.querySelectorAll('.auth-pass-toggle');
  passToggles.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const targetInputId = toggleBtn.dataset.target;
      const input = document.getElementById(targetInputId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      }
    });
  });

  /* ─── 3. Quick Demo Credentials Auto-Fill ───────────────── */
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput && passInput) {
        emailInput.value = 'admin@nexuspanel.io';
        passInput.value = 'Nexus2026!Pro';

        // Brief visual flash on inputs
        emailInput.style.borderColor = 'var(--accent)';
        passInput.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          emailInput.style.borderColor = '';
          passInput.style.borderColor = '';
        }, 1200);

        fillDemoBtn.innerHTML = '<i class="fa-solid fa-check"></i> Filled!';
        setTimeout(() => {
          fillDemoBtn.innerHTML = 'Fill Credentials';
        }, 1800);
      }
    });
  }

  /* ─── 4. Real-time Password Strength Meter ──────────────── */
  const regPassword = document.getElementById('regPassword');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqNumber = document.getElementById('reqNumber');
  const reqSymbol = document.getElementById('reqSymbol');

  if (regPassword && strengthFill) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;

      const hasLength = val.length >= 8;
      const hasUpper = /[A-Z]/.test(val) && /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSymbol = /[^A-Za-z0-9]/.test(val);

      // Update requirement indicators
      updateReqItem(reqLength, hasLength);
      updateReqItem(reqUpper, hasUpper);
      updateReqItem(reqNumber, hasNumber);
      updateReqItem(reqSymbol, hasSymbol);

      // Score calculation (0 to 4)
      let score = 0;
      if (hasLength) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSymbol) score++;

      strengthFill.className = 'pass-strength-fill';

      if (val.length === 0) {
        strengthFill.style.width = '0%';
        if (strengthText) strengthText.textContent = 'Password Strength';
      } else if (score <= 1) {
        strengthFill.classList.add('weak');
        if (strengthText) { strengthText.textContent = 'Weak'; strengthText.style.color = 'var(--red)'; }
      } else if (score === 2) {
        strengthFill.classList.add('fair');
        if (strengthText) { strengthText.textContent = 'Fair'; strengthText.style.color = 'var(--orange)'; }
      } else if (score === 3) {
        strengthFill.classList.add('good');
        if (strengthText) { strengthText.textContent = 'Good'; strengthText.style.color = 'var(--blue)'; }
      } else {
        strengthFill.classList.add('strong');
        if (strengthText) { strengthText.textContent = 'Strong & Secure'; strengthText.style.color = 'var(--green)'; }
      }
    });
  }

  function updateReqItem(el, isValid) {
    if (!el) return;
    if (isValid) {
      el.classList.add('valid');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-circle-check';
    } else {
      el.classList.remove('valid');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'fa-regular fa-circle';
    }
  }

  /* ─── 5. Login Form Submission ──────────────────────────── */
  const loginForm = document.getElementById('loginForm');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      if (!email || !password) {
        showToast('Please fill in both email and password.', 'error');
        return;
      }

      // Show button loading state
      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
      }

      // Simulate authentication and redirect
      setTimeout(() => {
        // Successful login
        window.location.href = 'index.html';
      }, 750);
    });
  }

  /* ─── 6. Register Form Submission ───────────────────────── */
  const registerForm = document.getElementById('registerForm');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value;
      const terms = document.getElementById('regTerms')?.checked;

      if (!name || !email || !password) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (!terms) {
        showToast('Please accept the Security Policy & Access terms.', 'error');
        return;
      }

      if (password.length < 8) {
        showToast('Password must be at least 8 characters long.', 'error');
        return;
      }

      // Button loading state
      if (registerSubmitBtn) {
        registerSubmitBtn.disabled = true;
        registerSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Provisioning Admin Account...';
      }

      // Simulate registration and redirect
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 850);
    });
  }

  /* ─── 7. Forgot Password Modal ──────────────────────────── */
  const forgotPassLink = document.getElementById('forgotPassLink');
  const forgotPassBackdrop = document.getElementById('forgotPassBackdrop');
  const closeForgotModalBtn = document.getElementById('closeForgotModalBtn');
  const forgotPassForm = document.getElementById('forgotPassForm');
  const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');
  const forgotSuccessBox = document.getElementById('forgotSuccessBox');

  function openForgotModal() {
    if (forgotPassBackdrop) {
      forgotPassBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Pre-fill email if already typed in login
      const loginEmail = document.getElementById('loginEmail')?.value.trim();
      const forgotEmail = document.getElementById('forgotEmail');
      if (loginEmail && forgotEmail) forgotEmail.value = loginEmail;
    }
  }

  function closeForgotModal() {
    if (forgotPassBackdrop) {
      forgotPassBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (forgotSuccessBox) forgotSuccessBox.style.display = 'none';
      if (forgotPassForm) forgotPassForm.style.display = '';
    }
  }

  forgotPassLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openForgotModal();
  });

  closeForgotModalBtn?.addEventListener('click', closeForgotModal);

  forgotPassBackdrop?.addEventListener('click', (e) => {
    if (e.target === forgotPassBackdrop) closeForgotModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotPassBackdrop?.classList.contains('open')) {
      closeForgotModal();
    }
  });

  if (forgotPassForm) {
    forgotPassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail')?.value.trim();
      if (!email) return;

      if (forgotSubmitBtn) {
        forgotSubmitBtn.disabled = true;
        forgotSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Link...';
      }

      setTimeout(() => {
        if (forgotSubmitBtn) {
          forgotSubmitBtn.disabled = false;
          forgotSubmitBtn.innerHTML = 'Send Reset Instructions';
        }
        if (forgotPassForm) forgotPassForm.style.display = 'none';
        if (forgotSuccessBox) {
          forgotSuccessBox.style.display = 'block';
          const sentEmailText = document.getElementById('sentEmailAddress');
          if (sentEmailText) sentEmailText.textContent = email;
        }
      }, 800);
    });
  }

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
  window.showToast = showToast;

});
