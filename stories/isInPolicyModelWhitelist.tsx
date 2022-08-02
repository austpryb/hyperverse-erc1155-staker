import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const IsInPolicyModelWhitelist = ({ ...props }: {address: string}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (erc1155.isInPolicyModelWhitelist) {
			erc1155.isInPolicyModelWhitelist(props.address).then(setData);
		}
	}, [erc1155.isInPolicyModelWhitelist]);

	const whitelisted = () => {
		return data ? (
			<p>{JSON.stringify(data)}</p>
		) : (
			<p>Error.</p>
		);
	};

	return <div className="isInPolicyModelWhitelist"> {props.address} is in whitelist? {whitelisted()}</div>;
};
