import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ui/theme/index.css'
import { App } from './ui/components/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
