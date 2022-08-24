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

const SetTokenUri = () => {
	const { account } = useEthereum();
	const erc1155 = useERC1155();
	const { mutate, error, isLoading } = useMutation('setTokenUri', erc1155.setTokenUri);

	const [tokenId, setTokenId] = useState('');
	const [tokenUri, setTokenUri] = useState('');

	const setUri = async () => {
		try {
			const instanceData: { tokenId: number, newUri: string } = {
				tokenId: tokenId,
				newUri: tokenUri
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
			<h4>Set Token URI</h4>
			<p>Set the token URI for your ERC1155</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Set Token URI'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Token Identifier"
								onChange={(e) => setTokenId(e.target.value)}
							/>
							<Input
								placeholder="URI"
								onChange={(e) => setTokenUri(e.target.value)}
							/>
							<Button onClick={setUri}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Set Token URI'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default SetTokenUri;
