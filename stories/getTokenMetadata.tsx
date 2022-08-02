import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const GetTokenMetadata = ({ ...props }: {tokenId: number}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (erc1155.getTokenMetadata) {
			erc1155.getTokenMetadata(props.tokenId).then(setData);
		}
	}, [erc1155.getTokenMetadata]);

	const getTokenMetadata = () => {
		return data ? (
			<p>{JSON.stringify(data)}</p>
		) : (
			<p>Error.</p>
		);
	};

	return <div className="getTokenMetadata"> Token Metadata for: {props.tokenId} {getTokenMetadata()}</div>;
};
