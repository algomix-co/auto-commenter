# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "Contextual Reply Assistant" that generates personalized replies to selected text using various LLM providers (OpenAI, Anthropic, Gemini, OpenRouter). It's a pure JavaScript extension with no build process or dependencies.

## Development Commands

Since this is a simple Chrome extension with no build process:

- **Load Extension**: Chrome → Extensions → Developer mode → Load unpacked → Select this directory
- **Reload Extension**: Click the reload button in Chrome Extensions page after making changes
- **Debug Background Script**: Right-click extension icon → Manage Extension → Inspect service worker
- **Debug Content Script**: F12 → Console on any webpage where extension is active
- **Debug Sidebar**: Right-click in sidebar → Inspect (opens DevTools for iframe)
- **View Storage**: Chrome DevTools → Application → Storage → Local Storage → chrome-extension://[id]

## Architecture

### Component Communication Flow
```
User Selection → background.js → content.js → sidebar iframe → LLM API
```

### Key Files and Their Roles

- **manifest.json**: Chrome extension configuration (Manifest V3)
- **background.js**: Service worker handling context menu and keyboard shortcuts
- **content.js**: Injects sidebar iframe on user action
- **sidebar.html**: UI for displaying selected text and generating replies
- **settings.html**: Popup for configuring LLM provider and API key

### Message Passing

1. Background script captures text selection via context menu or keyboard shortcut (Ctrl/Cmd+Shift+Y)
2. Sends message to content script: `{action: "showSidebar", selectedText: "..."}`
3. Content script injects iframe and posts message to sidebar
4. Sidebar makes direct API calls to LLM providers

### API Integration

The extension supports multiple LLM providers with provider-specific endpoints:
- **OpenAI**: `/v1/chat/completions` with model `gpt-3.5-turbo`
- **Anthropic**: `/v1/messages` with model `claude-3-sonnet-20240229`
- **Gemini**: `/v1beta/models/gemini-pro:generateContent`
- **OpenRouter**: OpenAI-compatible endpoint with model `openai/gpt-3.5-turbo`

API keys are stored in `chrome.storage.local` as:
- `llm_provider`: Selected provider name
- `llm_api_key`: API key for the provider

### Tone System

The extension generates replies in three distinct tones:
- **Friendly**: Warm, conversational responses
- **Professional**: Formal, business-appropriate responses  
- **Casual**: Relaxed, informal responses

Each tone is implemented via prompt engineering in the `generate()` function in sidebar.html:63.

### Chrome APIs Used

- `chrome.storage.local`: Store API configuration
- `chrome.contextMenus`: Right-click menu integration  
- `chrome.commands`: Keyboard shortcuts (Ctrl/Cmd+Shift+Y)
- `chrome.scripting`: Execute scripts in tabs
- `chrome.runtime`: Message passing between components

## Important Implementation Details

### Response Parsing
Each LLM provider returns responses in different formats:
- **OpenAI/OpenRouter**: `data.choices[0].message.content`
- **Anthropic**: `data.content` (array of content objects)
- **Gemini**: `data.candidates[0].content.parts[0].text`

Response parsing logic is in sidebar.html:61-63.

### Cross-Origin Requests
The extension makes direct API calls from the sidebar iframe to LLM providers. This requires:
- `host_permissions: ["<all_urls>"]` in manifest.json
- Proper CORS handling by the APIs (all supported providers allow extension origins)

### Iframe Communication
The content script and sidebar communicate via `postMessage`:
- Content script sends: `{type: "selectedText", text: "..."}`
- Sidebar receives via `window.addEventListener("message", ...)` in sidebar.html:27

### State Management
- No persistent state beyond API configuration
- Selected text is passed fresh on each activation
- Reply generation is stateless (no conversation history)