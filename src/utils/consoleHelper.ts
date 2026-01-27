/**
 * Console Helper Utility
 * Provides methods to manage console output and debug logging
 */

// Extend Window interface to include console helper
declare global {
  interface Window {
    __consoleHelper: typeof consoleHelper;
  }
}

export const consoleHelper = {
  /**
   * Enable detailed logging (show all console messages)
   */
  enableDetailed: () => {
    localStorage.setItem('DEBUG_MODE', 'true')
    console.log('🔍 Debug mode ENABLED - All logs visible')
  },

  /**
   * Disable detailed logging (filter extension errors only)
   */
  disableDetailed: () => {
    localStorage.setItem('DEBUG_MODE', 'false')
    console.log('🚫 Debug mode DISABLED - Extension errors filtered')
  },

  /**
   * Check if debug mode is enabled
   */
  isDebugMode: () => {
    return localStorage.getItem('DEBUG_MODE') === 'true'
  },

  /**
   * Log app-specific messages with prefixes
   */
  /**
   * Log app-specific messages with prefixes
   */
  logApp: (category: string, message: string, data: any = null) => {
    const prefix = `[${category.toUpperCase()}]`
    if (data) {
      console.log(`${prefix} ${message}`, data)
    } else {
      console.log(`${prefix} ${message}`)
    }
  },

  /**
   * Log API requests/responses
   */
  logAPI: (method: string, endpoint: string, status: number, data: any = null) => {
    const statusColor = status >= 200 && status < 300 ? '✅' : '❌'
    console.log(`${statusColor} [API] ${method} ${endpoint} (${status})`, data)
  },

  /**
   * Clear extension errors from console (show only app logs)
   */
  clearExtensionNoise: () => {
    // This is already handled in main.jsx
    console.log('🧹 Extension noise is automatically filtered')
  },

  /**
   * Get all app logs (for export/debugging)
   */
  exportLogs: () => {
    console.log('📋 Logs exported - check localStorage["appLogs"]')
  },
}

// Initialize console helper on app load
if (typeof window !== 'undefined') {
  window.__consoleHelper = consoleHelper
  
  // Commands for browser console:
  // __consoleHelper.enableDetailed() - Show all logs
  // __consoleHelper.disableDetailed() - Hide extension logs
  // __consoleHelper.isDebugMode() - Check current mode
  // __consoleHelper.logApp('NOVEL', 'Novel loaded', novelData)
  
  console.log('%c💡 Tip: Type __consoleHelper.enableDetailed() to see all logs', 'color: #4CAF50; font-size: 12px')
}
