import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const SetModel = ({ ...props }: { tokenId: number,  model: string }) => {
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
					setModel(props.tokenId, props.model);
				}}
			>
				SetModel
			</button>
		</>
	);
};
