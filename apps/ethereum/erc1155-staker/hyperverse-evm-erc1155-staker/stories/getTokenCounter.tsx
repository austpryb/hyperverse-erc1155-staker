import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const GetTokenCounter = ({ ...props }: {}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (erc1155.getTokenCounter) {
			erc1155.getTokenCounter(props.id).then(setData);
		}
	}, [erc1155.getTokenCounter]);

	const totalSupply = () => {
		return data ? (
			<p>{JSON.stringify(data)}</p>
		) : (
			<p>Error.</p>
		);
	};

	return <div className="getTokenCounter"> Total Number of Models: {totalSupply()}</div>;
};
