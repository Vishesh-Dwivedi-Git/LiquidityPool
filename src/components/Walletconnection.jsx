import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletDisconnectButton , WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import React from 'react'

const Walletconnection = ({children}) => {
  return (
    <div>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 20
              }}>
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
        </WalletModalProvider>
        {children}
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default Walletconnection
