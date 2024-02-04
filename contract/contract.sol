// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract claim is Ownable{

    // Change merkleroot before deploying  

    bytes32 public merkleroot = 0x219f6dd39c798084dcb9a2072b5ea2dd8200cdeb04cddc9ddce684a5520fefd9;

    // Change contract2Address before deploying  


    address public contract2Address = 0x99703F85d9E43c53d0cD10806DBddA5B53375D65;

    mapping(address => bool) public whiteListed;

    mapping(address => bool) public whiteListed2;


    constructor() Ownable(msg.sender){}


    function addWl(address rec) public onlyOwner{
        whiteListed2[rec] = true;
    }

    function whiteListedClaim(bytes32[] calldata _merkleProof, uint balance) external {
        require(!whiteListed[msg.sender], "Already Calimed");

        bytes32 leaf = keccak256(abi.encode(msg.sender));

        require(
            MerkleProof.verify(_merkleProof, merkleroot, leaf),
            "Invalid Proof"
        );

        whiteListed[msg.sender] = true;

        IERC20 c2 = IERC20(contract2Address);
        c2.transfer(msg.sender, balance);
    }

    
    function claim2() external {
        require(whiteListed2[msg.sender], "You must be whitelisted first");

        whiteListed2[msg.sender] = false;

        IERC20 c2 = IERC20(contract2Address);
        c2.transfer(msg.sender, balance);

    }

    
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
