import * as solanaWeb3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletError } from '@solana/wallet-adapter-base';

const MyComponent = () => {

  const connectToSolana = async () => {
    // Connect to the Solana network
    const connection = new solanaWeb3.Connection('https://cool-virulent-hill.solana-mainnet.discover.quiknode.pro/8be5681262dde1987a610c1f078074382f6a3ac3/');

    try {
      // Get the user's public key from their wallet adaptor
      // Check for new Wallet connections
      

      const publicKey = new solanaWeb3.PublicKey(localStorage.getItem('publicKey'))
      console.log(publicKey) 

      // Get the SPL Token program ID
      const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

      // Get the token mint's public key
      const MINT_PUBLIC_KEY = new solanaWeb3.PublicKey('8xYDKRd8doLadaE8YJsAiUB47ZsT6PSc99WWkpX2EhzS');

      const tk = await findTokenAccountAddress(publicKey, MINT_PUBLIC_KEY, connection)
      console.log(tk)
     

      // Get the user's token account address
      const tokenAccountAddress = await connection.getTokenAccountBalance(tk);

      // Get the user's token account data
      const tokenAccountData = await connection.getAccountInfo(TOKEN_PROGRAM_ID);

      // Get the user's token account's current token balance
      const currentTokenBalance = tokenAccountData.lamports;

      // Get the number of tokens to burn from the user's input
      const numTokensToBurn = 10;

      

      // Check if the user has enough tokens to burn
      if (currentTokenBalance >= numTokensToBurn) {
        // Create the instruction to burn the tokens
        
        const instruction = splToken.createBurnInstruction(
          publicKey,
          MINT_PUBLIC_KEY,
          tokenAccountAddress,
          numTokensToBurn,
          [],
          TOKEN_PROGRAM_ID,
        );

        try{
            
          // Get the recent blockhash
          const { blockhash } = await connection.getLatestBlockhash();
      
          // Create a transaction to burn tokens
          const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: TOKEN_PROGRAM_ID,
              lamports: numTokensToBurn,
            })
          );
      
          // Set the transaction's blockhash and fee payer
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;
      
          // Sign the transaction
          const signedTransaction = await wallet.adapter.signTransaction(transaction);
          
      
          // Send the signed transaction
          const signature = await connection.sendTransaction(signedTransaction);
      
          console.log('Transaction sent:', signature);
        } catch (error) {
          console.error('Error while burning tokens:', error);
        }

        console.log(`Successfully burned ${numTokensToBurn} tokens with signature ${signature}`);
      } else {
        console.log(`Error: User does not have enough tokens to burn ${numTokensToBurn}`);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  return (
    <div>
      <button onClick={connectToSolana}>Burn</button>
    </div>
  );
};


async function findTokenAccountAddress(walletAddress, tokenMintAddress, connection) {
  const associatedAccounts = await connection.getTokenAccountsByOwner(
    walletAddress,
    { mint: tokenMintAddress }
  );

  if (associatedAccounts.length === 0) {
    throw new Error('Token account not found');
  }

  return associatedAccounts.value[0].pubkey;
}

export default MyComponent;
