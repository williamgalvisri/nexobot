(function () {
  "use strict";

  // Config from script tag
  var script = document.currentScript;
  var businessId = script.getAttribute("data-business-id");
  var color = script.getAttribute("data-color") || "#6366f1";
  var position = script.getAttribute("data-position") || "right";
  var greeting =
    script.getAttribute("data-greeting") ||
    "¡Hola! ¿En qué puedo ayudarte?";
  var botName = script.getAttribute("data-bot-name") || "Asistente";
  var apiUrl =
    script.getAttribute("data-api-url") || "https://nexobot.com/api/chat";

  if (!businessId) {
    console.error("NexoBot: data-business-id is required");
    return;
  }

  // State
  var isOpen = false;
  var conversationId = null;
  var messages = [{ role: "bot", text: greeting }];

  // Styles
  var styles = document.createElement("style");
  styles.textContent =
    "#nexobot-widget{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5;z-index:99999}" +
    "#nexobot-bubble{position:fixed;bottom:24px;" +
    position +
    ":24px;width:60px;height:60px;border-radius:50%;background:" +
    color +
    ";cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.3);transition:transform .2s;z-index:99999}" +
    "#nexobot-bubble:hover{transform:scale(1.1)}" +
    "#nexobot-bubble svg{width:28px;height:28px;fill:white}" +
    "#nexobot-chat{position:fixed;bottom:100px;" +
    position +
    ":24px;width:380px;max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 140px);border-radius:16px;background:#111827;border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;z-index:99999}" +
    "#nexobot-chat.open{display:flex;animation:nexobot-in .3s ease-out}" +
    "@keyframes nexobot-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}" +
    "#nexobot-header{padding:16px;background:" +
    color +
    ";display:flex;align-items:center;gap:12px}" +
    "#nexobot-header-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center}" +
    "#nexobot-header-avatar svg{width:20px;height:20px;fill:white}" +
    "#nexobot-header-info h3{margin:0;color:white;font-size:14px;font-weight:600}" +
    "#nexobot-header-info p{margin:0;color:rgba(255,255,255,.7);font-size:11px}" +
    "#nexobot-close{margin-left:auto;background:none;border:none;color:white;cursor:pointer;padding:4px;opacity:.7}" +
    "#nexobot-close:hover{opacity:1}" +
    "#nexobot-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}" +
    ".nexobot-msg{max-width:80%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.4;word-wrap:break-word}" +
    ".nexobot-msg.bot{background:#1f2937;color:#e5e7eb;border-bottom-left-radius:4px;align-self:flex-start}" +
    ".nexobot-msg.user{background:" +
    color +
    ";color:white;border-bottom-right-radius:4px;align-self:flex-end}" +
    ".nexobot-msg.typing{background:#1f2937;color:#9ca3af}" +
    ".nexobot-typing-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#6b7280;margin:0 2px;animation:nexobot-dot 1.4s infinite}" +
    ".nexobot-typing-dots span:nth-child(2){animation-delay:.2s}" +
    ".nexobot-typing-dots span:nth-child(3){animation-delay:.4s}" +
    "@keyframes nexobot-dot{0%,80%,100%{transform:scale(.4)}40%{transform:scale(1)}}" +
    "#nexobot-input-area{padding:12px;border-top:1px solid rgba(255,255,255,.05);display:flex;gap:8px}" +
    "#nexobot-input{flex:1;background:#1f2937;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 14px;color:white;font-size:13px;outline:none;resize:none}" +
    "#nexobot-input:focus{border-color:" +
    color +
    "}" +
    "#nexobot-input::placeholder{color:#6b7280}" +
    "#nexobot-send{background:" +
    color +
    ";border:none;border-radius:12px;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
    "#nexobot-send:disabled{opacity:.5;cursor:not-allowed}" +
    "#nexobot-send svg{width:18px;height:18px;fill:white}" +
    "#nexobot-powered{text-align:center;padding:6px;font-size:10px;color:#4b5563}" +
    "#nexobot-powered a{color:#6b7280;text-decoration:none}";

  document.head.appendChild(styles);

  // Widget container
  var widget = document.createElement("div");
  widget.id = "nexobot-widget";

  // Bubble
  var bubble = document.createElement("div");
  bubble.id = "nexobot-bubble";
  bubble.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
  bubble.onclick = toggleChat;

  // Chat window
  var chat = document.createElement("div");
  chat.id = "nexobot-chat";

  chat.innerHTML =
    '<div id="nexobot-header">' +
    '<div id="nexobot-header-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1.07A7.001 7.001 0 0113 22h-2a7.001 7.001 0 01-6.93-6H3a1 1 0 110-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5 5 5 0 005 5h0a5 5 0 005-5 5 5 0 00-5-5zm-2 4a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/></svg></div>' +
    '<div id="nexobot-header-info"><h3>' +
    botName +
    "</h3><p>En línea</p></div>" +
    '<button id="nexobot-close" onclick="document.getElementById(\'nexobot-chat\').classList.remove(\'open\')">&times;</button>' +
    "</div>" +
    '<div id="nexobot-messages"></div>' +
    '<div id="nexobot-input-area">' +
    '<input type="text" id="nexobot-input" placeholder="Escribe un mensaje..." />' +
    '<button id="nexobot-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
    "</div>" +
    '<div id="nexobot-powered"><a href="https://nexobot.com" target="_blank">Powered by NexoBot</a></div>';

  widget.appendChild(bubble);
  widget.appendChild(chat);
  document.body.appendChild(widget);

  // Render messages
  function renderMessages() {
    var container = document.getElementById("nexobot-messages");
    container.innerHTML = "";
    messages.forEach(function (msg) {
      var div = document.createElement("div");
      div.className = "nexobot-msg " + msg.role;
      if (msg.typing) {
        div.className += " typing";
        div.innerHTML =
          '<div class="nexobot-typing-dots"><span></span><span></span><span></span></div>';
      } else {
        div.textContent = msg.text;
      }
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  function toggleChat() {
    var chatEl = document.getElementById("nexobot-chat");
    isOpen = !isOpen;
    if (isOpen) {
      chatEl.classList.add("open");
      renderMessages();
      document.getElementById("nexobot-input").focus();
    } else {
      chatEl.classList.remove("open");
    }
  }

  // Send message
  async function sendMessage() {
    var input = document.getElementById("nexobot-input");
    var text = input.value.trim();
    if (!text) return;

    input.value = "";
    messages.push({ role: "user", text: text });

    // Show typing indicator
    messages.push({ role: "bot", typing: true });
    renderMessages();

    try {
      var res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: businessId,
          conversationId: conversationId,
          message: text,
        }),
      });

      var data = await res.json();
      conversationId = data.conversationId;

      // Remove typing indicator, add response
      messages.pop();
      messages.push({ role: "bot", text: data.message });
    } catch (e) {
      messages.pop();
      messages.push({
        role: "bot",
        text: "Lo siento, hubo un error. Por favor intenta de nuevo.",
      });
    }

    renderMessages();
  }

  // Event listeners
  document.getElementById("nexobot-send").onclick = sendMessage;
  document.getElementById("nexobot-input").onkeydown = function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  renderMessages();
})();
