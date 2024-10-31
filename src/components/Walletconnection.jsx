import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter, LedgerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import React, { useMemo } from 'react';

const WalletConnection = ({ children }) => {
  // You can use custom RPC endpoint or default devnet
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  
  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex justify-between items-center p-4 bg-purple-800 text-white">
            <div className="text-lg font-bold">
              Solana Token Creator
            </div>
            <div className="flex gap-4">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
          </div>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnection;