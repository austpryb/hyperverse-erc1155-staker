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

	const getBalanceOf = async (account: string, tokenId: number) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const balance = await base.nftProxyAddress?.balanceOf(account, tokenIdBig);
			return BigNumber.from(balance) as BigNumber;
		} catch (error) {
			throw error;
		}
	};

	const getTotalSupplyOf = async (tokenId: number) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const supply = await base.nftProxyAddress?.totalSupply(tokenIdBig);
			//return BigNumber.from(supply) as BigNumber;
			return supply;
		} catch (error) {
			throw error;
		}
	};

	const isInPolicyModelWhitelist = async (address: string) => {
		try {
			const whitelisted = await base.nftProxyAddress?.policyModelWhitelist(address);
			return whitelisted;
		} catch (error) {
			throw error;
		}
	};

	const getTenantOwner = async () => {
		console.log(base.proxyContract);
		try {
			const tenantOwner = await base.proxyContract?.getTenantOwner();
			return tenantOwner;
		} catch (error) {
			throw error;
		}
	};

	const getTokenMetadata = async (tokenId: number) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const metadata = await base.nftProxyAddress?.tokenMetadata(tokenIdBig);
			return metadata;
		} catch (error) {
			throw error;
		}
	};

	const getApprovedForAll = async (account: string, operator: string) => {
		try {
			const approved = await base.nftProxyAddress?.isApprovedForAll(account, operator);
			return approved;
		} catch (error) {
			throw error;
		}
	};

	const getTokenUri = async (tokenId: number) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const uri = await base.nftProxyAddress?.uri(tokenIdBig);
			return uri;
		} catch (error) {
			throw error;
		}
	};

  // Returns the number of models created. Every new model increments this counter by 1 so that they cannot be overwritten
	const getTokenCounter = async () => {
		try {
			const count = await base.nftProxyAddress?.tokenCounter();
			//return count;
			return BigNumber.from(count) as BigNumber;
		} catch (error) {
			throw error;
		}
	};

	const createInstance = async () => {
		try {
			const createTxn = await base.nftFactoryAddress?.createInstance();
			return createTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const togglePublicMint = async () => {
		try {
			const toggle = await base.nftProxyAddress?.togglePublicMint();
			return toggle.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const mint = async ({
			_to,
			_tokenId,
			_amount
		}: {
			_to: string,
			_tokenId: number,
			_amount: number
			}) => {
		const tokenIdBig = BigNumber.from(_tokenId) as BigNumber;
		const amountBig = BigNumber.from(_amount) as BigNumber;
		try {
			const mintTxn = await base.nftProxyAddress?.mint(_to, tokenIdBig, amountBig);
			return mintTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const burn = async ({
			account,
			tokenId,
			amount
		}: {
			account: string,
			tokenId: number,
			amount: number
			}) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		const amountBig = BigNumber.from(amount) as BigNumber;
		try {
			const burnTxn = await base.nftProxyAddress?.burn(account, tokenIdBig, amountBig);
			return burnTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const safeTransferFrom = async ({
		from,
		to,
		id,
		amount,
		data
	}: {
		from: string,
		to: string,
		id: number,
		amount: number,
		data: string
	}) => {
		const tokenIdBig = BigNumber.from(id) as BigNumber;
		const amountBig = BigNumber.from(amount) as BigNumber;
		try {
			const transferTxn = await base.nftProxyAddress?.safeTransferFrom(from, to, tokenIdBig, amountBig, data);
			return transferTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const setApprovalForAll = async ({ operator, approved }: { operator: string; approved: boolean }) => {
		try {
			const setApprovalTxn = await base.nftProxyAddress?.setApprovalForAll(operator, approved);
			return setApprovalTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const setTokenUri = async ({ tokenId, newUri }: { tokenId: number; newUri: string }) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const setApprovalTxn = await base.nftProxyAddress?.setTokenUri(tokenIdBig, newUri);
			return setApprovalTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const addWhitelistAddress = async ({ _address }: { _address: string }) => {
		try {
			const addWhitelistAddressTxn = await base.nftProxyAddress?.addWhitelistAddress(_address);
			return addWhitelistAddressTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const removeWhitelistAddress = async ({ _address }: { _address: string })=> {
		try {
			const removeWhitelistAddressTxn = await base.nftProxyAddress?.removeWhitelistAddress(_address);
			return removeWhitelistAddressTxn.wait() as TransactionReceipt;
		} catch (error) {
			throw error;
		}
	};

	const setModel = async (tokenId: number, model: string) => {
		const tokenIdBig = BigNumber.from(tokenId) as BigNumber;
		try {
			const setModelTxn = await base.nftProxyAddress?.setModel(tokenIdBig, model);
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
		setTokenUri,
		getApprovedForAll,
		getTokenUri,
		getTenantOwner,
		getTokenMetadata,
		getTokenCounter,
		togglePublicMint, //
		mint, //
		burn,
		safeTransferFrom, //
		setApprovalForAll, //
	};
}
