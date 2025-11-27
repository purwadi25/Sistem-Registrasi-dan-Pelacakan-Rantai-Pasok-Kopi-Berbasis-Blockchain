const RegistrasiKopi = artifacts.require("RegistrasiKopi");

module.exports = async function (deployer) {
  await deployer.deploy(RegistrasiKopi);
};
