import { HyperverseConfig } from '@decentology/hyperverse';
import { EvmLibraryBase, getProvider } from '@decentology/hyperverse-evm';
import { ethers, BigNumber } from 'ethers';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { CancellablePromise, pseudoCancellable } from 'real-cancellable-promise';
import { getEnvironment } from './environment';

export type ERC1155LibraryType = Awaited<ReturnType<typeof ERC1155LibraryInternal>>;
export function ERC1155Library(
	...args: Parameters<typeof ERC1155LibraryInternal>
): CancellablePromise<ERC1155LibraryType> {
	return pseudoCancellable(ERC1155LibraryInternal(...args));
}

export async function ERC1155LibraryInternal(
	hyperverse: HyperverseConfig,
	providerOrSigner?: ethers.providers.Provider | ethers.Signer
) {
	const { FactoryABI, factoryAddress, ContractABI } = getEnvironment(
		hyperverse.blockchain?.name!,
		hyperverse.network
	);

	if (!providerOrSigner) {
		providerOrSigner = getProvider(hyperverse.network);
	}

	const base = await EvmLibraryBase(
		'ERC1155',
		hyperverse,
		factoryAddress!,
		FactoryABI,
		ContractABI,
		providerOrSigner
	);

	const getBalanceOf = async (account: string, id: number) => {
		try {
			const balance = await base.proxyContract?.balanceOf(account,id);

			return BigNumber.from(balance) as BigNumber;
		} catch (error) {
			throw error;
		}
	};

	const getTotalSupplyOf = async (id: number) => {
		try {
			const supply = await base.proxyContract?.totalSupply(id);
			return BigNumber.from(supply) as BigNumber;
		} catch (error) {
			throw error;
		}
	};

	const isInPolicyModelWhitelist = async (address: string) => {
		try {
			const whitelisted = await base.proxyContract?.policyModelWhitelist(address);
			return whitelisted;
		} catch (error) {
			throw error;
		}
	};

	const getTenantOwner = async () => {
		try {
			const tenantOwner = await base.proxyContract?.getTenantOwner();
			return tenantOwner;
		} catch (error) {
			throw error;
		}
	};

	const getTokenMetadata = async (tokenId: string) => {
		try {
			const metadata = await base.proxyContract?.tokenMetadata(tokenId);
			return metadata;
		} catch (error) {
			throw error;
		}
	};

  // Returns the number of models created. Every new model increments this counter by 1 so that they cannot be overwritten
	const getTokenCounter = async () => {
		try {
			const count = await base.proxyContract?.tokenCounter();
			return BigNumber.from(count) as BigNumber;
		} catch (error) {
			throw error;
		}
	};

	const createInstance = async () => {
		try {
			const createTxn = await base.factoryContract?.createInstance();
			return createTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const togglePublicMint = async () => {
		try {
			const toggle = await base.proxyContract?.togglePublicMint();
			return toggle.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const mint = async (to: string, tokenId: number, amount: number) => {
		try {
			const mintTxn = await base.proxyContract?.mint(to, tokenId, amount);
			return mintTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const transfer = async ({
		from,
		to,
		tokenId,
		amount,
		data
	}: {
		from: string;
		to: string;
		tokenId: number;
		amount: number;
		data: string
	}) => {
		try {
			const transferTxn = await base.proxyContract?.safeTransferFrom(from, to, tokenId, amount, data);
			return transferTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const setApprovalForAll = async ({ to, approved }: { to: string; approved: boolean }) => {
		try {
			const setApprovalTxn = await base.proxyContract?.setApprovalForAll(to, approved);
			return setApprovalTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const addWhitelistAddress = async (_address: string) => {
		try {
			const addWhitelistAddressAddressTxn = await base.proxyContract?.addWhitelistAddress(_address);
			return addWhitelistAddressAddressTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const removeWhitelistAddress = async (_address: string) => {
		try {
			const removeWhitelistAddressAddressTxn = await base.proxyContract?.removeWhitelistAddress(_address);
			return removeWhitelistAddressAddressTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const setModel = async (tokenId: number, model: string) => {
		try {
			const setModelTxn = await base.proxyContract?.setModel(_address);
			return setModelTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	return {
		...base,
		getBalanceOf, //
		getTotalSupplyOf, //
		isInPolicyModelWhitelist,
		removeWhitelistAddress,
		addWhitelistAddress,
		setModel,
	  //getExists,
		getTenantOwner,
		getTokenMetadata,
		getTokenCounter,
		togglePublicMint, //
		mint, //
		transfer, //
		setApprovalForAll, //
	};
}
