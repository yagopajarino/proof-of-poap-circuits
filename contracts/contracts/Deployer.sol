   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   import { PoapDistributor } from "./PoapDistributor.sol";
 
   // The Deployer contract is responsible for deploying instances of the PoapDistributor contract.
   contract Deployer {
       // Array to store addresses of deployed PoapDistributor contracts
       PoapDistributor[] public deployedContracts;

       // Function to deploy a new PoapDistributor contract
       // Accepts parameters for the token address, verifier address, hashes, and metadata
       function deployPoapDistributor(
           address _tokenAddress,
           address _verifierAddress,
           uint256[] memory _hashes,
           string memory _name,
           string memory _description
       ) public {
           // Deploy a new PoapDistributor contract with the provided parameters
           PoapDistributor newContract = new PoapDistributor(_tokenAddress, _verifierAddress, _hashes, _name, _description);
           // Store the address of the newly deployed contract
           deployedContracts.push(newContract);
       }

       // Function to retrieve the list of deployed PoapDistributor contracts
       function getDeployedContracts() public view returns (PoapDistributor[] memory) {
           return deployedContracts;
       }
   }