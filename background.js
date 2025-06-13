// Create context menu items for extension icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'capture-full-page',
    title: 'Capture Full Page',
    contexts: ['action']
  });
  chrome.contextMenus.create({
    id: 'capture-area',
    title: 'Capture Area',
    contexts: ['action']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'capture-full-page') {
    captureScreenshot();
  } else if (info.menuItemId === 'capture-area') {
    // Inject content script to let user select area, then send message
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      // Now send message to content script to start area selection
      chrome.tabs.sendMessage(tab.id, { action: 'start-area-selection' });
    });
  }
});

// Listen for area selection from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'area-selected') {
    const { x, y, width, height } = message;
    captureAreaScreenshot(x, y, width, height);
  }
});

// Function to capture screenshot using chrome.debugger with Capture full size screenshot option
async function captureScreenshot() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.debugger.attach({ tabId: tab.id }, '1.3', () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    // Directly capture full page screenshot without emulation
    chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', {
      format: 'png', // or 'png'
      // quality: 100, // Only for jpeg
      fromSurface: true, //  true is used to capture the full page as it appears in the browser
      captureBeyondViewport: true, // This option allows capturing the entire page, even if it extends beyond the viewport
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        chrome.debugger.detach({ tabId: tab.id });
        return;
      }
      const url = 'data:image/png;base64,' + result.data;
      chrome.downloads.download({ url, filename: 'tabshoter_full_size_screenshot.png' }, () => {
        chrome.debugger.detach({ tabId: tab.id });
      });
    });
  });
}

// Function to capture screenshot using chrome.debugger with Capture are screenshot option
async function captureAreaScreenshot(x, y, width, height) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.debugger.attach({ tabId: tab.id }, '1.3', () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    // Capture screenshot of the visible area
    chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', {
      format: 'png', // or 'png'
      fromSurface: true,
      captureBeyondViewport: true,
      // can i make clip by dragging the mouse?
      // clip: { x: 0, y: 0, width: 100, height: 200, scale: 1 } // Uncomment to specify a clip area
      clip: { x: x, y: y, width: width, height: height, scale: 1 } // Specify the area to capture
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        chrome.debugger.detach({ tabId: tab.id });
        return;
      }
      const url = 'data:image/png;base64,' + result.data;
      chrome.downloads.download({ url, filename: 'tabshoter_area_screenshot.png' }, () => {
        chrome.debugger.detach({ tabId: tab.id });
      });
    });
  });
}

// Listen for the keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
  if (command === 'capture-full-page') {
    captureScreenshot();
    return;
  }
});

// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  captureScreenshot();
});
