import { initialize, Network, NetworkConfig, Provider } from '@decentology/hyperverse';
import { Localhost, Ethereum } from '@decentology/hyperverse-evm';
import { FC, VFC } from 'react';
import * as ERC1155 from '../../source';

export const HyperverseProvider: FC<{}> = ({ children }) => {
	const hyperverse = initialize({
		blockchain: process.env.STORYBOOK_NETWORK === 'edge' ? Ethereum : Localhost,
		network:
			process.env.STORYBOOK_NETWORK === 'edge'
				? {
						type: Network.Testnet,
						name: 'edge',
						chainId: 808080,
						networkUrl: process.env.NEXT_PUBLIC_WEB3_BASE_URL + process.env.NEXT_PUBLIC_WEB3_API_KEY,
						providerId: process.env.NEXT_PUBLIC_WEB3_API_KEY,
						//blockExplorer: 'https://rinkeby.etherscan.io',
				  }
				: {
						type: Network.Testnet,
						chainId: 31337,
						name: 'localhost',
						networkUrl: 'http://localhost:6006/hyperchain',
				  },
		modules: [
			{
				bundle: ERC1155,
				tenantId:
					process.env.STORYBOOK_NETWORK === 'edge'
						? '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81'
						: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81',
			},
		],
	});
	return <Provider initialState={hyperverse}>{children}</Provider>;
};
