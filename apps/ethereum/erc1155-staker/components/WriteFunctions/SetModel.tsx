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

const SetModel = () => {
	const { account } = useEthereum();
	const erc1155 = useERC1155();
	const { mutate, error, isLoading } = useMutation('setModel', erc1155.setModel);

	const [tokenId, setTokenId] = useState('');
	const [model, setModel] = useState('');

	const setModelData = async () => {
		try {
			const instanceData: { tokenId: number, model: string } = {
				tokenId: tokenId,
				model: model
			};
			mutate(instanceData);
		} catch (error) {
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
			<h4>Set Token Model</h4>
			<p>Set a token's policy model data</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Set Token Model'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Token Identifier"
								onChange={(e) => setTokenId(e.target.value)}
							/>
							<Input
								placeholder="Model"
								onChange={(e) => setModel(e.target.value)}
							/>
							<Button onClick={setModelData}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Set Token Model'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default SetModel;
