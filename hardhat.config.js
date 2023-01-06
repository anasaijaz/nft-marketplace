require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    hardhat:{
      chainId: 1337
    },
    goerli:{
      url: process.env.INFURA_URL,
      accounts:[process.env.WALLET_PRIVATE_KEY]
    },
    shardeum: {
      url: process.env.SHARDEUM_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8081,
    }
  }
};
