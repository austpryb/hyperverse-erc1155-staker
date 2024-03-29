import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useERC1155 } from  '../../hyperverse-evm-erc1155-staker/source/react';
import { useMutation } from 'react-query';
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

const ApproveForAll = () => {
	const { account } = useEthereum();
	const [operator, setOperator] = useState('');
	const [approved, setApproved] = useState(false);

	const erc1155 = useERC1155();
	const { mutate, isLoading } = useMutation('setApprovalForAll', erc1155.setApprovalForAll);

	const approve = async () => {
		try {
			const instanceData = {
				operator: operator,
				approved: approved,
			};
			mutate(instanceData);
		} catch (error) {
			throw error;
		}
	};

	return (
		<Box>
			<h4>Approve For All</h4>
			<p> Approve an operator to transfer tokens you own </p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Approve'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Operator"
								onChange={(e) => setOperator(e.target.value)}
							/>
							<Input
								type="boolean"
								placeholder="True or False"
								onChange={(e) => setApproved(e.currentTarget.checked)}
							/>
							<Button onClick={approve}>
								{!account
									? 'Connect Wallet'
									: isLoading
									? 'txn loading ...'
									: 'Approve For All'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default ApproveForAll;
