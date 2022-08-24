import { ERC1155 } from './useERC1155';
import { FC } from 'react';
import { HyperverseModuleInstance } from '@decentology/hyperverse';

const Provider: FC<HyperverseModuleInstance> = ({ children, tenantId }) => {
	if (!tenantId) {
		throw new Error('Tenant ID is required');
	}
	return <ERC1155.Provider initialState={{ tenantId: tenantId }}>{children}</ERC1155.Provider>;
};

export { Provider };
