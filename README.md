# NexusPanel – Modern Admin Dashboard & Management Console HTML Template

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-Standard_Commercial-green.svg)](https://themeforest.net/licenses/standard)

**NexusPanel** is a premium, developer-friendly, and ultra-responsive Admin Dashboard template built purely with semantic **HTML5**, **vanilla CSS3**, and **modern ES6+ JavaScript**. It requires zero build steps, zero node_modules, and zero heavy frameworks — simply unzip and open `index.html` in any web browser or integrate it into your backend framework of choice (Laravel, Node.js, Django, Ruby on Rails, ASP.NET, Go, etc.).

---

## ⚡ Key Highlights

- **Pure Vanilla Stack**: 100% dependency-free core logic. No React/Vue/Webpack bloat — fast load times and straightforward code.
- **Dark & Light Mode**: Seamless theme switching with persistence via `localStorage` and zero-flash-of-unstyled-content (Zero FOUC) preloader.
- **11 Complete Page Templates**: Covering standard SaaS, eCommerce, CRM, Customer Support, and System Operations workflows.
- **Fully Responsive**: Fluid layout scaling from 320px mobile screens to 4K ultra-wide monitors with collapsible sidebar drawer.
- **Interactive UI Components**: Custom modal dialogs, non-blocking toast notifications, bulk-selection action bars, password strength meter, tabs, and filter controls.
- **Data Visualization**: Dynamic Chart.js integration featuring dual-axis revenue lines, sparklines, traffic donuts, and live data counters.
- **Clean Semantic Code**: BEM-inspired CSS classes, organized CSS variables, and modular JS files with comprehensive comments.

---

## 📁 File & Folder Architecture

```text
nexuspanel-template/
├── index.html                  ← Executive Dashboard (KPI stats, charts, orders, activity feed)
├── analytics.html              ← Analytics & Performance (Traffic funnels, sparklines, device donuts)
├── orders.html                 ← Orders Management (Filters, tabs, order modal with timeline, bulk actions)
├── products.html               ← Products & Inventory (Grid/table switchers, stock health meters, add modal)
├── customers.html              ← Customers & CRM (Directory, 360° customer profile modal, tier tags)
├── messages.html               ← Messages & Live Chat (Split-view chat, active typing, file attachments)
├── settings.html               ← Settings & Configuration (Profile, Security, 2FA, Billing, Webhooks)
├── help.html                   ← Help & Support Center (Search, FAQs accordion, ticket submission form)
├── login.html                  ← Administrator Sign In (1-click demo filler, password toggle, forgot pass)
├── register.html               ← Administrator Sign Up (Real-time 4-tier password strength checklist)
├── 404.html                    ← Custom 404 Error Page (Themed error card, quick navigation links)
├── README.md                   ← Buyer documentation & customization manual
└── assets/
    ├── css/
    │   ├── style.css           ← Core stylesheet (Global imports, variables, reset, layout, topbar, sidebar)
    │   ├── auth.css            ← Authentication & error page layouts
    │   ├── components.css      ← Reusable UI components (Toasts, loaders, badges, tooltips, progress bars)
    │   ├── animations.css      ← Keyframes, entrance animations, and micro-interaction utilities
    │   └── responsive.css      ← Additional breakpoint overrides
    ├── js/
    │   ├── main.js             ← Executive dashboard controller & Chart.js instances
    │   ├── analytics.js        ← Analytics page metrics, sparkline factories & date toggles
    │   ├── orders.js           ← Orders catalog, multi-criteria filtering, modal & export engine
    │   ├── products.js         ← Products catalog, stock health meters & add/edit product modal
    │   ├── customers.js        ← CRM directory, customer profile drawer & bulk status updater
    │   ├── messages.js         ← Live chat engine, conversation switcher, message stream & compose
    │   ├── settings.js         ← Tab switcher, avatar upload preview, API key generation & toggles
    │   ├── help.js             ← FAQ search filter, ticket form handler & category accordion
    │   ├── auth.js             ← Auth form validation, password strength calculator & demo login
    │   └── charts.js           ← Universal Chart.js configuration presets & gradient helpers
    └── images/
        ├── avatar.png          ← Demo user avatar
        └── favicon.svg         ← Vector branded favicon
```

---

## 🚀 Quick Start Guide

### 1. Direct Browser Usage
Double click or open `index.html` directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari. No web server is required.

### 2. Live Server (VS Code / WebStorm)
For an optimal development experience with live auto-reloading:
1. Open the folder in **Visual Studio Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.

### 3. Demo Credentials
The authentication pages include a **"Fill Credentials"** button for testing:
- **Email**: `admin@nexuspanel.io`
- **Password**: `Nexus2026!Pro`

---

## 🎨 Customizing Design & Branding

All theme tokens, color palettes, and layout sizes are declared using native **CSS Variables** at the top of `assets/css/style.css`. Changing one variable updates the entire application:

```css
:root {
  /* Layout Dimensions */
  --sidebar-w:            260px;   /* Sidebar expanded width */
  --sidebar-collapsed-w:  72px;    /* Sidebar collapsed width */
  --topbar-h:             68px;    /* Header height */

  /* Brand Accents */
  --accent:               #7c6ff7; /* Primary purple brand accent */
  --accent-light:         #9d93f9;
  --accent-glow:          rgba(124, 111, 247, 0.28);

  /* Dark Mode Base Colors */
  --bg-base:              #0f1117; /* Background canvas */
  --bg-surface:           #16181f; /* Surface cards & panels */
  --bg-card:              #1c1f2b; /* Inner cards & modal boxes */
  --border:               rgba(255, 255, 255, 0.07);
  --border-strong:        rgba(255, 255, 255, 0.14);

  /* Semantic State Colors */
  --green:                #22c55e; /* In Stock / Completed / Paid */
  --orange:               #f59e0b; /* Low Stock / Pending */
  --red:                  #ef4444; /* Out of Stock / Cancelled */
  --blue:                 #38bdf8; /* Processing / Info */
}
```

To change the primary theme color from purple to emerald green, ocean blue, or crimson red, simply edit `--accent` and `--accent-light`.

---

## 🔌 API & Backend Integration Guide

All dynamic tables and lists in NexusPanel are driven by clean, decoupled JavaScript data arrays (e.g., `ordersData` in `orders.js`, `productsData` in `products.js`, `customersData` in `customers.js`).

### Replacing Mock Data with a REST API:

```javascript
// Example: In assets/js/orders.js
async function fetchOrdersFromAPI() {
  try {
    const response = await fetch('https://api.yourdomain.com/v1/orders', {
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    });
    const data = await response.json();
    
    // Replace mock array with server response
    ordersData.length = 0;
    data.forEach(item => ordersData.push(item));
    
    // Re-render table
    renderOrdersTable();
  } catch (error) {
    showToast('Failed to load orders from server', 'error');
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', fetchOrdersFromAPI);
```

---

## 🔔 Floating Toast Notification System

NexusPanel includes a built-in, non-blocking toast notification engine that works across every page:

```javascript
// Success toast
showToast('Product updated successfully!', 'success');

// Error toast
showToast('Invalid email address provided.', 'error');

// Information toast
showToast('Exporting data to CSV...', 'info');
```

Toasts are auto-dismissed after 3.2 seconds, smoothly animate from the screen edge, and never block user interactions.

---

## 🌐 Browser Compatibility

| Browser | Version Supported |
|---|---|
| Google Chrome | 90+ (Windows, macOS, Linux, Android) |
| Microsoft Edge | 90+ (Chromium) |
| Mozilla Firefox | 88+ |
| Apple Safari | 14+ (macOS, iOS, iPadOS) |
| Opera / Brave | Latest |

---

## 📦 Credits & Third-Party Assets

- **Icons**: [Font Awesome 6 Free](https://fontawesome.com/) (Fonticons, Inc. – SIL OFL 1.1 & MIT)
- **Typography**: [Inter Font](https://fonts.google.com/specimen/Inter) by Rasmus Andersson (Google Fonts – SIL OFL 1.1)
- **Charts**: [Chart.js 4](https://www.chartjs.org/) (Chart.js Contributors – MIT License)
- **Placeholder Avatars**: [Unsplash](https://unsplash.com/license) & [UI Avatars](https://ui-avatars.com/) (Free commercial license)

---

## 📄 License & Support

- **License**: Standard or Extended Commercial License via the marketplace of purchase.
- **Support**: For bug reports, questions, or customization inquiries, please contact our developer support team via the marketplace item support tab or via email at `support@nexuspanel.io`.

---

© 2026 NexusPanel Inc. All rights reserved. Built with passion for web developers and digital creators.
