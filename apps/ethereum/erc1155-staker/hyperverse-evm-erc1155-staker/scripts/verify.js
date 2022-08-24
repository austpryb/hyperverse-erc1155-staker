const hre = require('hardhat');
const fs = require('fs-extra');
const path = require('path');
// [rinkeby] NFT Contract deployed to: 0x81596B132e9995F94791B843EcB1c227b5983FF5
// [rinkeby] NFT Factory deployed to: 0x1742ac9494ce4C22e78c0f2f72f39A29F7748501

require('dotenv').config();


async function main() {
	const [deployer] = await ethers.getSigners();
	const hyperverseAdmin = deployer.address;

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());

  await hre.run('verify:verify', {
    address: env[hre.network.name].testnet.contractAddress, // nftContractAddress
    constructorArguments: [
      hyperverseAdmin
    ],
  })

  await hre.run('verify:verify', {
    address: env[hre.network.name].testnet.factoryAddress, // nftFactoryContractAddress
    constructorArguments: [
      env[hre.network.name].testnet.contractAddress, // nftContractAddress
      hyperverseAdmin
    ],
  })

	await hre.run('verify:verify', {
		address: env[hre.network.name].testnet.stakerAddress, // nftStakerContractAddress
		constructorArguments: [
			env[hre.network.name].testnet.proxyAddress // nftContractAddress
		],
	})
}

main()
	// .then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = { main };
