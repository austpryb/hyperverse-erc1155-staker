import { initialize, Network, NetworkConfig, Provider } from '@decentology/hyperverse';
import { Localhost, Ethereum } from '@decentology/hyperverse-evm';
import { FC, VFC } from 'react';
import * as ERC1155 from '../../source';

export const HyperverseProvider: FC<{}> = ({ children }) => {
	const hyperverse = initialize({
		blockchain: process.env.STORYBOOK_NETWORK === 'goerli' ? Ethereum : Localhost,
		network:
			process.env.STORYBOOK_NETWORK === 'goerli'
				? {
						type: Network.Testnet,
						name: process.env.STORYBOOK_NETWORK,
						chainId: 5,
						networkUrl: process.env.NEXT_PUBLIC_WEB3_BASE_URL + process.env.NEXT_PUBLIC_WEB3_API_KEY,
						providerId: process.env.NEXT_PUBLIC_WEB3_API_KEY,
						blockExplorer: 'goerli.etherscan.io',
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
					process.env.STORYBOOK_NETWORK === 'goerli'
						? String(process.env.NEXT_ADMIN_PUBLIC_KEY)
						: String(process.env.NEXT_ADMIN_PUBLIC_KEY),
			},
		],
	});
	return <Provider initialState={hyperverse}>{children}</Provider>;
};
