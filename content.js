chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "generate_reply") {
      console.log("Received message to generate reply for:", message.selectedText);
      injectSidebar(message.selectedText);
    }
  });

  // Also listen for messages from iframe contexts (for popups/modals)
  window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'generate_reply' && event.data.selectedText) {
      console.log("Received cross-frame message:", event.data);
      injectSidebar(event.data.selectedText);
    }
  });
  
  function injectSidebar(selectedText) {
    // Remove any existing sidebar
    const existing = document.getElementById("reply-sidebar-container");
    if (existing) {
      existing.remove();
    }
    
    // Find the highest z-index on the page to ensure sidebar appears on top
    let maxZIndex = 0;
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
      if (zIndex > maxZIndex) maxZIndex = zIndex;
    });
    
    // Ensure our sidebar is always on top
    const sidebarZIndex = Math.max(maxZIndex + 100, 2147483647);
  
    const container = document.createElement("div");
    container.id = "reply-sidebar-container";
    container.style = `
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100%;
      z-index: ${sidebarZIndex};
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 10px rgba(0,0,0,0.3);
      background: white;
      border-left: 1px solid #ddd;
    `;

    const header = document.createElement("div");
    header.style = `
      background: #f0f0f0;
      padding: 8px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    `;

    const title = document.createElement("span");
    title.textContent = "Reply Assistant";
    title.style = "font-weight: bold; font-size: 14px;";

    const controls = document.createElement("div");
    controls.style = "display: flex; gap: 4px;";

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "−";
    toggleBtn.style = `
      background: none;
      border: 1px solid #ccc;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style = `
      background: none;
      border: 1px solid #ccc;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    `;

    const iframe = document.createElement("iframe");
    iframe.id = "reply-sidebar";
    iframe.src = chrome.runtime.getURL("sidebar.html");
    iframe.style = `
      border: none;
      width: 100%;
      height: 100%;
      flex: 1;
    `;

    const resizeHandle = document.createElement("div");
    resizeHandle.style = `
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #ddd;
      cursor: ew-resize;
    `;

    header.appendChild(title);
    controls.appendChild(toggleBtn);
    controls.appendChild(closeBtn);
    header.appendChild(controls);
    
    container.appendChild(header);
    container.appendChild(iframe);
    container.appendChild(resizeHandle);
    
    // Find the best place to append the sidebar
    const appendTarget = document.body || document.documentElement || document.querySelector('html');
    if (appendTarget) {
      appendTarget.appendChild(container);
    } else {
      console.error("Could not find a suitable element to append sidebar to");
    }

    // Make draggable
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startTop = container.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const newTop = startTop + (e.clientY - startY);
      container.style.top = Math.max(0, Math.min(newTop, window.innerHeight - 100)) + "px";
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    // Make resizable
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = container.offsetWidth;
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeUp);
    });

    function onResizeMove(e) {
      if (!isResizing) return;
      const newWidth = startWidth + (startX - e.clientX);
      container.style.width = Math.max(300, Math.min(newWidth, window.innerWidth - 50)) + "px";
    }

    function onResizeUp() {
      isResizing = false;
      document.removeEventListener("mousemove", onResizeMove);
      document.removeEventListener("mouseup", onResizeUp);
    }

    // Toggle collapse
    let isCollapsed = false;
    let originalHeight = "100%";
    toggleBtn.addEventListener("click", () => {
      if (isCollapsed) {
        iframe.style.display = "block";
        toggleBtn.innerHTML = "−";
        container.style.height = originalHeight;
        container.style.minHeight = "200px";
      } else {
        originalHeight = container.style.height || "100%";
        iframe.style.display = "none";
        toggleBtn.innerHTML = "+";
        container.style.height = "auto";
        container.style.minHeight = "auto";
      }
      isCollapsed = !isCollapsed;
    });

    // Close button
    closeBtn.addEventListener("click", () => {
      container.remove();
    });

    iframe.onload = () => {
      iframe.contentWindow.postMessage(
        { type: "selectedText", text: selectedText },
        "*"
      );
    };
  }
  