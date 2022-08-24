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
	const [tokenId, setTokenId] = useState('');

	const erc1155 = useERC1155();

	const { data: instance } = useQuery('checkInstance', () => erc1155.checkInstance!(account!), {
		enabled: !!erc1155.factoryContract,
	});

	const fetchData = () => {
		return new Promise(resolve => {
	    resolve(erc1155.getTotalSupplyOf!(tokenId!));
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
			<h4>Get Total Supply Of</h4>
			<p>Get the total supply minted of a token identifier</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Get Total Supply Of'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Content>
							<Input
								placeholder="Token Identifier"
								onChange={(e) => setTokenId(e.target.value)}
							/>

							<Button onClick={handleClick}>
								{!account
									? 'Connect Wallet'
									: isFetching
									? 'fetching ...'
									: !hidden
									? 'Get Total Supply Of'
									: data ? data.toString() : 'No Token Supply'}
							</Button>
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default GetTotalSupplyOf;
