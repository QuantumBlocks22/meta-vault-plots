import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Meta Vault Plots',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia, mainnet],
  ssr: false,
});

export const chains = [sepolia, mainnet];
