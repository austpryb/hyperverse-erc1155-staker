import { useContext, useState } from 'react';
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

import { useQuery, useMutation } from 'react-query';
import { AppContext } from '../../pages/_app';

const CreateInstance = () => {
	const { account } = useEthereum();
	const context = useContext(AppContext);
	const { createInstance, checkInstance, factoryContract } = useERC1155();
	const { data: instance } = useQuery('instance', () => checkInstance!(account), {
		enabled: !!factoryContract,
	});
	const { mutate, isLoading } = useMutation('createTokenInstance', createInstance);

	const [tokenName, setTokenName] = useState('');
	const [tokenSymbol, setTokenSymbol] = useState('');

	const createNewInstance = async () => {
		try {
			mutate(
				{
					account: account!,
					tokenName,
					tokenSymbol,
				},
				{
					onSuccess: () => {
						context.setTenantId(account!);
					},
				}
			);
		} catch (error) {
			throw error;
		}
	};

	return (
		<Box>
			<h4>Create New ERC1155</h4>
			<p>Create your own instance of an ERC1155 Token Contract</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account || instance}>
							{!account
								? 'Connect Wallet'
								: instance
								? 'You already have an instance'
								: 'Create Instance'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Token Name"
								onChange={(e) => setTokenName(e.target.value)}
							/>
							<Input
								placeholder="Token Symbol"
								onChange={(e) => setTokenSymbol(e.target.value)}
							/>

							<Button onClick={createNewInstance}>
								{!account
									? 'Connet Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Create Instance'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default CreateInstance;
function NewInstance(): { mutate: any; isLoading: any } {
	throw new Error('Function not implemented.');
}
