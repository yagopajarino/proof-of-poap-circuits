import { ethers } from "hardhat";

// scripts/deployDeployer.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Deployer = await ethers.getContractFactory("Deployer");
  const deployerContract = await Deployer.deploy();
  await deployerContract.waitForDeployment();

  console.log(
    "Deployer contract deployed to:",
    await deployerContract.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
