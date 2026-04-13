import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const preloadReloadKey = 'univerzo-preload-retry'

window.addEventListener('load', () => {
  sessionStorage.removeItem(preloadReloadKey)
})

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  if (!sessionStorage.getItem(preloadReloadKey)) {
    sessionStorage.setItem(preloadReloadKey, '1')
    window.location.reload()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
