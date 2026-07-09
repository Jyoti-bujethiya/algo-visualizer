import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error('[AlgoViz] VITE_CLERK_PUBLISHABLE_KEY is missing from .env.local')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY ?? ''}
      afterSignOutUrl="/"
      telemetry={false}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)