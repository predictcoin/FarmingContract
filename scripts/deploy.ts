import { ethers, upgrades } from "hardhat"

async function main() {
  // We get the contract to deploy
  const predPerBlock = 1000000000;
  const Pred = await ethers.getContractFactory("Predictcoin");
  const pred = await Pred.deploy();

  const Wallet = await ethers.getContractFactory("MasterPredWallet")
  const wallet = await Wallet.deploy(pred.address);
  const Farm = await ethers.getContractFactory("MasterPred");
  const farm = await upgrades.deployProxy(Farm, [pred.address, predPerBlock, 0, wallet.address], {kind: "uups"})
  await wallet.setMasterPred(farm.address);

  console.log(`Farm deployed to:${farm.address}, wallet deployed to:${wallet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
