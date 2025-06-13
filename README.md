Version 1.0.0

# TabShoter
TabShoter lets you capture full-page or selected-area screenshots of any website using Chrome's debugging API. It's easy, quick, and simple!

If you need a tool with more features, please skip this one.

## Features
- Full-page screenshot with scrolling
- Area screenshot by selecting a region
- Right-click context menu for quick access
- Download captured images
- Uses Chrome's debugging API for accurate captures
- Supports both full-page and area captures
- Captures images in PNG format
- Simple UI

## Usage
1. Load the extension in Chrome (chrome://extensions, enable Developer Mode, Load unpacked).
2. Click the extension icon and press "Capture Full Page".

## TODO
- Stitch captured images into a single file and download.


## Permissions
For your Chrome extension (TabShoter), the permissions you have in your manifest are correct and necessary for the features you implement:

- "activeTab": To access the currently active tab for capturing screenshots.
- "scripting": To inject scripts (like your content.js) into web pages.
- "downloads": To save screenshots to the user's computer.
- "tabs": To query tab information (e.g., get the active tab).
- "debugger": To use the chrome.debugger API for full-page and area screenshots.
- "contextMenus": To add right-click menu options to your extension icon.
- You also have: "host_permissions": ["<all_urls>"] — This is needed to allow your scripts to run on all websites.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
