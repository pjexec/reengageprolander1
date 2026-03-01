(function () {
    'use strict';

    // Sandbox theme colors — dark blue instead of green
    const COLORS = {
        primary: '#2b3a67',
        primaryDark: '#1a2440',
        accent: '#2b3a67',
        accentDark: '#1a2440',
        white: '#ffffff',
        gray100: '#f3f4f6',
        gray200: '#e5e7eb',
        gray500: '#6b7280',
        gray700: '#374151'
    };

    // Inject styles
    const styles = `
    #chat-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #chat-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(43, 58, 103, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    #chat-widget-button::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: inherit;
      animation: pulse-ring 2s ease-out infinite;
      z-index: -1;
    }

    @keyframes pulse-glow {
      0%, 100% { 
        box-shadow: 0 4px 20px rgba(43, 58, 103, 0.4);
      }
      50% { 
        box-shadow: 0 4px 30px rgba(43, 58, 103, 0.7), 0 0 20px rgba(43, 58, 103, 0.4);
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.6;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    #chat-widget-button:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(43, 58, 103, 0.6);
      animation: none;
    }

    #chat-widget-button:hover::before {
      animation: none;
      opacity: 0;
    }

    #chat-widget-button svg {
      width: 28px;
      height: 28px;
      fill: ${COLORS.white};
    }

    #chat-widget-button .badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #ef4444;
      color: ${COLORS.white};
      font-size: 12px;
      font-weight: 700;
      min-width: 24px;
      height: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
      animation: bounce-badge 1s ease infinite;
    }

    @keyframes bounce-badge {
      0%, 100% { transform: scale(1) translateY(0); }
      25% { transform: scale(1.1) translateY(-3px); }
      50% { transform: scale(1) translateY(0); }
      75% { transform: scale(1.05) translateY(-2px); }
    }

    #chat-widget-window {
      position: absolute;
      bottom: 76px;
      right: 0;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: ${COLORS.white};
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    #chat-widget-window.open {
      display: flex;
    }

    #chat-widget-header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
      padding: 20px;
      color: ${COLORS.white};
    }

    #chat-widget-header h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 700;
    }

    #chat-widget-header p {
      margin: 0;
      font-size: 13px;
      opacity: 0.85;
    }

    #chat-widget-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    #chat-widget-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    #chat-widget-close svg {
      width: 16px;
      height: 16px;
      stroke: ${COLORS.white};
    }

    #chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: ${COLORS.gray100};
    }

    .chat-message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-message.admin {
      align-self: flex-start;
      background: ${COLORS.white};
      color: ${COLORS.gray700};
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chat-message.visitor {
      align-self: flex-end;
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
      color: ${COLORS.white};
      border-bottom-right-radius: 4px;
    }

    .chat-message .time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
      display: block;
    }

    #chat-widget-typing {
      padding: 8px 16px;
      font-size: 13px;
      color: ${COLORS.gray500};
      font-style: italic;
      display: none;
    }

    #chat-widget-input-container {
      padding: 16px;
      background: ${COLORS.white};
      border-top: 1px solid ${COLORS.gray200};
      display: flex;
      gap: 12px;
    }

    #chat-widget-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid ${COLORS.gray200};
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }

    #chat-widget-input:focus {
      border-color: ${COLORS.primary};
    }

    #chat-widget-send {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    #chat-widget-send:hover {
      transform: scale(1.05);
    }

    #chat-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    #chat-widget-send svg {
      width: 20px;
      height: 20px;
      fill: ${COLORS.white};
    }

    .welcome-message {
      text-align: center;
      padding: 24px;
      color: ${COLORS.gray500};
    }

    .welcome-message h4 {
      color: ${COLORS.primary};
      margin: 0 0 8px 0;
      font-size: 16px;
    }

    .welcome-message p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      #chat-widget-container {
        bottom: 16px;
        right: 16px;
      }

      #chat-widget-button {
        width: 54px;
        height: 54px;
      }

      #chat-widget-window {
        bottom: 70px;
        width: calc(100vw - 32px);
        height: calc(100vh - 100px);
        right: 0;
        border-radius: 12px;
      }
    }
  `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create chat widget HTML
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.innerHTML = `
    <div id="chat-widget-window">
      <div id="chat-widget-header">
        <button id="chat-widget-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h3>Need Help?</h3>
        <p>We typically reply within a few minutes</p>
      </div>
      <div id="chat-widget-messages">
        <div class="welcome-message">
          <h4>👋 Welcome!</h4>
          <p>Ask us anything about ReEngage Pro. We're here to help!</p>
        </div>
      </div>
      <div id="chat-widget-typing">Support is typing...</div>
      <div id="chat-widget-input-container">
        <input type="text" id="chat-widget-input" placeholder="Type your message..." autocomplete="off" />
        <button id="chat-widget-send" aria-label="Send message">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
    <button id="chat-widget-button" aria-label="Open chat">
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm1.07-4.25c-.26.26-.52.52-.52.75h-1.55c0-.74.56-1.24 1.05-1.73.74-.74 1.2-1.28 1.2-2.02 0-.92-.65-1.5-1.5-1.5-.93 0-1.5.78-1.5 1.5H8c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.22-.68 2.24-1.93 3z"/>
      </svg>
    </button>
  `;
    document.body.appendChild(container);

    // Elements
    const chatButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-widget-window');
    const closeButton = document.getElementById('chat-widget-close');
    const messagesContainer = document.getElementById('chat-widget-messages');
    const typingIndicator = document.getElementById('chat-widget-typing');
    const input = document.getElementById('chat-widget-input');
    const sendButton = document.getElementById('chat-widget-send');

    // State
    let socket = null;
    let visitorId = localStorage.getItem('chat-visitor-id');
    let unreadCount = 0;
    let isOpen = false;
    let maxScrollDepth = 0;

    // Get UTM parameters
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || '',
            utm_campaign: params.get('utm_campaign') || ''
        };
    }

    // Connect to Socket.IO (gracefully handles missing server)
    function connect() {
        if (typeof io === 'undefined') {
            console.log('Chat: Socket.IO not available — widget visible but not connected');
            return;
        }

        try {
            const utm = getUTMParams();
            const queryParams = new URLSearchParams({
                visitorId: visitorId || '',
                page: window.location.pathname,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                ...utm
            });

            socket = io({
                query: Object.fromEntries(queryParams)
            });

            socket.on('connect', () => {
                console.log('Chat connected');
            });

            socket.on('visitor-id', (id) => {
                visitorId = id;
                localStorage.setItem('chat-visitor-id', id);
            });

            socket.on('chat-history', (messages) => {
                if (messages && messages.length > 0) {
                    const welcome = messagesContainer.querySelector('.welcome-message');
                    if (welcome) welcome.remove();
                    messages.forEach(msg => addMessage(msg, false));
                }
            });

            socket.on('chat-message', (message) => {
                addMessage(message, true);
                if (!isOpen && message.from === 'admin') {
                    unreadCount++;
                    updateBadge();
                }
            });

            socket.on('admin-typing', () => {
                typingIndicator.style.display = 'block';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                }, 3000);
            });

            socket.on('disconnect', () => {
                console.log('Chat disconnected');
            });

            socket.on('connect_error', () => {
                console.log('Chat: Server not available — widget visible but not connected');
                socket.disconnect();
                socket = null;
            });
        } catch (e) {
            console.log('Chat: Connection failed —', e.message);
        }
    }

    // Add message to UI
    function addMessage(message, isNew) {
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        const div = document.createElement('div');
        div.className = `chat-message ${message.from}`;

        const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        div.innerHTML = `
      ${escapeHtml(message.text)}
      <span class="time">${time}</span>
    `;

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update badge
    function updateBadge() {
        let badge = chatButton.querySelector('.badge');
        if (unreadCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge';
                chatButton.appendChild(badge);
            }
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        } else if (badge) {
            badge.remove();
        }
    }

    // Send message
    function sendMessage() {
        const text = input.value.trim();
        if (!text || !socket) return;

        socket.emit('visitor-message', text);
        input.value = '';
        sendButton.disabled = true;
    }

    // Event listeners
    chatButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('open', isOpen);
        if (isOpen) {
            unreadCount = 0;
            updateBadge();
            input.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });

    closeButton.addEventListener('click', () => {
        isOpen = false;
        chatWindow.classList.remove('open');
    });

    input.addEventListener('input', () => {
        sendButton.disabled = !input.value.trim();
        if (socket && input.value.trim()) {
            socket.emit('visitor-typing');
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    // Track scroll depth
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            if (socket) {
                socket.emit('activity-update', { scrollDepth: maxScrollDepth });
            }
        }
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
        if (socket) {
            socket.emit('activity-update', {
                action: document.visibilityState === 'visible' ? 'tab_focused' : 'tab_blurred'
            });
        }
    });

    // Initialize
    sendButton.disabled = true;
    connect();
})();
