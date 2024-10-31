import React, { useState } from 'react';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createMint, mintTo } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { Metaplex } from '@metaplex-foundation/js';

const TokenLaunch = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [status, setStatus] = useState('');

    async function createToken() {
        if (!publicKey) {
            setStatus('Please connect your wallet first');
            return;
        }

        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const metaplex = Metaplex.make(connection);

        try {
            // Get values from inputs
            const name = document.getElementById('name').value;
            const symbol = document.getElementById('symbol').value;
            const image = document.getElementById('image').value;
            const initialSupply = parseFloat(document.getElementById('initialSup').value);

            if (!name || !symbol || !image || isNaN(initialSupply)) {
                setStatus('Please fill all fields correctly');
                return;
            }

            // Create the token mint
            const mint = await createMint(
                connection,
                publicKey,
                publicKey,
                publicKey,
                9 // Decimals
            );

            // Create or get the associated token account
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                mint,
                publicKey
            );

            // Create a transaction for minting
            const transaction = new Transaction();
            
            // Add mint instruction to the transaction
            const mintInstruction = await mintTo(
                connection,
                publicKey,
                mint,
                tokenAccount.address,
                publicKey,
                initialSupply * LAMPORTS_PER_SOL
            );
            transaction.add(mintInstruction);

            // Send and confirm the transaction
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            // Create metadata
            await metaplex.nfts().create({
                uri: image,
                name: name,
                symbol: symbol,
                sellerFeeBasisPoints: 0,
                creators: [{
                    address: publicKey,
                    share: 100
                }],
                mintAddress: mint
            });

            setStatus(`Token created successfully! Mint address: ${mint.toBase58()}`);
            console.log("Token details:", {
                mint: mint.toBase58(),
                tokenAccount: tokenAccount.address.toBase58()
            });

        } catch (error) {
            console.error("Error creating token:", error);
            setStatus(`Error: ${error.message}`);
        }
    }

    return (
        <div className="w-full max-w-md p-4">
            <div className="space-y-4 rounded-lg border border-blue-600 p-4">
                <input
                    id="name"
                    className="w-full p-2 border rounded"
                    placeholder="Token Name"
                    type="text"
                />
                <input
                    id="symbol"
                    className="w-full p-2 border rounded"
                    placeholder="Token Symbol"
                    type="text"
                />
                <input
                    id="image"
                    className="w-full p-2 border rounded"
                    placeholder="Metadata URI"
                    type="text"
                />
                <input
                    id="initialSup"
                    className="w-full p-2 border rounded"
                    placeholder="Initial Supply"
                    type="number"
                />
                <button
                    onClick={createToken}
                    className="w-full p-2 text-white bg-purple-800 rounded hover:bg-purple-700"
                    disabled={!publicKey}
                >
                    Create Token
                </button>
                {status && (
                    <div className="mt-4 p-2 text-sm text-center border rounded">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenLaunch;