import { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useERC1155 } from  '../../hyperverse-evm-erc1155-staker/source/react';
import { toast } from 'react-toastify';
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

const SafeTransferFrom = () => {
	const { account } = useEthereum();
	const erc1155 = useERC1155();
	const { mutate, isLoading, error } = useMutation('safeTransferFrom', erc1155.safeTransferFrom);

	const [receiver, setReceiver] = useState<string>('');
	const [tokenId, setTokenId] = useState('');
	const [amount, setAmount] = useState('');


	const safeTransferFrom = async () => {
		try {
			const instanceData: { from: string, to: string; id: number, amount: number, data: string} = {
				from: account!,
				to: receiver,
				id: tokenId,
				amount: amount,
				data: "0x"
			};

			mutate(instanceData);
		} catch (error) {
			console.log('e', error);
			throw error;
		}
	};

	useEffect(() => {
		if (error) {
			console.log(error);
			if (error instanceof Error) {
				toast.error(error.message, {
					position: toast.POSITION.BOTTOM_CENTER,
				});
			}
		}
	}, [error]);

	return (
		<Box>
			<h4>Transfer NFT</h4>
			<p>Transfer your NFT to the provided address</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Transfer Tokens'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Receiver"
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
							<Button onClick={safeTransferFrom}>
								{!account
									? 'Connet Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Transfer'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default SafeTransferFrom;
