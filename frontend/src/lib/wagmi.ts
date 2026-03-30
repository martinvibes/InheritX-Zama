import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'InheritX',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'inheritx-dev',
  chains: [sepolia],
  ssr: false,
})
