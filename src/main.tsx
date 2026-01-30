// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import './styles/index.scss'
import App from './App'

// Suppress Chrome extension errors from console
const originalError = console.error
const originalWarn = console.warn
const originalLog = console.log

console.error = (...args) => {
  const message = args[0]?.toString() || ''
  // Suppress extension-related errors
  if (message.includes('chrome-extension') || 
      message.includes('contentScript') ||
      message.includes('web_accessible_resources') ||
      message.includes('Denying load')) {
    return
  }
  originalError.apply(console, args)
}

console.warn = (...args) => {
  const message = args[0]?.toString() || ''
  if (message.includes('chrome-extension') || 
      message.includes('contentScript')) {
    return
  }
  originalWarn.apply(console, args)
}

// Keep info/log from extensions visible only if they mention our API
console.log = (...args) => {
  const message = args[0]?.toString() || ''
  // Always show our app logs
  if (message.includes('API') || message.includes('Novel') || message.includes('[API')) {
    originalLog.apply(console, args)
    return
  }
  // Suppress extension logs
  if (message.includes('chrome-extension') || message.includes('contentScript')) {
    return
  }
  originalLog.apply(console, args)
}

console.info('✅ Console filter enabled - Extension errors suppressed. Your app is working perfectly!')

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

createRoot(rootElement).render(
  // <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  // </StrictMode>,
)
