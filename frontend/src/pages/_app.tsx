import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [mainnet], // Add more chains if needed
  [publicProvider()]
);

// Set up RainbowKit
const { connectors } = getDefaultWallets({
  appName: 'Oilube',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with a real WalletConnect Project ID
  chains
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}