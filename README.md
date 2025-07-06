# Contextual Reply Assistant

A Chrome extension that generates contextual replies to selected text using various LLM providers (OpenAI, Anthropic, Gemini, OpenRouter). Simply select text on any webpage and get AI-powered responses in your desired tone.

## Features

- 🎯 **Quick Text Selection**: Select any text on a webpage and generate a contextual reply
- 🎨 **Multiple Tones**: Choose from Friendly, Professional, or Casual response styles
- 🤖 **Multiple LLM Providers**: Support for OpenAI, Anthropic (Claude), Google Gemini, and OpenRouter
- 📝 **Custom Instructions**: Add personalized context to tailor responses to your needs
- 💾 **Persistent Settings**: Your API keys and custom instructions are saved locally
- ⚡ **Keyboard Shortcut**: Quick access with `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (Mac)
- 📋 **Copy to Clipboard**: One-click copy of generated responses
- 🎛️ **Adjustable Sidebar**: Draggable, resizable, and collapsible interface

## Installation

### Step 1: Download the Extension

1. Clone this repository or download it as a ZIP file:
   ```bash
   git clone https://github.com/yourusername/auto-commenter.git
   ```
   Or download and extract the ZIP file to a folder on your computer.

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** by toggling the switch in the top-right corner
3. Click **Load unpacked**
4. Select the folder containing the extension files (where `manifest.json` is located)
5. The extension will appear in your extensions list

### Step 3: Configure Your API Key

1. Click on the extension icon in your browser toolbar
2. Select your preferred LLM provider from the dropdown:
   - **OpenAI**: Requires an [OpenAI API key](https://platform.openai.com/api-keys)
   - **Anthropic**: Requires an [Anthropic API key](https://console.anthropic.com/settings/keys)
   - **Gemini**: Requires a [Google AI Studio API key](https://makersuite.google.com/app/apikey)
   - **OpenRouter**: Requires an [OpenRouter API key](https://openrouter.ai/keys)
3. Enter your API key (it will be securely stored locally)
4. Click **Save Settings**

## Usage

### Method 1: Right-Click Context Menu

1. Select any text on a webpage
2. Right-click on the selected text
3. Click **"Generate Contextual Reply"** from the context menu

### Method 2: Keyboard Shortcut

1. Select any text on a webpage
2. Press `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (Mac)

### Using the Sidebar

Once activated, a sidebar will appear on the right side of your screen with:

1. **Selected Text**: Shows the text you selected
2. **Custom Instructions** (Optional): Add context like:
   - "Reply as a startup founder"
   - "Keep it under 50 words"
   - "Include technical details"
   - "Make it humorous"
3. **Tone Buttons**: Choose your preferred response style:
   - **Friendly**: Warm, conversational responses
   - **Professional**: Formal, business-appropriate responses
   - **Casual**: Relaxed, informal responses
4. **Generated Reply**: The AI-generated response appears here
5. **Copy Button**: Click to copy the response to your clipboard

### Sidebar Controls

- **Minimize/Maximize** (−/+): Collapse or expand the sidebar
- **Close** (×): Close the sidebar completely
- **Resize**: Drag the left edge to adjust width
- **Move**: Drag the header to reposition the sidebar

## Examples

### Example 1: Professional Email Response
- **Selected Text**: "Can we schedule a meeting next week to discuss the project timeline?"
- **Custom Instructions**: "Reply as a project manager, suggest Tuesday or Thursday"
- **Tone**: Professional
- **Generated Reply**: "Thank you for reaching out. I'd be happy to discuss the project timeline with you. I have availability on Tuesday afternoon after 2 PM or Thursday morning before 11 AM. Please let me know which time works best for your schedule, and I'll send a calendar invitation."

### Example 2: Social Media Reply
- **Selected Text**: "Just launched my new app! Would love to hear your thoughts"
- **Custom Instructions**: "Be encouraging, mention specific features"
- **Tone**: Friendly
- **Generated Reply**: "Congratulations on the launch! 🎉 Just checked it out and I'm really impressed with the clean UI and smooth onboarding flow. The feature that lets users customize their dashboard is particularly clever. Wishing you lots of success with this!"

### Example 3: Technical Forum Response
- **Selected Text**: "How do I optimize my React app performance?"
- **Custom Instructions**: "Include 3 specific tips with brief explanations"
- **Tone**: Professional
- **Generated Reply**: "To optimize your React app performance, consider these key strategies: 1) Implement React.memo() for components that re-render frequently with the same props. 2) Use useMemo() and useCallback() hooks to prevent unnecessary recalculations and function recreations. 3) Enable code splitting with React.lazy() to reduce initial bundle size. These techniques will significantly improve your app's responsiveness and load times."

## Privacy & Security

- **Local Storage Only**: All API keys and settings are stored locally in your browser
- **No Data Collection**: The extension doesn't collect or send any data to external servers (except to the LLM providers you configure)
- **Secure API Keys**: API keys are masked in the settings interface and stored securely in Chrome's local storage

## Troubleshooting

### Extension Not Working
1. Make sure you've reloaded the extension after making any changes
2. Check that you have a valid API key configured
3. Ensure you've selected text before trying to generate a reply

### API Errors
1. Verify your API key is correct and has sufficient credits
2. Check that you've selected the correct provider for your API key
3. Some providers may have rate limits - wait a moment and try again

### Sidebar Issues
1. If the sidebar appears behind page elements, try refreshing the page
2. Some websites may have conflicts with the extension - try on a different site

## Support

If you encounter any issues or have feature requests, please open an issue on the GitHub repository.