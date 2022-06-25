import { useState, useEffect, useCallback } from 'react';
import { useEvent } from 'react-use';
import { createContainer, useContainer } from '@decentology/unstated-next';
import { useHyperverse } from '@decentology/hyperverse';
import { useEvm } from '@decentology/hyperverse-evm';
import { ERC1155Library, ERC1155LibraryType } from './erc1155Library';

function ERC1155State(initialState: { tenantId: string } = { tenantId: '' }) {
	const { tenantId } = initialState;
	// console.log(tenantId);
	const { signer, readOnlyProvider } = useEvm();
	//console.log(signer);
	const hyperverse = useHyperverse();
	const [erc1155Library, setERC1155Library] = useState<ERC1155LibraryType>();

	useEffect(() => {
		const lib = ERC1155Library(hyperverse, signer || readOnlyProvider).then(setERC1155Library);
		//console.log(hyperverse);
		return () => {
			return lib.cancel();
		};
	}, [signer, readOnlyProvider]);

	const useERC1155Events = (eventName: string, callback: any) => {
		return useEvent(
			eventName,
			useCallback(callback, [erc1155Library?.proxyContract]),
			erc1155Library?.proxyContract
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
