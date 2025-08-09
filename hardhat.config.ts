import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;


module.exports = {
  solidity: "0.8.28", // Or your contract's Solidity version
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
	apiKey: ETHERSCAN_API_KEY
  }
};

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   networks: 
//   {
	
//     ganache: 
// 	{
//       url: "http://127.0.0.1:7545", 
//       accounts: [
//         "0x7ac5e1b81828d50f70ce8755a2144f310201b66a42d811928f1cb505a886239a", 
//         "0xf0b5d699d42623862d9e4537b0700ec9355ca88cc740bf7ec26302cfee5557e5",
// 		"0x2530c329cee569f598d1c391e86072fb4701db67a35aca13b0dd15941ab5230d",
// 		"0x37792c7c6948f170a66df67b71cad4617f255c84ee911665d2b4855a41c1cad4",
// 		"0x14da58527eb6fe0c5b7d8ce4ee84c89273b02c0e0e3cacecef06a3494359abbb",
// 		"0xe4601b205f19633e057824acf3ab30c444af83e7d28107b20ecadfe0004c917f",
// 		"0xdcc0d57bc47480cf4af62314dcb86eab28ce806a064b834c2c69f4617d7c8869",
// 		"0x8d556efa9e774866571c4ab3656e40bdfe8517f11d78ab85a7dcfd198a8b55a9",
// 		"0xe41c8ae5d5f6a5652ba7206e338beaad586124082759c91ab61edfb50f794f6a",
// 		"0x1e6c73c1292a8b97150787b182ad0ee693ce63fc3c69cc006542358cacbadcef"
//       ]
//     }
//   }
// };

// export default config;
