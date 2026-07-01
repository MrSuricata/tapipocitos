import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { StoreProvider } from './lib/store.tsx'
import { CartProvider } from './lib/cart.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <StoreProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </StoreProvider>
  </ErrorBoundary>
)
