import { useState, useEffect } from 'react';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useERC1155 } from '../../hyperverse-evm-erc1155-staker/source/react';
import { MdFileCopy } from 'react-icons/md';
import { Box } from '../ComponentStyles';
import { styled } from '@stitches/react';
import { useQuery } from 'react-query';

const GetPublicMint = () => {
	const { account } = useEthereum();
	const erc1155 = useERC1155();

	const { data: instance } = useQuery('checkInstance', () => erc1155.checkInstance!(account!), {
		enabled: !!erc1155.factoryContract,
	});

	const { data, isLoading } = useQuery('publicMint', () => erc1155.getPublicMint!(), {
		enabled: !!erc1155.factoryContract,
	});

	const [hidden, setHidden] = useState(false);

	return (
		<Box>
			<h4>Get Public Mint</h4>
			<p>Checks if public mint is active</p>
			<Content>
				<Button disabled={!account || !instance} onClick={() => setHidden((p) => !p)}>
					{!account
						? 'Connect Wallet'
						: !instance
						? 'You need an instance'
						: isLoading
						? 'fetching ...'
						: !hidden
						? 'Public Mint'
						: data}
				</Button>
			</Content>
		</Box>
	);
};

export default GetPublicMint;

export const Button = styled('button', {
	minWidth: '150px',
	backgroundColor: '$yellow100',
	outline: 'none',
	border: 'none',
	padding: '10px 15px',
	borderRadius: '90px',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.8,
	},
});


const Content = styled('div', {
	margin: '10px auto -5px',
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
	marginTop: '10px',
	justifyContent: 'center',
	alignItems: 'center',
});
