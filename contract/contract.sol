// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract claim is Ownable{

    // Change merkleroot before deploying  

    bytes32 public merkleroot = 0x175fe0d88f2c38afc2c43aa259a2adc4ff9c284c9ac8f7bf87f23ce43a6378ac;

    // Change contract2Address before deploying  


    address public contract2Address = 0x4Bb296ADc3B003187175794A6F7f78593682f951;

    mapping(address => bool) public whiteListed;

    mapping(address => bool) public whiteListed2;


    constructor() Ownable(msg.sender){}


    function addWl(address rec) public onlyOwner{
        whiteListed2[rec] = true;
    }

    function whiteListedClaim(bytes32[] calldata _merkleProof, uint balance) external {
        require(balance > 0, "Invalid balance");
        if (!whiteListed[msg.sender]) {
            // Attempt whitelisted claim
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            if (MerkleProof.verify(_merkleProof, merkleroot, leaf)) {
                whiteListed[msg.sender] = true; // Mark as claimed
                IERC20(contract2Address).transfer(msg.sender, balance);
                return; // Exit after successful whitelisted claim
            }
        }

        if (whiteListed2[msg.sender]) {
            whiteListed2[msg.sender] = false;
            IERC20(contract2Address).transfer(msg.sender, balance);
            return;
        } else {
            revert("Not eligible for any claim");
        }
    }
    

    
    // function claim2(uint balance) external {
    //     require(whiteListed2[msg.sender], "You must be whitelisted first");

    //     whiteListed2[msg.sender] = false;

    //     IERC20 c2 = IERC20(contract2Address);
    //     c2.transfer(msg.sender, balance);

    // }

    
    function retrieveAmount(uint256 amount) public onlyOwner {
        IERC20 c2 = IERC20(contract2Address);
        c2.transfer(msg.sender, amount);
    }

    function retrieveAll() public onlyOwner {
        IERC20 c2 = IERC20(contract2Address);
        uint256 balance = c2.balanceOf(address(this));
        c2.transfer(msg.sender, balance);
    }
}