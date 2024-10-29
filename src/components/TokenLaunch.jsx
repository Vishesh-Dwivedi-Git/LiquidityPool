import React from 'react';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createMint, mintTo } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

const TokenLaunch = () => {
    const { publicKey, sendTransaction } = useWallet();

    async function createToken() {
        if (!publicKey) {
            alert("Please connect your Wallet first");
            return;
        }

        const initialSupply = document.getElementById('initialSup').value;
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // Initialize Metaplex without Bundlr storage
        const metaplex = Metaplex.make(connection).use(keypairIdentity(publicKey));

        try {
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

            // Create a transaction
            const transaction = new Transaction();

            // Mint tokens to the token account
            const mintInstruction = await mintTo(
                connection,
                publicKey,
                mint,
                tokenAccount.address,
                publicKey,
                initialSupply * LAMPORTS_PER_SOL // Convert to lamports
            );
            transaction.add(mintInstruction); // Add mint instruction to the transaction

            // Get metadata from input fields
            const name = document.getElementById('name').value;
            const symbol = document.getElementById('symbol').value;
            const image = document.getElementById('image').value;

            // Create metadata object
            const metadata = {
                name,
                symbol,
                uri: image,
                sellerFeeBasisPoints: 0,
                creators: [{ address: publicKey.toBase58(), share: 100 }] // Ensure publicKey is correctly converted
            };

            console.log("Mint Address:", mint.toBase58());
            console.log("Token Account:", tokenAccount.address.toBase58());
            console.log("Metadata:", metadata); // Log the metadata for debugging

            // Send the transaction for minting
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            // Set metadata on-chain
            const { metadataAccount } = await metaplex.nfts().create({
                mintAddress: mint,
                ...metadata
            });

            console.log("Token Minted and Metadata Created:", metadataAccount.toBase58());
        } catch (error) {
            console.error("Error in the creation of token", error);
        }
    }

    return (
        <div className='flex flex-col space-y-3 rounded-sm border border-blue-600'>
            <input id='name' className='inputText' placeholder='Name' type='text' />
            <input id='symbol' className='inputText' placeholder='Symbol' type='text' />
            <input id='image' className='inputText' placeholder='Image URL' type='text' />
            <input id='initialSup' className='inputText' placeholder='Initial Supply' type='text' />
            <button onClick={createToken} className='button bg-purple-800 text-white'>Create a Token</button>
        </div>
    );
};

export default TokenLaunch;
