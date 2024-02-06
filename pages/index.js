import { ethers } from 'ethers';
import { useState } from 'react';
import { whiteListedClaim, balanceOfbnb, balanceOfETH } from '../Interaction/init';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [ethBalance, setEthBalance] = useState(0); // Use state for ETH balance
  const [bscBalance, setBscBalance] = useState(0); // Use state for BSC balance

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const ethBalanceValue = (await balanceOfETH(signer)) / 10**18;
        const bscBalanceValue = (await balanceOfbnb(signer)) / 10**18;
        const address = await signer.getAddress();
        console.log("Balance bnb: ", bscBalanceValue)
        console.log('Account:', address);
        setWalletAddress(address); // Set the wallet address
        setSigner(signer); // Set the signer
        setEthBalance(ethBalanceValue); // Update ETH balance state
        setBscBalance(bscBalanceValue); // Update BSC balance state
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
