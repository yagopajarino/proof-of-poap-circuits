// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface for the verifier contract
interface IVerifier {
    function verify(address sender, bytes32[] memory hashes, bytes memory signature) external view returns (bool);
}

// The PoapDistributor contract manages the distribution of ERC20 tokens based on verification
contract PoapDistributor {
    // ERC20 token contract used for distribution
    IERC20 public token;
    // Verifier contract used for transaction verification
    IVerifier public verifier;
    // Array to store hashes for verification purposes
    bytes32[] public storedHashes;

    // Metadata for the contract
    string public name;
    string public description;

    // Constructor to initialize the contract with token, verifier, hashes, and metadata
    constructor(
        address _tokenAddress,
        address _verifierAddress,
        bytes32[] memory _hashes,
        string memory _name,
        string memory _description
    ) {
        token = IERC20(_tokenAddress);
        verifier = IVerifier(_verifierAddress);
        storedHashes = _hashes;
        name = _name;
        description = _description;
    }

    // Function to receive tokens from participants
    function receiveTokens(uint256 amount) external {
        // Ensure the token transfer is successful
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
    }

    // Function to execute a transaction after verification
    function executeTransaction(bytes32[] memory hashes, bytes memory signature) external {
        // Verify the transaction using the verifier contract
        require(verifier.verify(msg.sender, hashes, signature), "Verification failed");
        // Check if there are enough tokens available for distribution
        require(token.balanceOf(address(this)) >= 10, "Insufficient tokens");

        // Transfer 10 tokens to the sender if verification is successful
        require(token.transfer(msg.sender, 10), "Token transfer failed");
    }
} 