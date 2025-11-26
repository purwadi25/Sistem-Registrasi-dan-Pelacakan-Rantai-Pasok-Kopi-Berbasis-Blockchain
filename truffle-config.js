const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "build/contracts"),

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337",
      gas: 6721975,
      gasPrice: 20000000000,
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "paris", 
      },
    },
  },
};
