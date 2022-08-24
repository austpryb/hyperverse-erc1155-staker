import { useERC1155 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const MintNFT = ({ ...props }: { to: string,  tokenId: number,  amount: number }) => {
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
					mint(address, props.tokenId, props.amount);
				}}
			>
				Mint
			</button>
		</>
	);
};
