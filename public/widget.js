(function () {
  "use strict";

  // ─── Prevent duplicate instances ──────────────
  if (document.getElementById("nexobot-widget")) return;

  // ─── Config from script tag ───────────────────
  var script =
    document.currentScript ||
    document.querySelector("script[data-business-id]");
  if (!script) {
    console.error("NexoBot: script tag not found");
    return;
  }

  var businessId = script.getAttribute("data-business-id");
  var color = script.getAttribute("data-color") || "#6366f1";
  var position = script.getAttribute("data-position") || "right";
  var greeting =
    script.getAttribute("data-greeting") || "¡Hola! ¿En qué puedo ayudarte?";
  var botName = script.getAttribute("data-bot-name") || "Asistente";
  var hideBranding = script.getAttribute("data-hide-branding") === "true";
  var apiUrl =
    script.getAttribute("data-api-url") ||
    script.src.replace(/\/widget\.js.*$/, "/api/chat");

  if (!businessId) {
    console.error("NexoBot: data-business-id is required");
    return;
  }

  var MAX_LENGTH = 2000;
  var SEND_COOLDOWN = 800;
  var FETCH_TIMEOUT = 30000;
  var STORAGE_KEY = "nexobot_" + businessId;

  // ─── State ────────────────────────────────────
  var isOpen = false;
  var isSending = false;
  var conversationId = null;
  var messages = [];
  var messageQueue = [];
  var lastSendTime = 0;
  var typingIndicatorId = null;

  // ─── Helpers ──────────────────────────────────
  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function sanitizeText(text) {
    return text
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
      .trim()
      .normalize("NFC");
  }

  function generateId() {
    return "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }

  // ─── Persistence ──────────────────────────────
  function saveState() {
    try {
      var data = {
        conversationId: conversationId,
        messages: messages.filter(function (m) { return !m.typing; }),
        isOpen: isOpen,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage full or unavailable */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      // Expire after 24 hours
      if (Date.now() - data.timestamp > 86400000) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      conversationId = data.conversationId || null;
      messages = (data.messages || []).filter(function (m) { return !m.typing; });
      isOpen = data.isOpen || false;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // ─── Styles ───────────────────────────────────
  var styles = document.createElement("style");
  styles.textContent = [
    "#nexobot-widget{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5;z-index:99999;position:relative}",
    "#nexobot-widget *{box-sizing:border-box;margin:0;padding:0}",
    "#nexobot-bubble{position:fixed;bottom:24px;" + position + ":24px;width:60px;height:60px;border-radius:50%;background:" + color + ";cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.3);transition:transform .2s;z-index:99999;border:none;outline:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}",
    "#nexobot-bubble:hover{transform:scale(1.1)}",
    "#nexobot-bubble svg{width:28px;height:28px;fill:white}",
    "#nexobot-chat{position:fixed;bottom:100px;" + position + ":24px;width:380px;max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 140px);border-radius:16px;background:#111827;border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;z-index:99999}",
    "#nexobot-chat.open{display:flex;animation:nexobot-in .25s ease-out}",
    "@media(prefers-reduced-motion:reduce){#nexobot-chat.open{animation:none}}",
    "@keyframes nexobot-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}",
    "@media(max-width:480px){#nexobot-chat{bottom:0;" + position + ":0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0}}",
    "#nexobot-header{padding:14px 16px;background:" + color + ";display:flex;align-items:center;gap:10px;flex-shrink:0}",
    "#nexobot-header-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    "#nexobot-header-avatar svg{width:18px;height:18px;fill:white}",
    "#nexobot-header-info{flex:1;min-width:0}",
    "#nexobot-header-info h3{color:white;font-size:14px;font-weight:600;margin:0}",
    "#nexobot-header-info p{color:rgba(255,255,255,.7);font-size:11px;margin:0}",
    "#nexobot-close{background:none;border:none;color:white;cursor:pointer;padding:6px;opacity:.7;font-size:20px;line-height:1;border-radius:4px;flex-shrink:0}",
    "#nexobot-close:hover{opacity:1;background:rgba(255,255,255,.1)}",
    "#nexobot-offline{background:#ef4444;color:white;text-align:center;font-size:11px;padding:4px;display:none}",
    "#nexobot-offline.show{display:block}",
    "#nexobot-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}",
    ".nexobot-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5;word-wrap:break-word;overflow-wrap:break-word;white-space:pre-wrap}",
    ".nexobot-msg[dir=auto]{unicode-bidi:plaintext}",
    ".nexobot-msg.bot{background:#1f2937;color:#e5e7eb;border-bottom-left-radius:4px;align-self:flex-start}",
    ".nexobot-msg.user{background:" + color + ";color:white;border-bottom-right-radius:4px;align-self:flex-end}",
    ".nexobot-msg.user.failed{opacity:.6;border:1px dashed #ef4444}",
    ".nexobot-retry{background:none;border:none;color:#ef4444;font-size:11px;cursor:pointer;margin-top:4px;text-decoration:underline}",
    ".nexobot-typing{background:#1f2937;padding:12px 16px;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;display:flex;gap:4px;align-items:center}",
    ".nexobot-typing span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6b7280;animation:nexobot-dot 1.4s infinite}",
    ".nexobot-typing span:nth-child(2){animation-delay:.2s}",
    ".nexobot-typing span:nth-child(3){animation-delay:.4s}",
    "@media(prefers-reduced-motion:reduce){.nexobot-typing span{animation:none;opacity:.5}}",
    "@keyframes nexobot-dot{0%,80%,100%{transform:scale(.4)}40%{transform:scale(1)}}",
    "#nexobot-scroll-btn{display:none;position:absolute;bottom:70px;left:50%;transform:translateX(-50%);background:#374151;color:#9ca3af;border:none;border-radius:20px;padding:4px 12px;font-size:11px;cursor:pointer;z-index:1;box-shadow:0 2px 8px rgba(0,0,0,.3)}",
    "#nexobot-scroll-btn.show{display:block}",
    "#nexobot-input-area{padding:10px 12px;border-top:1px solid rgba(255,255,255,.05);display:flex;gap:8px;align-items:flex-end;flex-shrink:0}",
    "#nexobot-input{flex:1;background:#1f2937;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:9px 12px;color:white;font-size:13px;outline:none;resize:none;max-height:100px;min-height:38px;line-height:1.4;font-family:inherit;overflow-y:auto}",
    "#nexobot-input:focus{border-color:" + color + "}",
    "#nexobot-input::placeholder{color:#6b7280}",
    "#nexobot-input:disabled{opacity:.5;cursor:not-allowed}",
    "#nexobot-charlimit{font-size:10px;color:#ef4444;padding:0 14px 4px;display:none}",
    "#nexobot-charlimit.show{display:block}",
    "#nexobot-send{background:" + color + ";border:none;border-radius:12px;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s;touch-action:manipulation}",
    "#nexobot-send:disabled{opacity:.4;cursor:not-allowed}",
    "#nexobot-send svg{width:18px;height:18px;fill:white}",
    "#nexobot-powered{text-align:center;padding:5px;font-size:10px;color:#4b5563;flex-shrink:0}",
    "#nexobot-powered a{color:#6b7280;text-decoration:none}",
    "#nexobot-messages::-webkit-scrollbar{width:5px}",
    "#nexobot-messages::-webkit-scrollbar-track{background:transparent}",
    "#nexobot-messages::-webkit-scrollbar-thumb{background:#374151;border-radius:4px}",
  ].join("\n");
  document.head.appendChild(styles);

  // ─── Build DOM ────────────────────────────────
  var widget = document.createElement("div");
  widget.id = "nexobot-widget";

  // Bubble button (accessible)
  var bubble = document.createElement("button");
  bubble.id = "nexobot-bubble";
  bubble.setAttribute("aria-label", "Abrir chat");
  bubble.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
  bubble.onclick = toggleChat;

  // Chat window
  var chat = document.createElement("div");
  chat.id = "nexobot-chat";
  chat.setAttribute("role", "dialog");
  chat.setAttribute("aria-label", "Chat con " + escapeHtml(botName));

  chat.innerHTML = [
    '<div id="nexobot-header">',
    '  <div id="nexobot-header-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1.07A7.001 7.001 0 0113 22h-2a7.001 7.001 0 01-6.93-6H3a1 1 0 110-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5 5 5 0 005 5h0a5 5 0 005-5 5 5 0 00-5-5zm-2 4a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/></svg></div>',
    '  <div id="nexobot-header-info"><h3>' + escapeHtml(botName) + "</h3><p>En línea</p></div>",
    '  <button id="nexobot-close" aria-label="Cerrar chat">&times;</button>',
    "</div>",
    '<div id="nexobot-offline">Sin conexión a internet</div>',
    '<div id="nexobot-messages" role="log" aria-live="polite" aria-relevant="additions"></div>',
    '<button id="nexobot-scroll-btn">↓ Nuevo mensaje</button>',
    '<div id="nexobot-charlimit">Máximo ' + MAX_LENGTH + " caracteres</div>",
    '<div id="nexobot-input-area">',
    '  <label for="nexobot-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Escribe un mensaje</label>',
    '  <textarea id="nexobot-input" placeholder="Escribe un mensaje..." rows="1" maxlength="' + MAX_LENGTH + '"></textarea>',
    '  <button id="nexobot-send" aria-label="Enviar mensaje" disabled><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
    "</div>",
    hideBranding ? '' : '<div id="nexobot-powered"><a href="https://nexobot.com" target="_blank" rel="noopener">Powered by NexoBot</a></div>',
  ].join("");

  widget.appendChild(bubble);
  widget.appendChild(chat);
  document.body.appendChild(widget);

  // ─── Element references ───────────────────────
  var messagesContainer = document.getElementById("nexobot-messages");
  var inputEl = document.getElementById("nexobot-input");
  var sendBtn = document.getElementById("nexobot-send");
  var closeBtn = document.getElementById("nexobot-close");
  var scrollBtn = document.getElementById("nexobot-scroll-btn");
  var offlineBanner = document.getElementById("nexobot-offline");
  var charLimitEl = document.getElementById("nexobot-charlimit");

  // ─── Render messages (incremental) ────────────
  var renderedCount = 0;

  function renderMessages(forceFullRender) {
    if (forceFullRender) {
      messagesContainer.innerHTML = "";
      renderedCount = 0;
    }

    for (var i = renderedCount; i < messages.length; i++) {
      var msg = messages[i];
      var div = document.createElement("div");

      if (msg.typing) {
        div.className = "nexobot-typing";
        div.id = msg.id;
        div.setAttribute("role", "status");
        div.setAttribute("aria-label", "El asistente está escribiendo");
        div.innerHTML = "<span></span><span></span><span></span>";
      } else {
        div.className = "nexobot-msg " + msg.role + (msg.failed ? " failed" : "");
        div.setAttribute("dir", "auto");
        div.textContent = msg.text;

        if (msg.failed) {
          var retryBtn = document.createElement("button");
          retryBtn.className = "nexobot-retry";
          retryBtn.textContent = "Reintentar";
          retryBtn.onclick = (function (failedMsg) {
            return function () {
              // Remove failed message and retry
              messages = messages.filter(function (m) { return m.id !== failedMsg.id; });
              renderMessages(true);
              messageQueue.unshift(failedMsg.text);
              processQueue();
            };
          })(msg);
          div.appendChild(retryBtn);
        }
      }

      messagesContainer.appendChild(div);
    }

    renderedCount = messages.length;
    autoScroll();
    saveState();
  }

  function removeTypingIndicator() {
    if (typingIndicatorId) {
      // Remove from messages array
      messages = messages.filter(function (m) { return m.id !== typingIndicatorId; });
      // Remove from DOM
      var el = document.getElementById(typingIndicatorId);
      if (el) el.remove();
      typingIndicatorId = null;
      renderedCount = messages.length;
    }
  }

  function addTypingIndicator() {
    removeTypingIndicator(); // Ensure only one exists
    var id = generateId();
    typingIndicatorId = id;
    messages.push({ id: id, role: "bot", typing: true });
    renderMessages(false);
  }

  // ─── Auto-scroll (smart) ──────────────────────
  function isNearBottom() {
    return (
      messagesContainer.scrollHeight -
        messagesContainer.scrollTop -
        messagesContainer.clientHeight <
      80
    );
  }

  function autoScroll() {
    if (isNearBottom()) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      scrollBtn.classList.remove("show");
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    scrollBtn.classList.remove("show");
  }

  messagesContainer.addEventListener("scroll", function () {
    if (isNearBottom()) {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.onclick = scrollToBottom;

  // ─── Toggle chat ──────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chat.classList.add("open");
      renderMessages(true);
      scrollToBottom();
      // Only auto-focus if user clicked bubble (not restored from storage)
      inputEl.focus();
      bubble.setAttribute("aria-label", "Cerrar chat");
    } else {
      closeChat();
    }
    saveState();
  }

  function closeChat() {
    isOpen = false;
    chat.classList.remove("open");
    bubble.setAttribute("aria-label", "Abrir chat");
    saveState();
  }

  closeBtn.onclick = function (e) {
    e.stopPropagation();
    closeChat();
  };

  // Escape key closes chat
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeChat();
  });

  // ─── Input handling ───────────────────────────
  function updateSendButton() {
    var text = sanitizeText(inputEl.value);
    sendBtn.disabled = text.length === 0 || isSending;

    // Character limit warning
    if (inputEl.value.length > MAX_LENGTH - 200) {
      charLimitEl.textContent =
        inputEl.value.length + "/" + MAX_LENGTH + " caracteres";
      charLimitEl.classList.add("show");
    } else {
      charLimitEl.classList.remove("show");
    }
  }

  // Auto-resize textarea
  inputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
    updateSendButton();
  });

  // Enter sends, Shift+Enter = newline
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) queueMessage();
    }
  });

  sendBtn.onclick = function () {
    if (!sendBtn.disabled) queueMessage();
  };

  // ─── Message queue (serialize sends) ──────────
  function queueMessage() {
    var text = sanitizeText(inputEl.value);
    if (!text || text.length > MAX_LENGTH) return;

    // Cooldown check
    var now = Date.now();
    if (now - lastSendTime < SEND_COOLDOWN) return;
    lastSendTime = now;

    // Add user message to UI immediately
    messages.push({ id: generateId(), role: "user", text: text });
    renderMessages(false);
    scrollToBottom();

    // Clear input
    inputEl.value = "";
    inputEl.style.height = "auto";
    updateSendButton();

    // Queue the message text
    messageQueue.push(text);

    // Process if not already sending
    if (!isSending) processQueue();
  }

  async function processQueue() {
    if (isSending || messageQueue.length === 0) return;

    isSending = true;
    inputEl.disabled = true;
    inputEl.placeholder = "Esperando respuesta...";
    updateSendButton();

    var text = messageQueue.shift();

    // Add typing indicator
    addTypingIndicator();

    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function () {
        controller.abort();
      }, FETCH_TIMEOUT);

      var res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          businessId: businessId,
          conversationId: conversationId,
          message: text,
        }),
      });

      clearTimeout(timeoutId);

      removeTypingIndicator();

      if (!res.ok) {
        var errorMsg = "Lo siento, hubo un error. Intenta de nuevo.";
        if (res.status === 429) {
          var errorData = null;
          try { errorData = await res.json(); } catch(e) {}
          if (errorData && errorData.code === "PLAN_LIMIT") {
            errorMsg = "Este negocio ha alcanzado su límite mensual. Por favor contacta directamente.";
          } else {
            errorMsg = "Estás enviando mensajes muy rápido. Espera unos segundos.";
          }
        } else if (res.status === 400)
          errorMsg = "El mensaje no es válido. Intenta con uno más corto.";
        else if (res.status === 404)
          errorMsg = "Este chat no está disponible en este momento.";

        messages.push({ id: generateId(), role: "bot", text: errorMsg });
      } else {
        var data = await res.json();
        conversationId = data.conversationId;
        messages.push({
          id: generateId(),
          role: "bot",
          text: data.message,
        });
      }
    } catch (e) {
      removeTypingIndicator();

      var errText;
      if (e.name === "AbortError") {
        errText = "La respuesta tardó demasiado. Por favor intenta de nuevo.";
      } else if (!navigator.onLine) {
        errText = "Sin conexión a internet. Verifica tu conexión e intenta de nuevo.";
      } else {
        errText = "No se pudo conectar. Intenta de nuevo.";
      }

      // Mark the last user message as failed
      for (var i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user" && !messages[i].failed) {
          messages[i].failed = true;
          break;
        }
      }
      messages.push({ id: generateId(), role: "bot", text: errText });
    }

    renderMessages(false);
    scrollToBottom();
    saveState();

    isSending = false;
    inputEl.disabled = false;
    inputEl.placeholder = "Escribe un mensaje...";
    inputEl.focus();
    updateSendButton();

    // Process next message in queue
    if (messageQueue.length > 0) {
      setTimeout(processQueue, 300);
    }
  }

  // ─── Online/Offline detection ─────────────────
  window.addEventListener("online", function () {
    offlineBanner.classList.remove("show");
    inputEl.disabled = false;
    updateSendButton();
  });

  window.addEventListener("offline", function () {
    offlineBanner.classList.add("show");
    inputEl.disabled = true;
    updateSendButton();
  });

  // ─── Init ─────────────────────────────────────
  loadState();

  // Always ensure greeting exists
  if (messages.length === 0) {
    messages.push({ id: generateId(), role: "bot", text: greeting });
  }

  // Restore open state
  if (isOpen) {
    chat.classList.add("open");
    renderMessages(true);
    scrollToBottom();
  }

  updateSendButton();
})();
