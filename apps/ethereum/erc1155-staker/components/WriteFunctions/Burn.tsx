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

const Burn = () => {
	const { account } = useEthereum();

	const erc1155 = useERC1155();
	const { mutate, isLoading } = useMutation('burn', erc1155.burn);

	const [from, setFrom] = useState('');
	const [tokenId, setTokenId] = useState('');
	const [amount, setAmount] = useState('');

	const burn = async () => {
		try {
			const instanceData = {
				account: from,
				tokenId: tokenId,
				amount: amount
			};
			mutate(instanceData);
		} catch (error) {
			throw error;
		}
	};

	return (
		<Box>
			<h4>Burn</h4>
			<p>Burn an ERC1155 NFT of the corresponding token identifier</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Burn NFT'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Account"
								onChange={(e) => setFrom(e.target.value)}
							/>
							<Input
								placeholder="Token Identifier"
								onChange={(e) => setTokenId(e.target.value)}
							/>
							<Input
								placeholder="Amount"
								onChange={(e) => setAmount(e.target.value)}
							/>
							<Button onClick={burn}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Burn'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default Burn;
