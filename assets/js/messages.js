/**
 * ========================================================
 * NexusPanel - Messages & Live Chat Script (messages.js)
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
   * 2. CONVERSATIONS DATASET
   * -------------------------------------------------------- */
  const conversations = [
    {
      id: 'c1',
      name: 'Sophie Turner',
      role: 'VIP Member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      status: 'online',
      statusText: 'Active now',
      category: 'vip',
      unread: 2,
      time: '2m ago',
      email: 'sophie.t@example.com',
      phone: '+1 (555) 234-8901',
      ordersCount: 24,
      totalSpend: '$6,420.00',
      sharedFiles: [
        { name: 'Invoice_#NX-8821.pdf', size: '184 KB', icon: 'fa-file-pdf' },
        { name: 'Product_Damaged_Photo.jpg', size: '2.4 MB', icon: 'fa-file-image' }
      ],
      messages: [
        {
          id: 'm1-1',
          sender: 'them',
          text: 'Hi Alex! Hope you are having a wonderful week.',
          time: '10:40 AM',
          attachment: null
        },
        {
          id: 'm1-2',
          sender: 'them',
          text: 'I just placed order #NX-9942 for our corporate retreat gear, but I noticed the billing address might have defaulted to our previous HQ.',
          time: '10:41 AM',
          attachment: null
        },
        {
          id: 'm1-3',
          sender: 'me',
          text: 'Good morning Sophie! Let me check the order queue right now.',
          time: '10:43 AM',
          attachment: null
        },
        {
          id: 'm1-4',
          sender: 'me',
          text: 'I updated the billing address to your 742 Evergreen Terrace suite. Here is the revised invoice with updated tax breakdown.',
          time: '10:45 AM',
          attachment: {
            name: 'Invoice_#NX-8821.pdf',
            size: '184 KB',
            icon: 'fa-file-pdf'
          }
        },
        {
          id: 'm1-5',
          sender: 'them',
          text: 'Hey Alex, did the updated shipping invoice arrive with express priority tag attached?',
          time: '10:48 AM',
          attachment: null
        }
      ]
    },
    {
      id: 'c2',
      name: 'James Wilson',
      role: 'Regular Buyer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      status: 'online',
      statusText: 'Active now',
      category: 'support',
      unread: 1,
      time: '18m ago',
      email: 'james.w@example.com',
      phone: '+1 (555) 902-1144',
      ordersCount: 8,
      totalSpend: '$1,890.00',
      sharedFiles: [
        { name: 'Delivery_Instructions.txt', size: '12 KB', icon: 'fa-file-lines' }
      ],
      messages: [
        {
          id: 'm2-1',
          sender: 'them',
          text: 'Hello team, quick question regarding Order #NX-8822.',
          time: '09:15 AM',
          attachment: null
        },
        {
          id: 'm2-2',
          sender: 'me',
          text: 'Hi James! Sure thing, how can we assist you today?',
          time: '09:20 AM',
          attachment: null
        },
        {
          id: 'm2-3',
          sender: 'them',
          text: 'Can I change my order delivery address before dispatch to my office downtown?',
          time: '09:35 AM',
          attachment: null
        }
      ]
    },
    {
      id: 'c3',
      name: 'Anya Roberts',
      role: 'VIP Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      status: 'away',
      statusText: 'Away (15m)',
      category: 'vip',
      unread: 0,
      time: '1h ago',
      email: 'anya.r@example.com',
      phone: '+44 7700 900142',
      ordersCount: 31,
      totalSpend: '$9,280.00',
      sharedFiles: [
        { name: 'Return_Receipt_Scan.pdf', size: '320 KB', icon: 'fa-file-pdf' }
      ],
      messages: [
        {
          id: 'm3-1',
          sender: 'them',
          text: 'Hi Alex, I returned the extra Ultra-Slim mechanical keyboard yesterday.',
          time: 'Yesterday',
          attachment: null
        },
        {
          id: 'm3-2',
          sender: 'me',
          text: 'We received it at our logistics warehouse this morning and the refund credit has been authorized.',
          time: 'Yesterday',
          attachment: null
        },
        {
          id: 'm3-3',
          sender: 'them',
          text: 'Thanks for the quick refund processing! Really appreciate it.',
          time: '1h ago',
          attachment: null
        }
      ]
    },
    {
      id: 'c4',
      name: 'Carlos Mendez',
      role: 'Wholesale Partner',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      status: 'offline',
      statusText: 'Offline',
      category: 'support',
      unread: 0,
      time: 'Yesterday',
      email: 'carlos.m@example.com',
      phone: '+1 (555) 349-2189',
      ordersCount: 15,
      totalSpend: '$14,500.00',
      sharedFiles: [
        { name: 'Q4_Wholesale_Manifest.xlsx', size: '1.8 MB', icon: 'fa-file-excel' }
      ],
      messages: [
        {
          id: 'm4-1',
          sender: 'them',
          text: 'Looking forward to our quarterly restock schedule.',
          time: 'Yesterday',
          attachment: null
        },
        {
          id: 'm4-2',
          sender: 'me',
          text: 'Everything is locked in Carlos! Pallets will ship out next Tuesday.',
          time: 'Yesterday',
          attachment: null
        }
      ]
    },
    {
      id: 'c5',
      name: 'Mei Lin',
      role: 'New Buyer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      status: 'online',
      statusText: 'Active now',
      category: 'all',
      unread: 0,
      time: '2d ago',
      email: 'mei.lin@example.com',
      phone: '+1 (555) 781-4320',
      ordersCount: 2,
      totalSpend: '$420.00',
      sharedFiles: [],
      messages: [
        {
          id: 'm5-1',
          sender: 'them',
          text: 'Hi there, is the Pro Wireless Headphones in matte black available for immediate express dispatch?',
          time: '2d ago',
          attachment: null
        },
        {
          id: 'm5-2',
          sender: 'me',
          text: 'Yes Mei! It is in stock and qualifies for free next-day express shipping.',
          time: '2d ago',
          attachment: null
        }
      ]
    }
  ];

  /* --------------------------------------------------------
   * 3. DOM REFERENCES & STATE
   * -------------------------------------------------------- */
  let activeConvId = 'c1';
  let currentFilter = 'all';
  let searchQuery = '';

  const chatWrapper = document.getElementById('chatWrapper');
  const convListContainer = document.getElementById('chatConvList');
  const chatMessagesStream = document.getElementById('chatMessagesStream');
  const chatTypingIndicator = document.getElementById('chatTypingIndicator');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatSearchInput = document.getElementById('chatSearchInput');
  const filterBtns = document.querySelectorAll('.chat-filter-btn');

  // Header Elements
  const headerAvatar = document.getElementById('chatHeaderAvatar');
  const headerName = document.getElementById('chatHeaderName');
  const headerStatus = document.getElementById('chatHeaderStatus');
  const backToConversationsBtn = document.getElementById('backToConversationsBtn');
  const toggleChatInfoBtn = document.getElementById('toggleChatInfoBtn');
  const chatInfoPanel = document.getElementById('chatInfoPanel');

  // Right Details Elements
  const infoAvatar = document.getElementById('chatInfoAvatar');
  const infoName = document.getElementById('chatInfoName');
  const infoRole = document.getElementById('chatInfoRole');
  const infoEmail = document.getElementById('chatInfoEmail');
  const infoPhone = document.getElementById('chatInfoPhone');
  const infoSpend = document.getElementById('chatInfoSpend');
  const infoOrders = document.getElementById('chatInfoOrders');
  const infoFilesList = document.getElementById('chatInfoFilesList');

  // Auto Reply simulation responses
  const autoReplies = [
    "Thanks for confirming that! Really appreciate the speedy help.",
    "Got it! That clarifies everything. Thank you so much!",
    "Perfect! I will verify the details right away.",
    "Sounds great, thanks for looking into this for us!",
    "Excellent service as always. Have a wonderful rest of your day!"
  ];

  /* --------------------------------------------------------
   * 4. RENDER CONVERSATION LIST
   * -------------------------------------------------------- */
  function renderConversationList() {
    if (!convListContainer) return;

    let filtered = conversations.filter(conv => {
      // Filter tab
      if (currentFilter === 'unread' && conv.unread === 0) return false;
      if (currentFilter === 'vip' && conv.category !== 'vip') return false;
      if (currentFilter === 'support' && conv.category !== 'support') return false;

      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const lastMsg = conv.messages[conv.messages.length - 1]?.text || '';
        const matchName = conv.name.toLowerCase().includes(q);
        const matchMsg = lastMsg.toLowerCase().includes(q);
        if (!matchName && !matchMsg) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      convListContainer.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
          <i class="fa-solid fa-inbox" style="font-size: 28px; margin-bottom: 8px; opacity: 0.5;"></i>
          <p>No conversations found</p>
        </div>
      `;
      return;
    }

    convListContainer.innerHTML = filtered.map(conv => {
      const isActive = conv.id === activeConvId;
      const lastMsg = conv.messages[conv.messages.length - 1];
      const previewText = lastMsg ? (lastMsg.sender === 'me' ? `You: ${lastMsg.text}` : lastMsg.text) : 'No messages yet';

      return `
        <div class="chat-conv-item ${isActive ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}" data-conv-id="${conv.id}">
          <div class="chat-conv-avatar-wrap">
            <img src="${conv.avatar}" alt="${conv.name}" class="chat-conv-avatar" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=7c6ff7&color=fff&rounded=true';" />
            <span class="chat-online-badge ${conv.status}"></span>
          </div>
          <div class="chat-conv-body">
            <div class="chat-conv-header">
              <span class="chat-conv-name">${conv.name}</span>
              <span class="chat-conv-time">${conv.time}</span>
            </div>
            <div class="chat-conv-footer">
              <p class="chat-conv-preview">${escapeHtml(previewText)}</p>
              ${conv.unread > 0 ? `<span class="chat-unread-count">${conv.unread}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    convListContainer.querySelectorAll('.chat-conv-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-conv-id');
        selectConversation(id);
      });
    });
  }

  /* --------------------------------------------------------
   * 5. SELECT CONVERSATION
   * -------------------------------------------------------- */
  function selectConversation(id) {
    activeConvId = id;
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;

    // Reset unread count
    conv.unread = 0;

    // Update active state in sidebar list
    renderConversationList();

    // Update Chat Header
    if (headerAvatar) {
      headerAvatar.src = conv.avatar;
      headerAvatar.onerror = function() {
        this.onerror = null;
        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=7c6ff7&color=fff&rounded=true`;
      };
    }
    if (headerName) headerName.textContent = conv.name;
    if (headerStatus) {
      headerStatus.className = `chat-header-status ${conv.status === 'offline' ? 'offline' : ''}`;
      headerStatus.innerHTML = `
        <i class="fa-solid fa-circle" style="font-size: 8px;"></i>
        <span>${conv.statusText}</span>
      `;
    }

    // Update Chat Info Details Panel
    if (infoAvatar) {
      infoAvatar.src = conv.avatar;
      infoAvatar.onerror = function() {
        this.onerror = null;
        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=7c6ff7&color=fff&rounded=true`;
      };
    }
    if (infoName) infoName.textContent = conv.name;
    if (infoRole) infoRole.textContent = conv.role;
    if (infoEmail) infoEmail.textContent = conv.email;
    if (infoPhone) infoPhone.textContent = conv.phone;
    if (infoSpend) infoSpend.textContent = conv.totalSpend;
    if (infoOrders) infoOrders.textContent = conv.ordersCount;

    if (infoFilesList) {
      if (conv.sharedFiles.length === 0) {
        infoFilesList.innerHTML = `<p style="font-size: 11.5px; color: var(--text-muted); margin: 0;">No attachments shared yet</p>`;
      } else {
        infoFilesList.innerHTML = conv.sharedFiles.map(file => `
          <div class="chat-shared-file-item">
            <i class="fa-solid ${file.icon}"></i>
            <div class="chat-shared-file-details">
              <span class="chat-shared-file-title">${file.name}</span>
              <span class="chat-shared-file-size">${file.size}</span>
            </div>
            <a href="#" style="color: var(--text-muted); font-size: 12px;" title="Download"><i class="fa-solid fa-download"></i></a>
          </div>
        `).join('');
      }
    }

    // Render Messages Stream
    renderMessages(conv);

    // Mobile View Toggle
    if (window.innerWidth <= 768 && chatWrapper) {
      chatWrapper.classList.add('mobile-chat-active');
    }
  }

  /* --------------------------------------------------------
   * 6. RENDER MESSAGES STREAM
   * -------------------------------------------------------- */
  function renderMessages(conv) {
    if (!chatMessagesStream) return;

    chatMessagesStream.innerHTML = `
      <div class="chat-divider-date">
        <span>Today, Oct 24</span>
      </div>
    `;

    conv.messages.forEach(msg => {
      const isOutgoing = msg.sender === 'me';
      const msgRow = document.createElement('div');
      msgRow.className = `chat-message-row ${isOutgoing ? 'outgoing' : 'incoming'}`;

      let attachmentHtml = '';
      if (msg.attachment) {
        attachmentHtml = `
          <div class="chat-attachment">
            <i class="fa-solid ${msg.attachment.icon} chat-attachment-icon"></i>
            <div class="chat-attachment-info">
              <span class="chat-attachment-name">${msg.attachment.name}</span>
              <span class="chat-attachment-size">${msg.attachment.size}</span>
            </div>
            <i class="fa-solid fa-arrow-down" style="font-size: 11px; margin-left: auto;"></i>
          </div>
        `;
      }

      msgRow.innerHTML = `
        ${!isOutgoing ? `<img src="${conv.avatar}" alt="${conv.name}" class="chat-msg-avatar" />` : ''}
        <div class="chat-msg-content">
          <div class="chat-bubble">
            ${escapeHtml(msg.text)}
            ${attachmentHtml}
          </div>
          <div class="chat-msg-meta">
            <span>${msg.time}</span>
            ${isOutgoing ? `<i class="fa-solid fa-check-double read"></i>` : ''}
          </div>
        </div>
      `;

      chatMessagesStream.appendChild(msgRow);
    });

    scrollToBottom();
  }

  function scrollToBottom() {
    if (!chatMessagesStream) return;
    setTimeout(() => {
      chatMessagesStream.scrollTop = chatMessagesStream.scrollHeight;
    }, 50);
  }

  /* --------------------------------------------------------
   * 7. SEND MESSAGE LOGIC
   * -------------------------------------------------------- */
  function sendMessage() {
    if (!chatMessageInput) return;
    const text = chatMessageInput.value.trim();
    if (!text) return;

    const conv = conversations.find(c => c.id === activeConvId);
    if (!conv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'me',
      text: text,
      time: timeStr,
      attachment: null
    };

    conv.messages.push(newMsg);
    conv.time = 'Just now';

    // Clear input
    chatMessageInput.value = '';
    chatMessageInput.focus();

    // Render outgoing bubble
    const msgRow = document.createElement('div');
    msgRow.className = 'chat-message-row outgoing';
    msgRow.innerHTML = `
      <div class="chat-msg-content">
        <div class="chat-bubble">${escapeHtml(newMsg.text)}</div>
        <div class="chat-msg-meta">
          <span>${newMsg.time}</span>
          <i class="fa-solid fa-check"></i>
        </div>
      </div>
    `;
    chatMessagesStream.appendChild(msgRow);
    scrollToBottom();

    // Update conversation item preview
    renderConversationList();

    // Simulate reply from the customer
    simulateReply(conv);
  }

  function simulateReply(conv) {
    // Show typing indicator
    if (chatTypingIndicator) {
      setTimeout(() => {
        chatTypingIndicator.classList.add('active');
        scrollToBottom();
      }, 700);
    }

    // Deliver reply
    setTimeout(() => {
      if (chatTypingIndicator) {
        chatTypingIndicator.classList.remove('active');
      }

      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const incomingMsg = {
        id: 'reply-' + Date.now(),
        sender: 'them',
        text: randomReply,
        time: timeStr,
        attachment: null
      };

      conv.messages.push(incomingMsg);
      conv.time = 'Just now';

      // If active conversation is still this one, append incoming bubble
      if (activeConvId === conv.id) {
        const msgRow = document.createElement('div');
        msgRow.className = 'chat-message-row incoming';
        msgRow.innerHTML = `
          <img src="${conv.avatar}" alt="${conv.name}" class="chat-msg-avatar" />
          <div class="chat-msg-content">
            <div class="chat-bubble">${escapeHtml(incomingMsg.text)}</div>
            <div class="chat-msg-meta">
              <span>${incomingMsg.time}</span>
            </div>
          </div>
        `;
        chatMessagesStream.appendChild(msgRow);
        scrollToBottom();
      } else {
        conv.unread += 1;
      }

      renderConversationList();
    }, 1800);
  }

  /* --------------------------------------------------------
   * 8. EVENT LISTENERS
   * -------------------------------------------------------- */
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }

  if (chatMessageInput) {
    chatMessageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Back to conversations list on mobile
  if (backToConversationsBtn && chatWrapper) {
    backToConversationsBtn.addEventListener('click', () => {
      chatWrapper.classList.remove('mobile-chat-active');
    });
  }

  // Toggle Right Chat Info Panel
  if (toggleChatInfoBtn && chatInfoPanel) {
    toggleChatInfoBtn.addEventListener('click', () => {
      if (window.innerWidth <= 1200) {
        chatInfoPanel.classList.toggle('show-info');
      } else {
        chatInfoPanel.classList.toggle('hidden');
      }
    });
  }

  // Filter Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderConversationList();
    });
  });

  // Search Input
  if (chatSearchInput) {
    chatSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderConversationList();
    });
  }

  // Compose Message Modal Trigger
  const composeBtn = document.getElementById('composeMessageBtn');
  const composeModal = document.getElementById('composeModal');
  const closeComposeModalBtn = document.getElementById('closeComposeModalBtn');
  const cancelComposeBtn = document.getElementById('cancelComposeBtn');
  const sendNewChatBtn = document.getElementById('sendNewChatBtn');

  if (composeBtn && composeModal) {
    composeBtn.addEventListener('click', () => {
      composeModal.classList.add('open');
      composeModal.classList.add('active');
    });
  }

  function closeComposeModal() {
    if (composeModal) {
      composeModal.classList.remove('open');
      composeModal.classList.remove('active');
    }
  }

  if (closeComposeModalBtn) closeComposeModalBtn.addEventListener('click', closeComposeModal);
  if (cancelComposeBtn) cancelComposeBtn.addEventListener('click', closeComposeModal);

  if (composeModal) {
    composeModal.addEventListener('click', (e) => {
      if (e.target === composeModal) closeComposeModal();
    });
  }

  if (sendNewChatBtn) {
    sendNewChatBtn.addEventListener('click', () => {
      const recipient = document.getElementById('composeRecipient')?.value.trim();
      const message = document.getElementById('composeInitialMessage')?.value.trim();

      if (!recipient || !message) {
        showToast('Please provide recipient name and initial message.', 'error');
        return;
      }

      const newConv = {
        id: 'c' + (conversations.length + 1),
        name: recipient,
        role: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        status: 'online',
        statusText: 'Active now',
        category: 'all',
        unread: 0,
        time: 'Just now',
        email: recipient.toLowerCase().replace(/\s+/g, '.') + '@example.com',
        phone: '+1 (555) 019-2834',
        ordersCount: 1,
        totalSpend: '$150.00',
        sharedFiles: [],
        messages: [
          {
            id: 'm-init',
            sender: 'me',
            text: message,
            time: 'Just now',
            attachment: null
          }
        ]
      };

      conversations.unshift(newConv);
      closeComposeModal();
      document.getElementById('composeRecipient').value = '';
      document.getElementById('composeInitialMessage').value = '';

      selectConversation(newConv.id);
      showToast(`Conversation with ${recipient} started!`, 'success');
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

  /* --------------------------------------------------------
   * 9. HELPER FUNCTIONS
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

  // Initial load
  renderConversationList();
  selectConversation(activeConvId);
});
