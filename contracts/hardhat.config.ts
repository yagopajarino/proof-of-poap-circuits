import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${""}`,
      accounts: [""],
    },
  },
  etherscan: {
    apiKey: { sepolia: "" },
  },
};

export default config;
