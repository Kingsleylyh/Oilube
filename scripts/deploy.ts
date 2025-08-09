import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {

  const Oilube = await hre.ethers.getContractFactory("Oilube");
  
 const oilube = await Oilube.deploy();

  await oilube.waitForDeployment();

  console.log(`Oilube deployed to ${oilube.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});