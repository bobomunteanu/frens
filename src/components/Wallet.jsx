import React, { useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  WalletAdapterNetwork,
  WalletWindowBlockedError,
} from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import * as solanaWeb3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import NumericInput from "./NumericInput";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

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
        <div style={{ marginBottom: "20vh" }}>
          <h1>Burn Frens</h1>
        </div>
        <BurnButton></BurnButton>
        <WalletActions />
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Check for new Wallet connections
function WalletActions() {
  const { publicKey, wallet } = useWallet();

  useEffect(() => {
    if (publicKey) {
      console.log(wallet); // Print public key to the console
      localStorage.setItem("publicKey", publicKey.toBase58());
      addAddressToFirebase(publicKey.toBase58());
    }
  }, [publicKey]);

  return null;
}

async function addAddressToFirebase(publicKey) {
  const userData = {
    id: publicKey,
    amount: 0,
  };

  const registered = await isPublicKeyRegistered(publicKey);
  console.log(registered);

  if (!registered) {
    fetch(
      `https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users/${publicKey}.json`,
      {
        method: "PUT",
        body: JSON.stringify(userData),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Data added successfully");
        } else {
          throw new Error("Error adding data to Firebase");
        }
      })
      .catch((error) => {
        console.log(`Error adding data to Firebase: ${error.message}`);
      });
  }
}

const BurnButton = () => {
  const { publicKey, wallet } = useWallet();
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleTextFieldChange = (textFieldValue) => {
    setTextFieldValue(textFieldValue);
  };

  const connectToSolana = async () => {
    // Connect to the Solana network
    const connection = new solanaWeb3.Connection(
      "https://cool-virulent-hill.solana-mainnet.discover.quiknode.pro/8be5681262dde1987a610c1f078074382f6a3ac3/"
    );

    try {
      // Get the user's public key from their wallet adaptor
      // Check for new Wallet connections
      console.log(publicKey);

      // Get the SPL Token program ID
      const TOKEN_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID;

      // Get the token mint's public key
      const MINT_PUBLIC_KEY = new solanaWeb3.PublicKey(
        "8xYDKRd8doLadaE8YJsAiUB47ZsT6PSc99WWkpX2EhzS"
      );

      const tk = await findTokenAccountAddress(
        publicKey,
        MINT_PUBLIC_KEY,
        connection
      );

      // Get the user's token account address
      const tokenAccountAddress = new solanaWeb3.PublicKey(tk);

      // Get the user's token account data
      const tokenAccountData = await connection.getAccountInfo(
        TOKEN_PROGRAM_ID
      );

      // Get the user's token account's current token balance
      const currentTokenBalance = tokenAccountData.lamports;
      console.log(textFieldValue);

      if (textFieldValue === "") {
        alert("Please enter the amount of tokens to burn");
        return;
      }

      // Get the number of tokens to burn from the user's input
      const numTokensToBurn = textFieldValue;

      // Check if the user has enough tokens to burn
      if (currentTokenBalance >= numTokensToBurn) {
        // Create the instruction to burn the tokens

        const instruction = splToken.createBurnInstruction(
          tk,
          MINT_PUBLIC_KEY,
          publicKey,
          numTokensToBurn,
          [publicKey]
        );

        try {
          // Create a transaction and add the burn instruction
          const transaction = new solanaWeb3.Transaction().add(instruction);

          // Get the recent blockhash
          const { blockhash } = await connection.getLatestBlockhash();

          // Set the transaction's blockhash and fee payer
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;

          console.log(transaction);

          // Sign the transaction with the wallet adapter
          const signedTransaction = await wallet.adapter.signTransaction(
            transaction
          );

          console.log(signedTransaction);

          // Send the signed transaction
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize(),
            {
              skipPreflight: true,
              signers: [publicKey],
              preflightCommitment: "processed",
            }
          );

          let tokens = await fetchTokensForUser(publicKey.toBase58());
          console.log(tokens);
          tokens = parseInt(tokens) + parseInt(numTokensToBurn);

          if (signature) {
            const x = await updateTokensForUser(publicKey, tokens);
            window.location.reload(true);
          }

          return signedTransaction;

          console.log("Transaction sent:", signedTransaction.signature);
        } catch (error) {
          console.error("Error while burning tokens:", error);
        }

        console.log(
          `Successfully burned ${numTokensToBurn} tokens with signature ${signature}`
        );
      } else {
        console.log(
          `Error: User does not have enough tokens to burn ${numTokensToBurn}`
        );
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  return (
    <div>
      <NumericInput
        value={textFieldValue}
        onChange={handleTextFieldChange}
      ></NumericInput>
      <p></p>
      <button onClick={connectToSolana}>Burn!</button>
    </div>
  );
};

async function findTokenAccountAddress(
  walletAddress,
  tokenMintAddress,
  connection
) {
  const associatedAccounts = await connection.getTokenAccountsByOwner(
    walletAddress,
    { mint: tokenMintAddress }
  );

  if (associatedAccounts.length === 0) {
    throw new Error("Token account not found");
  }

  return associatedAccounts.value[0].pubkey;
}

async function fetchTokensForUser(publicKey) {
  try {
    const response = await fetch(
      `https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users/${publicKey}.json`
    );

    if (!response.ok) {
      throw new Error("Error fetching user data from Firebase");
    }

    const userData = await response.json();
    if (userData && userData.amount) {
      return userData.amount;
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    console.log(`Error fetching user data: ${error.message}`);
    // Handle the error as needed (e.g., show an error message to the user)
  }
}

async function updateTokensForUser(publicKey, newAmountOfTokens) {
  try {
    const response = await fetch(
      `https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users/${publicKey}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({ amount: newAmountOfTokens }),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating user data in Firebase");
    }

    console.log("Tokens updated successfully");
  } catch (error) {
    console.log(`Error updating user data: ${error.message}`);
    // Handle the error as needed (e.g., show an error message to the user)
  }
}

async function isPublicKeyRegistered(publicKey) {
  try {
    const response = await fetch(
      `https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users/${publicKey}.json`
    );

    if (response.ok) {
      const userData = await response.json();
      return userData !== null;
    } else {
      throw new Error("Error checking user registration in Firebase");
    }
  } catch (error) {
    console.log(`Error checking user registration: ${error.message}`);
    // Handle the error as needed (e.g., show an error message to the user)
    return false;
  }
}

export default Wallet;
