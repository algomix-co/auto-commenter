let selectedText = "";

function setActiveTone(activeButtonId) {
  document.querySelectorAll('.tone-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(activeButtonId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("friendly-btn").addEventListener("click", () => {
    setActiveTone('friendly-btn');
    generate('friendly');
  });
  document.getElementById("professional-btn").addEventListener("click", () => {
    setActiveTone('professional-btn');
    generate('professional');
  });
  document.getElementById("casual-btn").addEventListener("click", () => {
    setActiveTone('casual-btn');
    generate('casual');
  });
  document.getElementById("copy-btn").addEventListener("click", copyToClipboard);
  
  // Clear custom prompt button
  document.getElementById("clear-prompt").addEventListener("click", () => {
    document.getElementById("custom-prompt").value = "";
    chrome.storage.local.remove(["custom_prompt"]);
  });
  
  // Auto-save custom prompt as user types (with debounce)
  let saveTimeout;
  document.getElementById("custom-prompt").addEventListener("input", (e) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      chrome.storage.local.set({ custom_prompt: e.target.value.trim() });
    }, 1000); // Save after 1 second of no typing
  });
});

window.addEventListener("message", (e) => {
  if (e.data.type === "selectedText") {
    selectedText = e.data.text;
    document.getElementById("context").textContent = selectedText;
    
    // Load saved custom prompt
    chrome.storage.local.get(["custom_prompt"], (data) => {
      if (data.custom_prompt) {
        document.getElementById("custom-prompt").value = data.custom_prompt;
      }
    });
  }
});

async function generate(tone) {
  if (!selectedText) {
    document.getElementById("reply").value = "No text selected";
    return;
  }

  const { llm_api_key: apiKey, llm_provider: provider, llm_model: model } = 
    await new Promise(resolve => chrome.storage.local.get(["llm_api_key","llm_provider","llm_model"], resolve));

  if (!apiKey) {
    document.getElementById("reply").value = "Please configure your API key in the extension settings";
    return;
  }

  document.getElementById("reply").value = "Generating response...";
  document.getElementById("reply").classList.add("loading");

  try {
    // Get custom instructions if provided
    const customPrompt = document.getElementById("custom-prompt").value.trim();
    
    // Build the prompt with custom instructions
    let prompt = `Reply in a ${tone} tone to the following text:\n${selectedText}`;
    
    if (customPrompt) {
      prompt = `Reply in a ${tone} tone to the following text, following these additional instructions: "${customPrompt}"\n\nText to reply to:\n${selectedText}`;
    }

    let url, body, headers = { "Content-Type": "application/json" };
    if (provider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";
      headers.Authorization = `Bearer ${apiKey}`;
      body = { model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] };
    } else if (provider === "anthropic") {
      url = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      body = { model: "claude-3-sonnet-20240229", max_tokens: 300, messages: [{ role: "user", content: prompt }] };
    } else if (provider === "gemini") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      body = { contents: [{ parts: [{ text: prompt }] }] };
    } else {
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers.Authorization = `Bearer ${apiKey}`;
      body = { model: model || "openai/gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] };
    }

    const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
    }

    let reply;
    if (provider === "gemini") {
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    } else if (provider === "anthropic") {
      reply = data.content?.[0]?.text || "No response generated";
    } else {
      reply = data.choices?.[0]?.message?.content || "No response generated";
    }

    document.getElementById("reply").value = reply;
  } catch (error) {
    console.error("Generation error:", error);
    document.getElementById("reply").value = `Error: ${error.message}`;
  } finally {
    document.getElementById("reply").classList.remove("loading");
  }
}

function copyToClipboard() {
  const replyTextarea = document.getElementById("reply");
  const copyBtn = document.getElementById("copy-btn");
  
  if (!replyTextarea.value || replyTextarea.value.trim() === "") {
    copyBtn.textContent = "No text to copy";
    copyBtn.style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
    setTimeout(() => {
      copyBtn.textContent = "Copy to Clipboard";
      copyBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    }, 2000);
    return;
  }
  
  // Use the modern Clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(replyTextarea.value).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.style.background = "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)";
      setTimeout(() => {
        copyBtn.textContent = "Copy to Clipboard";
        copyBtn.style.background = "linear-gradient(135deg, #00d4aa 0%, #4a9eff 100%)";
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      fallbackCopy();
    });
  } else {
    // Fallback for older browsers
    fallbackCopy();
  }
  
  function fallbackCopy() {
    try {
      replyTextarea.select();
      replyTextarea.setSelectionRange(0, 99999); // For mobile devices
      const successful = document.execCommand('copy');
      
      if (successful) {
        copyBtn.textContent = "Copied!";
        copyBtn.style.background = "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)";
      } else {
        copyBtn.textContent = "Copy failed";
        copyBtn.style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
      }
      
      setTimeout(() => {
        copyBtn.textContent = "Copy to Clipboard";
        copyBtn.style.background = "linear-gradient(135deg, #00d4aa 0%, #4a9eff 100%)";
      }, 2000);
    } catch (err) {
      console.error("Fallback copy failed:", err);
      copyBtn.textContent = "Copy failed";
      copyBtn.style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
      setTimeout(() => {
        copyBtn.textContent = "Copy to Clipboard";
        copyBtn.style.background = "linear-gradient(135deg, #00d4aa 0%, #4a9eff 100%)";
      }, 2000);
    }
  }
}