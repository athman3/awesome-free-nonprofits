import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')
const canHydrate = rootElement.dataset.prerendered === 'true' &&
  !document.documentElement.hasAttribute('data-client-filtered')
const searchInput = canHydrate ? rootElement.querySelector('input') : null
const pendingQuery = searchInput?.value || undefined
const pendingSelection = pendingQuery && document.activeElement === searchInput
  ? [searchInput.selectionStart, searchInput.selectionEnd, searchInput.selectionDirection]
  : null
const app = (
  <StrictMode>
    <App initialSearchQuery={pendingQuery} />
  </StrictMode>
)

if (canHydrate && !pendingQuery) {
  hydrateRoot(rootElement, app)
} else {
  // Query URLs must render their filtered state without showing the full list first.
  rootElement.replaceChildren()
  rootElement.removeAttribute('data-prerendered')
  document.documentElement.removeAttribute('data-client-filtered')
  const root = createRoot(rootElement)
  if (pendingQuery) {
    // Apply input typed before startup and preserve its focus and caret before paint.
    flushSync(() => root.render(app))
    if (pendingSelection) {
      const input = rootElement.querySelector('input')
      input.focus({ preventScroll: true })
      input.setSelectionRange(...pendingSelection)
    }
  } else {
    root.render(app)
  }
}
