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

	// CREATE AN NFT PROXY INSTANCE FROM NFT FACTORY
	let proxyAddress = constants.AddressZero;
	const instanceTxn = await nftFactoryContract.createInstance('https://link.storjshare.io/s/', hyperverseAdmin);
	instanceTxn.wait();
	console.log('Proxy Instance Trx Created:', instanceTxn.hash, "using", hyperverseAdmin);

	while (proxyAddress === constants.AddressZero) {
		try {
			proxyAddress = await nftFactoryContract.getProxy(hyperverseAdmin);
			console.log(`[${hre.network.name}] NFT Proxy deployed to: ${proxyAddress}`);
		} catch (error) {
			proxyAddress = constants.AddressZero;
	  	//console.log(proxyAddress, error);
		}
	}
	// ****************************************************

  // DEPLOY NFT STAKER CONTRACT ON NFT PROXY ADDRESS
	const NFTStaker = await ethers.getContractFactory('CollectionStaker');
	const nftStakerContract = await NFTStaker.deploy(proxyAddress); // nftContract.address
	await nftStakerContract.deployed();
	console.log(`[${hre.network.name}] NFT Staker deployed to: ${nftStakerContract.address}`);
	// ****************************************************

	// PERSIST CONTRACT ADDRESSES
	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};
	env[hre.network.name].testnet.contractAddress = nftContract.address;
	env[hre.network.name].testnet.factoryAddress = nftFactoryContract.address;
	env[hre.network.name].testnet.stakerAddress = nftStakerContract.address;
	env[hre.network.name].testnet.proxyAddress = proxyAddress;
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });
	// ****************************************************

	// SET INITIAL STATE
	const proxyContract = await hre.ethers.getContractAt("ERC1155", proxyAddress);

	const getTenantOwner = await proxyContract.getTenantOwner();
	console.log('Tenant Owner:', getTenantOwner);

	const setModelTxn = await proxyContract.setModel(1, "\n[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[role_definition]\ng = _, _\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act");
	setModelTxn.wait();
	console.log('Set Model Trx Hash:', setModelTxn.hash);

	//const proxyContract = await hre.ethers.getContractAt("ERC1155", proxyAddress);
	const toggleMintTxn = await proxyContract.togglePublicMint();
	toggleMintTxn.wait();
	console.log('Toggle Mint Trx Hash:', toggleMintTxn.hash);

	//const proxyContract = await hre.ethers.getContractAt("ERC1155", proxyAddress);
	const mintingTxn = await proxyContract.mint(hyperverseAdmin, 1, 1);
	mintingTxn.wait();
	console.log('Minted Token Trx Hash:', mintingTxn.hash);

	const approveTxn = await proxyContract.setApprovalForAll(nftStakerContract.address, true); // nftContract, nftContract.address
	approveTxn.wait();
	console.log('Approved Token Send Trx Hash:', approveTxn.hash);

	const stakingTxn = await nftStakerContract.insertStaker(1, 1);
	stakingTxn.wait();
	console.log('Staked Token Trx Hash:', stakingTxn.hash);

	//const getStaker = await nftStakerContract.getStaker(hyperverseAdmin);
	//console.log('Staker Attributes:', getStaker);

	//const getStakers = await nftStakerContract.getStakers();
	//console.log('All Stakers:', getStakers);

	//const tokenMetadata = await proxyContract.tokenMetadata(1);
	//console.log('Token Metadata for Token Id = 1:', tokenMetadata);
	// ****************************************************

}

main()
	// .then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = { main };
