# Contextual Reply Assistant - Chrome Extension Setup Guide

## 🚀 Overview

The Contextual Reply Assistant is a Chrome extension that generates personalized replies to selected text using various AI language models. It supports multiple LLM providers including OpenAI, Anthropic, Google Gemini, and OpenRouter.

## 📋 Features

- **Multiple LLM Providers**: Choose from OpenAI, Anthropic, Gemini, or OpenRouter
- **Three Tone Options**: Generate replies in Friendly, Professional, or Casual tones
- **Custom Instructions**: Add specific instructions for personalized responses
- **Flexible Model Selection**: For OpenRouter, use any available model by entering its ID
- **Easy Access**: Right-click context menu or keyboard shortcut (Ctrl/Cmd+Shift+Y)
- **Copy to Clipboard**: One-click copying of generated replies

## 🛠️ Installation

### Step 1: Download the Extension
1. Download or clone the extension files to your computer
2. Extract the files to a folder (e.g., `contextual-reply-assistant`)

### Step 2: Install in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the folder containing the extension files
5. The extension should now appear in your extensions list

### Step 3: Pin the Extension (Optional)
1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Contextual Reply Assistant" and click the pin icon
3. The extension icon will now appear in your toolbar

## ⚙️ Configuration

### Step 1: Open Settings
Click the extension icon in your toolbar to open the settings popup.

### Step 2: Choose Your LLM Provider
Select from the available providers:
- **OpenAI**: Access to GPT models
- **Anthropic**: Access to Claude models
- **Gemini**: Google's AI models
- **OpenRouter**: Access to multiple models from various providers

### Step 3: Enter API Key
Enter your API key for the selected provider. Here's how to get API keys:

#### OpenAI
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in the extension settings

#### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com/account/keys)
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key and paste it in the extension settings

#### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key and paste it in the extension settings

#### OpenRouter
1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key and paste it in the extension settings

### Step 4: Configure Model (OpenRouter Only)
If you selected OpenRouter, you'll see a "Model ID" field. Enter the model you want to use:

**Popular Model IDs:**
- `openai/gpt-4` - GPT-4
- `openai/gpt-3.5-turbo` - GPT-3.5 Turbo (default)
- `anthropic/claude-3-opus` - Claude 3 Opus
- `anthropic/claude-3-sonnet` - Claude 3 Sonnet
- `google/gemini-pro` - Gemini Pro
- `meta-llama/llama-3-70b-instruct` - Llama 3 70B
- `mistralai/mixtral-8x7b-instruct` - Mixtral 8x7B

> **Note**: You can find all available models at [OpenRouter Models](https://openrouter.ai/models)

### Step 5: Save Settings
Click "Save Settings" to save your configuration. The extension will validate your API key.

## 🎯 How to Use

### Method 1: Right-Click Context Menu
1. Select any text on a webpage
2. Right-click on the selected text
3. Choose "Generate Reply" from the context menu
4. The sidebar will open with your selected text

### Method 2: Keyboard Shortcut
1. Select any text on a webpage
2. Press **Ctrl+Shift+Y** (Windows/Linux) or **Cmd+Shift+Y** (Mac)
3. The sidebar will open with your selected text

### Generating Replies
1. Once the sidebar opens, you'll see your selected text
2. (Optional) Add custom instructions in the text area
3. Click one of the tone buttons:
   - **Friendly**: Warm, conversational responses
   - **Professional**: Formal, business-appropriate responses
   - **Casual**: Relaxed, informal responses
4. Wait for the AI to generate your reply
5. Click "Copy to Clipboard" to copy the generated response

## 🔧 Advanced Features

### Custom Instructions
Use the custom instructions field to add specific requirements:
- "Reply as a startup founder"
- "Include technical details"
- "Keep it under 50 words"
- "Use a humorous tone"
- "Respond in Spanish"

### Auto-Save Custom Instructions
Your custom instructions are automatically saved as you type and will persist across sessions.

### Clear Custom Instructions
Click the "Clear" button next to the custom instructions field to remove saved instructions.

## 🛠️ Troubleshooting

### Extension Not Working
- Ensure Developer mode is enabled in Chrome extensions
- Try reloading the extension page
- Check the browser console for errors (F12 → Console)

### API Key Issues
- Verify your API key is correct
- Check that you have sufficient credits/quota with your provider
- Ensure the API key has the necessary permissions

### No Response Generated
- Check your internet connection
- Verify the selected model is available (for OpenRouter)
- Try a different tone or custom instruction

### Sidebar Not Appearing
- Ensure you've selected text before using the extension
- Try refreshing the webpage
- Check if the website blocks iframes

### OpenRouter Model Not Working
- Verify the model ID is correct (case-sensitive)
- Check if the model is available at [OpenRouter Models](https://openrouter.ai/models)
- Some models may require higher API credits

## 📱 Browser Compatibility

- **Chrome**: Fully supported
- **Edge**: Supported (Chromium-based)
- **Firefox**: Not supported (uses Manifest V3)
- **Safari**: Not supported

## 🔒 Privacy & Security

- API keys are stored locally in Chrome's storage
- No data is sent to third parties except your chosen LLM provider
- Selected text is only sent to the AI provider when generating replies
- No conversation history is stored

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify your API key and provider settings
3. Try with a different website or text selection
4. Check the Chrome extension console for error messages

## 🔄 Updates

To update the extension:
1. Download the latest version
2. Go to `chrome://extensions/`
3. Click the reload button on the extension
4. Or remove and reinstall with the new files

---

*Last updated: 7 July 2025*