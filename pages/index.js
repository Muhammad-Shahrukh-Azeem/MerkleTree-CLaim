import { ethers } from 'ethers';
import { useState } from 'react';
import { whiteListedClaim, balanceOfbnb, balanceOfETH } from '../Interaction/init';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null); // State to store wallet address
  const [signer, setSigner] = useState(null); // State to store the signer
  let ethBalance = 0;
  let bscBalance = 0;

  // Function to handle MetaMask connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        ethBalance = (await balanceOfETH(signer)) / 10**18;
        bscBalance = (await balanceOfbnb(signer)) / 10**18;
        const address = await signer.getAddress();
        console.log('Account:', address);
        setWalletAddress(address); // Set the wallet address
        setSigner(signer); // Set the signer
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  };

  const handleClaimToken = async () => {
    if (!signer) {
      console.log('Signer is not set. Please connect to a wallet first.');
      return;
    }
    await whiteListedClaim(signer);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-start pt-24" style={{ backgroundColor: '#121212' }}>
      <header className="w-full flex justify-between items-center p-4 shadow-md fixed top-0 z-10" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
        <h1 className="text-xl font-bold">Claim Your Token</h1>
        {walletAddress ? (
          <p className="text-green-500">{walletAddress}</p>
        ) : (
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
            Connect Wallet
          </button>
        )}
      </header>

      <div className="flex flex-col items-center justify-center w-full mt-10">
        <div className="mb-4 text-center">
          <p style={{ color: '#4CAF50' }}>Your ETH Balance: {ethBalance} Gallen</p>
          <p style={{ color: '#FFC107' }}>Your BSC Balance: {bscBalance} Gallen</p>
        </div>
        <button onClick={handleClaimToken} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
          Claim Token
        </button>
      </div>
    </main>
  );
}
