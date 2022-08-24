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
import { useMutation } from 'react-query';

const Mint = () => {
	const { account } = useEthereum();

	const erc1155 = useERC1155();
	const { mutate, isLoading } = useMutation('mint', erc1155.mint);

	const [receiver, setReceiver] = useState('');
	const [tokenId, setTokenId] = useState('');
	const [amount, setAmount] = useState('');

	const mint = async () => {
		try {
			const instanceData = {
				_to: receiver,
				_tokenId: tokenId,
				_amount: amount
			};
			mutate(instanceData);
		} catch (error) {
			throw error;
		}
	};

	return (
		<Box>
			<h4>Mint</h4>
			<p>Mint an ERC1155 NFT of the corresponding token identifier</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Mint NFT'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="To"
								onChange={(e) => setReceiver(e.target.value)}
							/>
							<Input
								placeholder="Token Identifier"
								onChange={(e) => setTokenId(e.target.value)}
							/>
							<Input
								placeholder="Amount"
								onChange={(e) => setAmount(e.target.value)}
							/>
							<Button onClick={mint}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Mint'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default Mint;
