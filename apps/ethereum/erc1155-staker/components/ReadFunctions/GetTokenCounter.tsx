import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useERC1155 } from  '../../hyperverse-evm-erc1155-staker/source/react';
import {
	Box,
	Item,
	TriggerContainer,
	Trigger,
	Parameters,
	Input,
	Content,
	Button,
} from '../ComponentStyles';
import { useQuery } from 'react-query';
import { MdFileCopy } from 'react-icons/md';
import { styled } from '@stitches/react';

const GetTokenCounter = () => {
	const { account } = useEthereum();
	const [address, setAddress] = useState('');

	const erc1155 = useERC1155();
	const { data, isLoading } = useQuery('getTokenCounter', () => erc1155.getTokenCounter!(), {enabled: !!erc1155.nftProxyAddress});

	const [hidden, setHidden] = useState(false);

	const zeroAddress = data === '0x0000000000000000000000000000000000000000';

	return (
		<Box>
			<h4>Get Token Count</h4>
			<p>Get the total count of unique tokens</p>
			<Content>
				<Button disabled={!account} onClick={() => setHidden((p) => !p)}>
					{!account
						? 'Connect Wallet'
						: isLoading
						? 'fetching ...'
						: !hidden
						? 'Get Token Counter'
						: data ? data.toString() : 'Error Fetching'}
				</Button>
			</Content>
		</Box>
	);
};

const CopyButton = styled('button', {
	backgroundColor: 'transparent',
	marginLeft: '5px',
	outline: 'none',
	border: 'none',
	color: '$yellow100',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.8,
	},
});

export default GetTokenCounter;
