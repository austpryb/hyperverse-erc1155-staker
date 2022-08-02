import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const GetTotalSupplyOf = ({ ...props }: {id: number}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (erc1155.getTotalSupplyOf) {
			erc1155.getTotalSupplyOf(props.id).then(setData);
		}
	}, [erc1155.getTotalSupplyOf]);

	const totalSupply = () => {
		return data ? (
			<p>{JSON.stringify(data)}</p>
		) : (
			<p>Error.</p>
		);
	};

	return <div className="totalSupplyOf"> Total Supply of: {props.id} {totalSupply()}</div>;
};
