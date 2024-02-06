import { ethers } from 'ethers';
import ERC20 from "./ERC20.json" assert { type: 'json' };
import CLAIM from "./claim.json" assert { type: 'json' };
import { generateMerkleProof } from './merkletree';

// Test Chain = Sepolia
// Test Token Address = 0x4Bb296ADc3B003187175794A6F7f78593682f951
// Test claim contract = 0x6fb071A3FD4dD49d528374953517CF7330345079

// let providerETH = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Hp5Za9Qlo3bRwT6zxRWtwzVoGq7Uqe8s"); // MAINNET
// let providerBNB = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/"); 

let providerBNB = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/feB5u-s6-eZrV7lkC9RES4IQpNVTD0PY");


const ClaimingAddress = "0x6fb071A3FD4dD49d528374953517CF7330345079";  //Claiming contract address
const TokenAddress = "0x4Bb296ADc3B003187175794A6F7f78593682f951";  // Token address of holders this is test token


// const tokenAddressBNB = ""  // Token address of claiming token

const ratio = 5; // This is in percentage, change it accordingly

export const whiteListedClaim = async (signer) => {
    try {
        let address = await signer.getAddress()
        let claiming = new ethers.Contract(ClaimingAddress, CLAIM.abi, signer);
        let balance = await balanceOfbnb(signer);
        console.log("User Address: ", address)

        let merkleProof = generateMerkleProof(address);
        console.log("Merkle proof", merkleProof)
        console.log("Balance: ", balance.toString())


        let percentage = ethers.BigNumber.from(ratio);
        let hundred = ethers.BigNumber.from(100);
        let amount = balance.mul(percentage).div(hundred);

        console.log("Claim Amount: ", amount.toString())

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