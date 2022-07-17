import { ethers, upgrades } from "hardhat"

async function main() {
  // We get the contract to deploy
  const Farm = await ethers.getContractFactory("MasterPred");
  // const farm = await upgrades.upgradeProxy("",
  //   Farm, {kind: "uups"}
  // );
  const predPerBlock = 5000000000;

  const farmImplAddrArr = (await ethers.provider.getStorageAt(
    "0x4b74C42b7aB96fEec003563c355f2fEfD0C80ee7",
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    )).split("");
  farmImplAddrArr.splice(2, 24);
  const farmImplAddr = farmImplAddrArr.join("");

  await Farm.attach(farmImplAddr).initialize("0xbdd2e3fdb879aa42748e9d47b7359323f226ba22", predPerBlock, 0, "0x7c52c575A9C302e5B071904214036146108531c2")
  console.log(`Farm implementation deployed to:${farmImplAddr}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });