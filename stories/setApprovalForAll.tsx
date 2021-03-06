import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const ApproveAll = ({ ...props }: { to: string; approved: boolean }) => {
	const { setApprovalForAll } = useERC1155();
	const { address, Connect } = useEvm();

	return (
		<>
			<Connect />
			<button
				type="button"
				className={['storybook-button', `storybook-button--large`].join(' ')}
				style={{ color: 'blue' }}
				onClick={() => {
					setApprovalForAll(props);
				}}
			>
				Approve All
			</button>
		</>
	);
};
