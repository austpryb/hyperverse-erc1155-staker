import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const AddWhitelistAddress = ({ ...props }: { _address: string }) => {
	const { mint } = useERC1155();
	const { address, Connect } = useEvm();
	//console.log(address)

	return (
		<>
			<Connect />
			<button
				type="button"
				className={['storybook-button', `storybook-button--large`].join(' ')}
				style={{ color: 'blue' }}
				onClick={() => {
					addWhitelistAddress(props._address);
				}}
			>
				AddWhitelistAddress
			</button>
		</>
	);
};
