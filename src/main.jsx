// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Initialization guard
if (typeof window !== 'undefined' && !window.__WC_INITIALIZED__) {
  window.__WC_INITIALIZED__ = true
}

const PROJECT_ID = '672eb75a494f02a17598e73d0137ea46';

const metadata = {
  name: 'certify-chain',
  description: 'AppKit Example',
  url: 'http://localhost:5173/', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

const config = createConfig(
  getDefaultConfig({
    appName: 'certify-chain',
    projectId: PROJECT_ID,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http()
    },
    metadata,
    ssr: false
  })
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)