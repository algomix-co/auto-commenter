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
      width: 420px;
      height: 100%;
      z-index: ${sidebarZIndex};
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 20px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease-in-out;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `;

    const header = document.createElement("div");
    header.style = `
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      position: relative;
      z-index: 10;
      border-radius: 0 0 16px 16px;
      margin-bottom: 8px;
    `;

    const title = document.createElement("span");
    title.textContent = "Reply Assistant";
    title.style = `
      font-weight: 700;
      font-size: 16px;
      background: linear-gradient(135deg, #4a9eff, #00d4aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `;

    const controls = document.createElement("div");
    controls.style = "display: flex; gap: 4px;";

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "−";
    toggleBtn.title = "Minimize";
    toggleBtn.style = `
      background: linear-gradient(135deg, #4a9eff 0%, #00d4aa 100%);
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Add hover effect
    toggleBtn.addEventListener("mouseenter", () => {
      toggleBtn.style.transform = "scale(1.1)";
      toggleBtn.style.boxShadow = "0 2px 8px rgba(74, 158, 255, 0.3)";
    });
    
    toggleBtn.addEventListener("mouseleave", () => {
      toggleBtn.style.transform = "scale(1)";
      toggleBtn.style.boxShadow = "none";
    });

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.title = "Close";
    closeBtn.style = `
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Add hover effect
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.transform = "scale(1.1)";
      closeBtn.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.3)";
    });
    
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.transform = "scale(1)";
      closeBtn.style.boxShadow = "none";
    });

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
      width: 6px;
      height: 100%;
      background: linear-gradient(135deg, #4a9eff, #00d4aa);
      cursor: ew-resize;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    `;
    
    // Add hover effect to resize handle
    resizeHandle.addEventListener("mouseenter", () => {
      resizeHandle.style.opacity = "1";
    });
    
    resizeHandle.addEventListener("mouseleave", () => {
      resizeHandle.style.opacity = "0.7";
    });

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

    // Make draggable (only when not collapsed)
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    header.addEventListener("mousedown", (e) => {
      // Don't allow dragging when collapsed or when clicking on buttons
      if (isCollapsed || e.target.closest('button')) {
        return;
      }
      
      isDragging = true;
      startY = e.clientY;
      startTop = container.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      e.preventDefault();
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

    // Make resizable (only when not collapsed)
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener("mousedown", (e) => {
      // Don't allow resizing when collapsed
      if (isCollapsed) {
        return;
      }
      
      isResizing = true;
      startX = e.clientX;
      startWidth = container.offsetWidth;
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeUp);
      e.preventDefault();
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

    // Toggle collapse with sliding animation
    let isCollapsed = false;
    
    function toggleSidebar() {
      if (isCollapsed) {
        // Expand the sidebar
        container.style.transform = "translateX(0)";
        toggleBtn.innerHTML = "−";
        toggleBtn.title = "Minimize";
        isCollapsed = false;
      } else {
        // Collapse the sidebar by sliding it out
        const containerWidth = container.offsetWidth;
        container.style.transform = `translateX(${containerWidth - 40}px)`; // Leave 40px visible for the toggle button
        toggleBtn.innerHTML = "+";
        toggleBtn.title = "Expand";
        isCollapsed = true;
      }
    }
    
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
    
    // Allow clicking on the collapsed sidebar area to expand it
    container.addEventListener("click", (e) => {
      if (isCollapsed && !e.target.closest('iframe') && !e.target.closest('button')) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      }
    });
    
    // Add visual feedback for collapsed state
    container.addEventListener("mouseenter", () => {
      if (isCollapsed) {
        container.style.cursor = "pointer";
        container.style.opacity = "0.9";
      }
    });
    
    container.addEventListener("mouseleave", () => {
      if (isCollapsed) {
        container.style.cursor = "default";
        container.style.opacity = "1";
      }
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
    
    // Prevent text selection during sidebar interactions
    document.addEventListener("selectstart", (e) => {
      if (e.target.closest('#reply-sidebar-container')) {
        e.preventDefault();
        return false;
      }
    });
    
    // Clear any existing selection when interacting with sidebar
    container.addEventListener("mousedown", (e) => {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          selection.removeAllRanges();
        }
      }
    });
  }
  