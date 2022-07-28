import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const GetBalanceOf = ({ ...props }: {account: string, tokenId: number}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(props.account);

	useEffect(() => {
		if (erc1155.getBalanceOf) {
			erc1155.getBalanceOf(props.tokenId).then(setData);
		}
	}, [props.tokenId, props.account, erc1155.getOwnerOf]);

	const balance = () => {
		return data ? (
			<p>{data}</p>
		) : (
			<p>Error!</p>
		);
	};

	return <div className="balanceOf"> Balance of token {props.tokenId}: {balance()}</div>;
};
