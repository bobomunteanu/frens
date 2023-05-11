import * as solanaWeb3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletError } from '@solana/wallet-adapter-base';

const MyComponent = () => {

  const connectToSolana = async () => {
    // Connect to the Solana network
    const connection = new solanaWeb3.Connection('https://corsproxy.io/?https://api.mainnet-beta.solana.com');

    try {
      // Get the user's public key from their wallet adaptor
      // Check for new Wallet connections
      const publicKey = new solanaWeb3.PublicKey(localStorage.getItem('publicKey'))
      console.log(publicKey)

      // Get the SPL Token program ID
      const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('A5z1XhFinWEFo4NBP98LZfFhsfD5MbTKrDsufj12MYZH');

      // Get the token mint's public key
      const MINT_PUBLIC_KEY = new solanaWeb3.PublicKey('HDGtp2QnnzcaSvYXdCmMEjh2KnXKdtLnFxrXgN36Ee3i');

      // Get the user's token account address
      const tokenAccountAddress = await connection.getTokenAccountBalance(publicKey, TOKEN_PROGRAM_ID);

      // Get the user's token account data
      const tokenAccountData = await connection.getAccountInfo(tokenAccountAddress);

      // Get the user's token account's current token balance
      const currentTokenBalance = tokenAccountData.lamports;

      // Get the number of tokens to burn from the user's input
      const numTokensToBurn = 10;

      // Check if the user has enough tokens to burn
      if (currentTokenBalance >= numTokensToBurn) {
        // Create the instruction to burn the tokens
        const instruction = solanaWeb3.Token.createBurnInstruction(
          TOKEN_PROGRAM_ID,
          MINT_PUBLIC_KEY,
          tokenAccountAddress,
          publicKey,
          [],
          numTokensToBurn
        );

        // Send the instruction to the Solana network
        const transaction = new solanaWeb3.Transaction().add(instruction);
        const signature = await window.solana.signAndSendTransaction(transaction);

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

// Check for new Wallet connections
function WalletActions() {
    const { publicKey } = useWallet();
  
    useEffect(() => {
        if (publicKey) {
            console.log(publicKey.toBase58()); // Print public key to the console
            addAddressToFirebase(publicKey.toBase58());
        }
    }, [publicKey]);

    return null;
}

export default MyComponent;
