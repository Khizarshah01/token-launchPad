import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from "@radix-ui/themes";
import './index.css'
import App from './App.jsx'
import "@radix-ui/themes/styles.css";
import { SolanaChainProvider } from './context/SolanaChainContext.jsx'
import { DarkModeProvider } from './context/DarkModeContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme>
      <DarkModeProvider>
      <SolanaChainProvider>
      <App />
      </SolanaChainProvider>
      </DarkModeProvider>
    </Theme>
  </StrictMode>,
)
