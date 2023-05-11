import React, { useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import * as solanaWeb3 from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function Wallet() {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    const connection = useConnection();

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                    <WalletMultiButton />
                </WalletModalProvider>
                <WalletActions />
            </WalletProvider>
        </ConnectionProvider>
        
    );
};

// Check for new Wallet connections
function WalletActions() {
    const { connection, publicKey } = useWallet();
  
    useEffect(() => {
        if (publicKey) {
            console.log(connection)
            console.log(publicKey.toBase58()); // Print public key to the console
            localStorage.setItem('publicKey', publicKey.toBase58());
            addAddressToFirebase(publicKey.toBase58());
        }
    }, [publicKey]);

    return null;
}

function addAddressToFirebase(publicKey) {
    const userData = {
        id: publicKey
      };
  
    fetch(`https://frens-919b1-default-rtdb.europe-west1.firebasedatabase.app/users/${publicKey}.json`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            console.log("Data added successfully");
        } else {
            throw new Error('Error adding data to Firebase');
        }
    })
    .catch(error => {
        console.log(`Error adding data to Firebase: ${error.message}`);
    });
}

const BurnButton = () => {
    const { publicKey, wallet } = useWallet();
    const { connection } = useConnection();

    const tokenAddress = 'A5z1XhFinWEFo4NBP98LZfFhsfD5MbTKrDsufj12MYZH'
    const amount = 10;
  
    const handleBurnClick = async () => {
      if (!publicKey) {
        console.log('Wallet not connected');
        return;
      }
  
      const programId = new solanaWeb3.PublicKey(tokenAddress);
      const senderPublicKey = publicKey.toBytes();
  
      // Create a transaction to burn tokens
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: programId,
          lamports: amount,
        })
      );

    try{
            
    // Get the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create a transaction to burn tokens
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: programId,
        lamports: amount,
      })
    );

    // Set the transaction's blockhash and fee payer
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Sign the transaction
    const signedTransaction = await wallet.adapter.signTransaction(transaction);

    // Send the signed transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    console.log('Transaction sent:', signature);
  } catch (error) {
    console.error('Error while burning tokens:', error);
  }
    };
  
    return (
      <button onClick={handleBurnClick}>Burn Tokens</button>
    );
  };
  

export default Wallet;
