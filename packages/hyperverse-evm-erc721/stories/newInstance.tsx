import { useERC721 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const NewInstance = ({ ...props }) => {
	const { createInstance } = useERC721();
	const { address, connect } = useEvm();

	return address ? (
		<button
			type="button"
			className={['storybook-button', `storybook-button--large`].join(' ')}
			style={{ color: 'blue' }}
			onClick={() => {
				createInstance(address);
				console.log("on click", address)
			}}
		>
			New Instance
		</button>
	) : (
		<button
			type="button"
			className={['storybook-button', `storybook-button--large`].join(' ')}
			style={{ color: 'blue' }}
			onClick={() => {
				connect();
			}}
		>
			Connect
		</button>
	);
};
