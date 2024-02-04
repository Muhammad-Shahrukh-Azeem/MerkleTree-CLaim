import { ethers } from 'ethers';
import ERC20 from "./ERC20.json" assert { type: 'json' };
import CLAIM from "./claim.json" assert { type: 'json' };
import { generateMerkleProof } from './merkletree';

let providerETH = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Hp5Za9Qlo3bRwT6zxRWtwzVoGq7Uqe8s"); // MAINNET
let providerBNB = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/"); // TESTNET

const ClaimingAddress = "";  //Claiming contract address
const TokenAddress = "";  // TOken address of holders


// const tokenAddressBNB = ""  // Token address of claiming token

const ratio = 5; // This is in percentage, change it accordingly

export const whiteListedClaim = async (signer) => {
    try {
        let claiming = new ethers.Contract(ClaimingAddress, CLAIM.abi, signer);
        let balance = await balanceOfbnb(signer);
        let merkleProof = generateMerkleProof(signer.address);


        let percentage = ethers.BigNumber.from(ratio);
        let hundred = ethers.BigNumber.from(100);
        let amount = balance.mul(percentage).div(hundred);
        
        let whitelistedClaim = await claiming.whiteListedClaim(merkleProof, amount);
        return whitelistedClaim;
    } catch (error) {
        console.error(`Error in whitelistedClaim: ${error}`);
    }
}


export const balanceOfETH  = async (signer) => {
    try {
        let tokenContract = new ethers.Contract(TokenAddress, ERC20.abi, providerETH);
        let address = await signer.getAddress()
        let balance = await tokenContract.balanceOf(address);
        return balance;
    } catch (error) {
        console.error(`Error in balanceOf: ${error}`);
    }
}


export const balanceOfbnb = async (signer) => {
    try {
        let tokenContract = new ethers.Contract(TokenAddress, ERC20.abi, providerBNB);
        let address = await signer.getAddress()
        let balance = await tokenContract.balanceOf(address);
        return balance;
    } catch (error) {
        console.error(`Error in balanceOf: ${error}`);
    }
}