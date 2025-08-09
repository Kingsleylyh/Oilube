import { ethers } from "hardhat";

async function main() {

  const test = await ethers.deployContract("test");

  await test.waitForDeployment();

  console.log(`Test deployed to ${test.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});