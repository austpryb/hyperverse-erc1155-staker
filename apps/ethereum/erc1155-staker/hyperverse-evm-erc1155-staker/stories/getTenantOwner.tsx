import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import { useEffect, useState } from 'react';

export const GetTenantOwner = ({ ...props }: {}) => {
	const erc1155 = useERC1155();
	const { address } = useEvm();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (erc1155.getTenantOwner) {
			erc1155.getTenantOwner().then(setData);
		}
	}, [erc1155.getTenantOwner]);

	const getTenantOwner = () => {
		return data ? (
			<p>{JSON.stringify(data)}</p>
		) : (
			<p>Error.</p>
		);
	};

	return <div className="getTenantOwner"> Tenant Owner: {getTenantOwner()}</div>;
};
