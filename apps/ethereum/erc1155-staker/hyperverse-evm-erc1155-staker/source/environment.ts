import {
	isEvm,
	Blockchain,
	BlockchainEvm,
	EvmEnvironment,
	NetworkConfig,
} from '@decentology/hyperverse';

import Contracts from '../contracts.json';
import { ContractInterface } from 'ethers';
import ERC1155FactoryABI from '../artifacts/contracts/ERC1155Factory.sol/ERC1155Factory.json';
import ERC1155ABI from '../artifacts/contracts/ERC1155.sol/ERC1155.json';

export const FactoryABI = ERC1155FactoryABI.abi as ContractInterface;
export const ContractABI = ERC1155ABI.abi as ContractInterface;

const environment = Contracts as EvmEnvironment;

function getEnvironment(blockchainName: Blockchain, network: NetworkConfig) {
	if (blockchainName == null) {
		throw new Error('Blockchain is not set');
	}
	if (!isEvm(blockchainName)) {
		throw new Error('Blockchain is not EVM compatible');
	}

	const chain = environment[blockchainName as BlockchainEvm];
	if (!chain) {
		throw new Error('Blockchain is not supported');
	}
	const env = chain[network.type];
	//console.log(chain, blockchainName);
	return {
		...env,
		ContractABI,
		FactoryABI,
	};
}

export { environment, getEnvironment };
