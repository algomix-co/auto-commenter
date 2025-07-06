chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "generateReply",
      title: "Generate Contextual Reply",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generateReply") {
      // First try to send message to existing content script
      chrome.tabs.sendMessage(tab.id, {
        action: "generate_reply",
        selectedText: info.selectionText
      }).catch(() => {
        // If that fails, inject the content script and try again
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).then(() => {
          chrome.tabs.sendMessage(tab.id, {
            action: "generate_reply",
            selectedText: info.selectionText
          });
        }).catch(err => {
          console.error("Failed to inject content script:", err);
        });
      });
    }
  });
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === "open-sidebar") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            const sel = window.getSelection().toString();
            if (sel) {
              return sel;
            } else {
              alert("Please select some text first.");
              return null;
            }
          }
        }, (results) => {
          if (results && results[0] && results[0].result) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "generate_reply",
              selectedText: results[0].result
            }).catch(() => {
              // If content script not available, inject it first
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
              }).then(() => {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: "generate_reply",
                  selectedText: results[0].result
                });
              });
            });
          }
        });
      });
    }
  });
  