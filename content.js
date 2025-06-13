// Listen for message from background to start area selection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start-area-selection') {
    startAreaSelection();
  }
});

function startAreaSelection() {
  let startX, startY, rect, overlay;
  let selecting = false;

  // Create overlay
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '999999';
  overlay.style.cursor = 'crosshair';
  overlay.style.background = 'rgba(0,0,0,0.05)';
  document.body.appendChild(overlay);

  // Rectangle for selection
  rect = document.createElement('div');
  rect.style.position = 'absolute';
  rect.style.border = '2px dashed #2196f3';
  rect.style.background = 'rgba(33,150,243,0.15)';
  overlay.appendChild(rect);

  overlay.addEventListener('mousedown', (e) => {
    selecting = true;
    startX = e.clientX;
    startY = e.clientY;
    rect.style.left = startX + 'px';
    rect.style.top = startY + 'px';
    rect.style.width = '0px';
    rect.style.height = '0px';
  });

  overlay.addEventListener('mousemove', (e) => {
    if (!selecting) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    rect.style.left = x + 'px';
    rect.style.top = y + 'px';
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
  });

  overlay.addEventListener('mouseup', (e) => {
    if (!selecting) return;
    selecting = false;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    // Remove overlay
    overlay.remove();
    // Send coordinates to background
    chrome.runtime.sendMessage({
      action: 'area-selected',
      x,
      y,
      width: w,
      height: h
    });
  });

  // Allow cancel with Escape
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
    }
  });
  overlay.tabIndex = 0;
  overlay.focus();
}
