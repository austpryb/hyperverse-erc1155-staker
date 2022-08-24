import { Network, NetworkConfig } from "@decentology/hyperverse";

// Alchemy Override for Goerli (Rinkeby is deprecated)
const INFURA_ID = globalThis.process?.env?.INFURA_API_KEY! || 'hbH3MjTMjcRtyW8PxC8vyhg3TFthdCw4';
export const Networks : {[key in Network] : NetworkConfig} = {
	[Network.Mainnet]: {
		type: Network.Mainnet,
		name: 'mainnet',
		networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
		providerId: INFURA_ID,
		chainId: 1,
	},
	[Network.Testnet]: {
		type: Network.Testnet,
		name: 'goerli',
		chainId: 5,
		providerId: INFURA_ID,
		networkUrl: `https://eth-goerli.g.alchemy.com/v2/${INFURA_ID}`,
		blockExplorer: 'https://goerli.etherscan.io',
	},
};
