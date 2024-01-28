import { ethers } from 'ethers';
import { useState } from 'react';

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState(null); // State to store wallet address

  // Function to handle MetaMask connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request access to account
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('Account:', address);
        setWalletAddress(address); // Set the wallet address
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  };

  const handleClaimToken = () => {
    console.log('Claiming tokens:', tokenAmount);
  };

  // Dummy balance values, replace with actual logic to fetch balances
  const ethBalance = '1.5 ';
  const bscBalance = '3.2 ';

  return (
    <main
      className="flex flex-col min-h-screen items-center justify-start pt-24"
      style={{ backgroundColor: '#121212' }} // Dark background for the main area
    >
      <header
        className="w-full flex justify-between items-center p-4 shadow-md fixed top-0 z-10"
        style={{ backgroundColor: '#1A1A1A', color: 'white' }} // Dark header background
      >
        <h1 className="text-xl font-bold">Claim Your Token</h1>
        {walletAddress ? (
          <p className="text-green-500">{walletAddress}</p> // Display wallet address if connected
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <div className="flex flex-col items-center justify-center w-full mt-10">
        <div className="mb-4 text-center">
          <p style={{ color: '#4CAF50' }}>Your ETH Balance: {ethBalance} Gallen</p>
          <p style={{ color: '#FFC107' }}>Your BSC Balance: {bscBalance} Gallen</p>
        </div>
        <input
          type="text"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          placeholder="Enter token amount"
          className="mb-4 p-2 border border-gray-700 rounded w-1/3"
          style={{ backgroundColor: '#2A2A2A', color: 'white' }} // Dark input field
        />
        <button
          onClick={handleClaimToken}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
        >
          Claim Token
        </button>
      </div>

      {/* Rest of your existing code goes here */}
    </main>
  );
}
