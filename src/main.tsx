import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { normalizePath } from './website/routes'
import './styles/fonts'
import './index.css'

const container = document.getElementById('root')!
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
)

// Hydrate only the page that was prerendered for this URL. A host may answer
// unknown paths (e.g. /app) with another prerendered file; render fresh then.
if (container.dataset.prerendered === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  container.textContent = ''
  createRoot(container).render(app)
}
