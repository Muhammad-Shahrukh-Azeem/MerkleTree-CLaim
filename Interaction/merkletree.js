const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { whiteListedAddresses } = require("./wl");

// Create the Merkle tree with the initial data
const leafNodes = whiteListedAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// Function to generate Merkle proof for a given address
function generateMerkleProof(address) {
  const addressHash = keccak256(address).toString('hex');
  const hexProof = merkleTree.getHexProof(addressHash);
  return hexProof;
}

console.log("Merkle root: ", merkleTree.getRoot().toString("hex"))

module.exports = {
    generateMerkleProof
}
