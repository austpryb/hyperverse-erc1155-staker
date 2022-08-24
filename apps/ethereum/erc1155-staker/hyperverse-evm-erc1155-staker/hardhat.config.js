require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const accounts = process.env.NEXT_PRIVATE_KEY !== undefined ? [process.env.NEXT_PRIVATE_KEY] : [];

const chainIds = {
    goerli: 5,
    hardhat: 1337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
		edge: 808080
};
//sudo pnpm hardhat run scripts/deploy.js --network rinkeby
module.exports = {
	etherscan: {
		apiKey: process.env.ETHERSCAN_TOKEN
	},
	solidity: '0.8.7',
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {},
		ethereum: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL + process.env.NEXT_PUBLIC_WEB3_API_KEY,
			chainId: chainIds['goerli'],
			accounts,
		},
		goerli: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL + process.env.NEXT_PUBLIC_WEB3_API_KEY,
			chainId: chainIds['goerli'],
			accounts,
		},
		edge: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL,
			chainId: chainIds['edge'],
			accounts,
		},
		avalanche: {
			url: 'https://api.avax-test.network/ext/bc/C/rpc',
			accounts,
		},
		polygon: {
			url: 'https://rpc-mumbai.maticvigil.com',
			accounts,
		},
	},
};
