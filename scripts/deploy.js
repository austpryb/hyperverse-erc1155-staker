// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const fs = require('fs-extra');
const path = require('path');
const { constants } = require('ethers');

require('dotenv').config();
async function main() {
	const [deployer] = await ethers.getSigners();
	const hyperverseAdmin = deployer.address;
	console.log('Deploying contracts with the account:', deployer.address);
	console.log('Account balance:', (await deployer.getBalance()).toString());

  // DEPLOY NFT AND FACTORY CONTRACT
	const NFT = await ethers.getContractFactory('ERC1155');
	const nftContract = await NFT.deploy(hyperverseAdmin);
	await nftContract.deployed();
	console.log(`[${hre.network.name}] NFT Contract deployed to: ${nftContract.address}`);


	const NFTFactory = await ethers.getContractFactory('ERC1155Factory');
	const nftFactoryContract = await NFTFactory.deploy(nftContract.address, hyperverseAdmin);
	await nftFactoryContract.deployed();
	console.log(`[${hre.network.name}] NFT Factory deployed to: ${nftFactoryContract.address}`);
  // ****************************************************

	// PERSIST CONTRACT ADDRESSES
	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};

	env[hre.network.name].testnet.contractAddress = nftContract.address;
	env[hre.network.name].testnet.factoryAddress = nftFactoryContract.address;
	// Save contract addresses back to file
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });
	// ****************************************************

	// CREATE AN NFT PROXY INSTANCE FROM FACTORY
	let proxyAddress = constants.AddressZero;
	const instanceTxn = await nftFactoryContract.createInstance('http://test.com/api/{id}.json', deployer.address);
	instanceTxn.wait();
	console.log('Instance Created:', instanceTxn.hash);

	while (proxyAddress === constants.AddressZero) {
		try {
			proxyAddress = await nftFactoryContract.getProxy(deployer.address);
		} catch (error) {
			proxyAddress = constants.AddressZero;
			//console.log(error);
		}
	}
	// ****************************************************
	console.log(`[${hre.network.name}] NFT Proxy deployed to: ${proxyAddress}`);

  // DEPLOY NFT STAKER CONTRACT USING PROXY ADDRESS
	const NFTStaker = await ethers.getContractFactory('CollectionStaker');
	const nftStakerContract = await NFTStaker.deploy(proxyAddress); // nftContract.address
	await nftStakerContract.deployed();
	console.log(`[${hre.network.name}] NFT Staker deployed to: ${nftStakerContract.address}`);
	// ****************************************************

	// PERSIST CONTRACT ADDRESSES
	//const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	//env[hre.network.name] = env[hre.network.name] || {};
	//env[hre.network.name].testnet = env[hre.network.name].testnet || {};

	//env[hre.network.name].testnet.stakerAddress = nftStakerContract.address;
	// Save contract addresses back to file
	//fs.writeJsonSync('contracts.json', env, { spaces: 2 });
	// ****************************************************

	// SET INITIAL STATE
	const mintingTxn = await nftContract.unSafeMint(0, 1);
	mintingTxn.wait();
	console.log('Minted Token Trx Hash:', mintingTxn.hash);

	const proxyContract = await hre.ethers.getContractAt("ERC1155", proxyAddress);
	const mintToken = await proxyContract.unSafeMint(0, 1);
	console.log("Trx hash:", mintToken.hash);

	const approveTxn = await proxyContract.setApprovalForAll(nftStakerContract.address, true); // nftContract, nftContract.address
	approveTxn.wait();
	console.log('Approved Token Send Trx Hash:', approveTxn.hash);

	const stakingTxn = await nftStakerContract.stake(0, 1);
	stakingTxn.wait();
	console.log('Staked Token Trx Hash:', stakingTxn.hash);
	// ****************************************************

}

main()
	// .then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = { main };
