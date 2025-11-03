// Next.js version of demo/script.js - Exact same functionality
// Execute immediately in browser environment
if (typeof window !== 'undefined') {
  // Immediate debugger trap on load
  debugger;
  
  (function() {
    'use strict';
    
    // More immediate debugger traps
    debugger;
    setInterval(() => { debugger; }, 100);
    setTimeout(() => { debugger; }, 1);

  // Clear console and show cool messages first
  console.clear();

  // Store original console before overriding
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  // Show cool messages
  originalConsole.log('%c💀 %c𝕀ℕ𝕊ℙ𝔼ℂ𝕋 ??',
    'font-size: 50px;',
    'color: #ff0000; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
  );
  originalConsole.log('%c😂 %c𝕂𝕪𝕒 𝕄𝕚𝕝𝕖𝕘𝕒 𝕀𝕟𝕤𝕡𝕖𝔠𝕥 𝕂𝕒𝕣𝕜𝕖 ?',
    'font-size: 30px;',
    'color: #ff6b6b; font-size: 30px; font-weight: bold;'
  );
  originalConsole.log('%c✔️ %cℙ𝕒𝕕𝕙𝕒𝕚 𝕂𝕒𝕣𝕝𝕠 ℂ𝕙𝕦𝕡𝔠𝕙𝕒𝕡 !',
    'font-size: 30px;',
    'color: #ff9500; font-size: 30px; font-weight: bold;'
  );

  // Override console functions to prevent any further logging
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};
  console.info = function() {};
  console.debug = function() {};
  
  // Immediate debugger statements (like original)
  debugger;
  setTimeout(() => { debugger; }, 10);
  setTimeout(() => { debugger; }, 50);
  setTimeout(() => { debugger; }, 100);

  // DevTools Protection Configuration
  const redirectUrl = 'https://t.me/+6ZYsttJPRmFkNDU9';
  const checkInterval = 1000; // Increased interval to reduce false positives
  let hasRedirected = false;
  let initialWindowState = null;
  let devToolsDetectionCount = 0;
  const DETECTION_THRESHOLD = 3; // Require multiple detections before redirect

  // Initialize window state after page load
  function initializeWindowState() {
    initialWindowState = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    };
  }

  // Improved DevTools Detection - Less aggressive
  function isDevToolsOpen() {
    if (!initialWindowState) return false;
    
    const threshold = 160;
    const widthThreshold = Math.abs(window.outerWidth - window.innerWidth) > threshold;
    const heightThreshold = Math.abs(window.outerHeight - window.innerHeight) > threshold;
    
    // More conservative detection - require both width AND height changes
    return widthThreshold && heightThreshold;
  }
  
  // Debugger trap with timing check
  function debuggerTrap() {
    try {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      // Only consider it DevTools if there's a significant delay (>50ms)
      return (end - start) > 50;
    } catch (e) {
      return false;
    }
  }
  
  // Console detection using toString override
  function consoleDetection() {
    let detected = false;
    const element = new Image();
    
    Object.defineProperty(element, 'id', {
      get: function() {
        detected = true;
        return 'detected';
      }
    });
    
    // This will trigger the getter if console is open
    console.log(element);
    return detected;
  }
  
  // Combined DevTools detection with multiple methods
  function advancedDevToolsCheck() {
    let detectionScore = 0;
    
    // Method 1: Window size (weight: 2)
    if (isDevToolsOpen()) detectionScore += 2;
    
    // Method 2: Debugger timing (weight: 3)
    if (debuggerTrap()) detectionScore += 3;
    
    // Method 3: Console detection (weight: 1)
    if (consoleDetection()) detectionScore += 1;
    
    // Require score of 3 or higher for detection
    return detectionScore >= 3;
  }

  function checkDevTools() {
    if (hasRedirected) return;
    
    if (advancedDevToolsCheck()) {
      devToolsDetectionCount++;
      
      // Only redirect after multiple consecutive detections
      if (devToolsDetectionCount >= DETECTION_THRESHOLD) {
        hasRedirected = true;
        
        // Clear console before redirect
        if (console.clear) console.clear();
        
        // Add final debugger statement
        debugger;
        
        // Silent redirect
        window.location.replace(redirectUrl);
      }
    } else {
      // Reset counter if no detection
      devToolsDetectionCount = Math.max(0, devToolsDetectionCount - 1);
    }
  }
  
  // Continuous and aggressive debugger trap (like original)
  function continuousDebuggerTrap() {
    if (hasRedirected) return;
    
    // Immediate debugger
    debugger;
    
    setTimeout(() => {
      debugger;
      continuousDebuggerTrap();
    }, 100); // More frequent checks like original
  }
  
  // Additional immediate debugger traps
  function immediateDebuggerTrap() {
    debugger;
    setTimeout(() => {
      debugger;
      immediateDebuggerTrap();
    }, 50);
  }

  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // F12 - Developer Tools
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I - Developer Tools
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U - View Source
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C - Element Inspector
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+A - Select All
    if (e.ctrlKey && e.keyCode === 65) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+S - Save Page
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+P - Print
    if (e.ctrlKey && e.keyCode === 80) {
      e.preventDefault();
      return false;
    }
    
    // F5 and Ctrl+R - Refresh (optional, uncomment if needed)
    // if (e.keyCode === 116 || (e.ctrlKey && e.keyCode === 82)) {
    //   e.preventDefault();
    //   return false;
    // }
  });

  // Disable mouse selection (except for inputs)
  document.onselectstart = function(e) {
    // Allow selection in input fields, textareas, and contenteditable elements
    if (e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true')) {
      return true;
    }
    return false;
  };
  
  document.onmousedown = function(e) {
    // Allow mouse interactions with input fields, textareas, buttons, and links
    if (e && e.target) {
      const allowedTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'];
      if (allowedTags.includes(e.target.tagName) || e.target.contentEditable === 'true') {
        return true;
      }
    }
    return false;
  };

  // CSS to disable text selection (backup method)
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    input, textarea, button, select, [contenteditable="true"] {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      pointer-events: auto !important;
    }
    
    /* Ensure search bars and form elements are clickable */
    input[type="text"], input[type="search"], input[type="email"], input[type="password"] {
      pointer-events: auto !important;
      cursor: text !important;
    }
    
    button, input[type="button"], input[type="submit"] {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(style);

  // Initialize after page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      initializeWindowState();
      
      // Start checks after initialization
      setTimeout(() => {
        checkDevTools();
        continuousDebuggerTrap();
        immediateDebuggerTrap(); // Start immediate traps
        setInterval(checkDevTools, checkInterval);
      }, 500); // Shorter delay like original
    }, 500);
  });

  })(); // Close the IIFE
} // Close the if statement

// Export for Next.js compatibility
export default function initSecurity() {
  // Trigger additional security initialization if needed
  if (typeof window !== 'undefined') {
    // Force immediate debugger trap
    debugger;
    
    // Additional immediate traps
    setTimeout(() => { debugger; }, 1);
    setTimeout(() => { debugger; }, 10);
    setTimeout(() => { debugger; }, 50);
  }
  return true;
}
