document.addEventListener("DOMContentLoaded", () => {
  // Check if chrome.storage is available on load
  if (!chrome.storage || !chrome.storage.local) {
    console.error("chrome.storage.local is not available on load");
    alert("Chrome storage is not available. Extension may not be loaded properly.");
    return;
  }
  
  chrome.storage.local.get(["llm_provider","llm_api_key","llm_model"], data => {
    if (chrome.runtime.lastError) {
      console.error("Error loading settings:", chrome.runtime.lastError);
    } else {
      if (data.llm_provider) {
        document.getElementById("provider").value = data.llm_provider;
        toggleModelSection(data.llm_provider);
      }
      if (data.llm_api_key) {
        document.getElementById("apikey").value = data.llm_api_key;
      }
      if (data.llm_model) {
        document.getElementById("model").value = data.llm_model;
      }
    }
  });

  // Show/hide model section based on provider
  document.getElementById("provider").addEventListener("change", (e) => {
    toggleModelSection(e.target.value);
  });

  document.getElementById("save").addEventListener("click", async () => {
    const provider = document.getElementById("provider").value;
    const apikey = document.getElementById("apikey").value.trim();
    const model = document.getElementById("model").value.trim();
    
    if (!apikey) {
      alert("Please enter an API key");
      return;
    }

    if (provider === "openrouter" && !model) {
      alert("Please enter a model ID for OpenRouter");
      return;
    }

    const saveButton = document.getElementById("save");
    saveButton.disabled = true;
    saveButton.textContent = "Validating...";
    
    try {
      // Try to validate the API key
      const isValid = await validateApiKey(provider, apikey);
      
      if (isValid) {
        // Save if validation succeeds
        const saveData = { llm_provider: provider, llm_api_key: apikey };
        if (provider === "openrouter" && model) {
          saveData.llm_model = model;
        }
        chrome.storage.local.set(saveData, () => {
          alert("Settings saved successfully!");
        });
      } else {
        // Ask user if they want to save anyway
        const saveAnyway = confirm("API key validation failed. Do you want to save it anyway?");
        if (saveAnyway) {
          const saveData = { llm_provider: provider, llm_api_key: apikey };
          if (provider === "openrouter" && model) {
            saveData.llm_model = model;
          }
          chrome.storage.local.set(saveData, () => {
            alert("Settings saved (validation failed)");
          });
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
      // Ask user if they want to save anyway when validation fails
      const saveAnyway = confirm("Could not validate API key due to an error. Do you want to save it anyway?");
      if (saveAnyway) {
        const saveData = { llm_provider: provider, llm_api_key: apikey };
        if (provider === "openrouter" && model) {
          saveData.llm_model = model;
        }
        chrome.storage.local.set(saveData, () => {
          alert("Settings saved (validation error)");
        });
      }
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save Settings";
    }
  });
});

async function validateApiKey(provider, apikey) {
  let url, headers, body;
  
  if (provider === "openai") {
    url = "https://api.openai.com/v1/models";
    headers = { "Authorization": `Bearer ${apikey}` };
  } else if (provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = { 
      "x-api-key": apikey,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01"
    };
    body = JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [{ role: "user", content: "Hi" }]
    });
  } else if (provider === "gemini") {
    url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apikey}`;
    headers = {};
  } else if (provider === "openrouter") {
    url = "https://openrouter.ai/api/v1/models";
    headers = { "Authorization": `Bearer ${apikey}` };
  }

  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers,
    body
  });

  return response.ok;
}

function toggleModelSection(provider) {
  const modelSection = document.getElementById("model-section");
  if (provider === "openrouter") {
    modelSection.style.display = "block";
  } else {
    modelSection.style.display = "none";
  }
}