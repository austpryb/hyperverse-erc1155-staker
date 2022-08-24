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

const GetTotalSupplyOf = () => {
	const { account } = useEthereum();
  const [address, setAddress] = useState('');

	const erc1155 = useERC1155();

	const { data: instance } = useQuery('checkInstance', () => erc1155.checkInstance!(account!), {
		enabled: !!erc1155.factoryContract,
	});

	const fetchData = () => {
		return new Promise(resolve => {
	    resolve(erc1155.isInPolicyModelWhitelist!(address!));
	  });
	};

	const handleClick = () => {
		setHidden((p) => !p);
  	refetch();
	};

	const { data, status, isFetching, error, refetch } = useQuery("fetchTotalSupplyOf", fetchData, {
  	refetchOnWindowFocus: false,
  	enabled: false,
		staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0
	});

	const [hidden, setHidden] = useState(false);

	return (
		<Box>
			<h4>Policy Model Whitelist</h4>
			<p>Checks if a given address is in the policy model whitelist</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Check Policy Model Whitelist'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Wallet Address"
								onChange={(e) => setAddress(e.target.value)}
							/>

							<Button onClick={handleClick}>
								{!account
									? 'Connect Wallet'
									: isFetching
									? 'fetching ...'
									: !hidden
									? 'Is In Policy Model Whitelist'
									: data ? data.toString() : 'Address Not Whitelisted'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default GetTotalSupplyOf;
