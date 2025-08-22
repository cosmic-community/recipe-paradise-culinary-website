(function() {
  'use strict';
  
  // Only run if we're in an iframe (dashboard preview mode)
  if (window.self === window.top) {
    return;
  }
  
  // Check if parent window exists and can receive messages
  if (!window.parent) {
    return;
  }
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Function to safely send messages to parent
  function sendToParent(data) {
    try {
      window.parent.postMessage({
        type: 'IFRAME_CONSOLE_LOG',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...data
      }, '*');
    } catch (e) {
      // Fail silently if parent can't receive messages
    }
  }
  
  // Function to serialize arguments (handle objects, functions, etc.)
  function serializeArgs(args) {
    return Array.from(args).map(arg => {
      try {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
        if (typeof arg === 'object') {
          // Handle Error objects specially
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: arg.stack
            };
          }
          // Try to stringify other objects
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      } catch (e) {
        return '[Object: ' + Object.prototype.toString.call(arg) + ']';
      }
    });
  }
  
  // Override console methods
  function overrideConsole(method, level) {
    console[method] = function(...args) {
      // Call original method first
      originalConsole[method].apply(console, args);
      
      // Send to parent
      sendToParent({
        level: level,
        method: method,
        args: serializeArgs(args),
        stack: new Error().stack
      });
    };
  }
  
  // Override all console methods
  overrideConsole('log', 'log');
  overrideConsole('info', 'info');
  overrideConsole('warn', 'warn');
  overrideConsole('error', 'error');
  overrideConsole('debug', 'debug');
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    sendToParent({
      level: 'error',
      method: 'error',
      args: [
        'Unhandled Error:',
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error ? {
            name: event.error.name,
            message: event.error.message,
            stack: event.error.stack
          } : null
        }
      ],
      stack: event.error ? event.error.stack : null,
      type: 'unhandled-error'
    });
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    sendToParent({
      level: 'error',
      method: 'error',
      args: [
        'Unhandled Promise Rejection:',
        {
          reason: event.reason,
          promise: '[Promise]'
        }
      ],
      stack: event.reason && event.reason.stack ? event.reason.stack : null,
      type: 'unhandled-rejection'
    });
  });
  
  // Send initial load message
  window.addEventListener('load', function() {
    sendToParent({
      level: 'info',
      method: 'info',
      args: ['Dashboard iframe loaded successfully'],
      type: 'iframe-loaded'
    });
  });
  
  // Send DOM ready message
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      sendToParent({
        level: 'info',
        method: 'info',
        args: ['Dashboard iframe DOM ready'],
        type: 'dom-ready'
      });
    });
  } else {
    sendToParent({
      level: 'info',
      method: 'info',
      args: ['Dashboard iframe DOM ready (already loaded)'],
      type: 'dom-ready'
    });
  }
  
})();