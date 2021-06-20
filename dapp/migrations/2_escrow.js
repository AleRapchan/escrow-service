const Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
  deployer.deploy(Escrow);
};
