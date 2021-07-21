import "@nomiclabs/hardhat-waffle";
import '@openzeppelin/hardhat-upgrades'
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.0",
      },
      {
        version: "0.6.2",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.8.2",
      },
    ],
  },
};
