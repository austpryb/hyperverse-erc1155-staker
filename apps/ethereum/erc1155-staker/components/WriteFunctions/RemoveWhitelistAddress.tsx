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

const RemoveWhitelistAddress = () => {
	const { account } = useEthereum();
	const erc1155 = useERC1155();
	const { mutate, error, isLoading } = useMutation('removeWhitelistAddress', erc1155.removeWhitelistAddress);

	const [address, setAddress] = useState('');

	const removeWhitelistAddress = async () => {
		try {
			const instanceData: { _address: string } = {
				_address: address
			};
			mutate(instanceData);
		} catch (error) {
			//console.log('e', error);
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
			<h4>Remove Address</h4>
			<p>Remove a whitelisted address from policy create</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Remove Whitelist Address'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Address"
								onChange={(e) => setAddress(e.target.value)}
							/>
							<Button onClick={removeWhitelistAddress}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Remove Address'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default RemoveWhitelistAddress;
