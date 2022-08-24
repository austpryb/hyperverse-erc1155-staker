import { useState, useEffect, useCallback } from 'react';
import { createContainer, useContainer } from '@decentology/unstated-next';
import { useHyperverse } from '@decentology/hyperverse/react';
import { useEvm } from '@decentology/hyperverse-evm/react';
import { ERC1155Library, ERC1155LibraryType } from '../erc1155Library';
import { useEvent } from 'react-use';

function ERC1155State(initialState: { tenantId: string } = { tenantId: '' }) {
	const { tenantId } = initialState;
	const { signer, readOnlyProvider } = useEvm();
	const hyperverse = useHyperverse();
	const [erc1155Library, setERC1155Library] = useState<ERC1155LibraryType>();

	useEffect(() => {
		const lib = ERC1155Library(hyperverse, signer || readOnlyProvider).then(setERC1155Library).catch(x => {
			// Ignoring stale library instance
		});

		return lib.cancel;
	}, [signer, readOnlyProvider]);

	const useERC1155Events = (eventName: string, callback: any) => {
		return useEvent(
			eventName,
			useCallback(callback, [erc1155Library?.nftProxyAddress]),
			erc1155Library?.nftProxyAddress
		);
	};

	return {
		...erc1155Library,
		loading: !erc1155Library,
		tenantId,
		useERC1155Events,
	};
}

export const ERC1155 = createContainer(ERC1155State);

export function useERC1155() {
	return useContainer(ERC1155);
}
