const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MetaVaultPlots = await ethers.getContractFactory("MetaVaultPlots");
  
  // Deploy the contract
  const verifier = "0x0000000000000000000000000000000000000000"; // Replace with actual verifier address
  const platformFee = 250; // 2.5% platform fee
  
  const metaVaultPlots = await MetaVaultPlots.deploy(verifier, platformFee);
  
  await metaVaultPlots.waitForDeployment();
  
  const contractAddress = await metaVaultPlots.getAddress();
  
  console.log("MetaVaultPlots deployed to:", contractAddress);
  console.log("Verifier address:", verifier);
  console.log("Platform fee:", platformFee / 100, "%");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
