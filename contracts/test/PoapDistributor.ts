import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseContract, Contract } from "ethers";

describe("PoapDistributor", function () {
  let token: Contract;
  let verifier: BaseContract;
  let poapDistributor: any;
  let owner: any;
  let otherAccount: any;
  const initialSupply = ethers.parseUnits("1000", 18);
  const tokenAmount = ethers.parseUnits("10", 18);
  const hashes = [1234567890];
  const name = "Test POAP Distributor";
  const description = "A test instance of PoapDistributor";

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("Mock Token", "MTK", initialSupply);

    // Deploy a mock verifier
    const Verifier = await ethers.getContractFactory("MockVerifier");
    verifier = await Verifier.deploy();

    // Deploy the PoapDistributor contract
    const PoapDistributor = await ethers.getContractFactory("PoapDistributor");
    poapDistributor = await PoapDistributor.deploy(
      token.getAddress(),
      verifier.getAddress(),
      hashes,
      name,
      description
    );
    await poapDistributor.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await poapDistributor.token()).to.equal(token.address);
    });

    it("Should set the correct verifier address", async function () {
      expect(await poapDistributor.verifier()).to.equal(verifier.address);
    });

    it("Should store the correct metadata", async function () {
      expect(await poapDistributor.name()).to.equal(name);
      expect(await poapDistributor.description()).to.equal(description);
    });
  });

  describe("Token Reception", function () {
    it("Should receive tokens from participants", async function () {
      await token.approve(poapDistributor.address, tokenAmount);
      await poapDistributor.receiveTokens(tokenAmount);

      expect(await token.balanceOf(poapDistributor.address)).to.equal(
        tokenAmount
      );
    });
  });

  describe("Transaction Execution", function () {
    it("Should execute transaction and transfer tokens if verified", async function () {
      // Mock the verifier to always return true
      await verifier.setVerificationResult(true);

      await token.transfer(poapDistributor.address, tokenAmount);
      await poapDistributor.executeTransaction(hashes, "0x");

      expect(await token.balanceOf(owner.address)).to.equal(
        initialSupply - tokenAmount
      );
    });

    it("Should revert if verification fails", async function () {
      // Mock the verifier to return false
      await verifier.setVerificationResult(false);

      await expect(
        poapDistributor.executeTransaction(hashes, "0x")
      ).to.be.revertedWith("Verification failed");
    });

    it("Should revert if there are insufficient tokens", async function () {
      // Mock the verifier to always return true
      await verifier.setVerificationResult(true);

      await expect(
        poapDistributor.executeTransaction(hashes, "0x")
      ).to.be.revertedWith("Insufficient tokens");
    });
  });
});
