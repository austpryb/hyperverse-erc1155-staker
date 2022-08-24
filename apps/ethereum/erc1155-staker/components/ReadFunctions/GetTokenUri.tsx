import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useERC1155 } from '../../hyperverse-evm-erc1155-staker/source/react';
import { styled } from '@stitches/react';
import { MdFileCopy } from 'react-icons/md';
import {
	Box,
	Item,
	TriggerContainer,
	Trigger,
	Parameters,
	//Input,
	//Content,
	//Button,
} from '../ComponentStyles';
import { useQuery } from 'react-query';

const shortenUri = (tokenUri: string = '', charLength: number = 10, postCharLength?: number) => {
	let shortenedUri;
	if (postCharLength) {
		shortenedUri =
			tokenUri.slice(0, charLength) +
			'...' +
			tokenUri.slice(tokenUri.length - postCharLength, tokenUri.length);
	} else {
		shortenedUri = tokenUri.slice(0, charLength);
	}
	return shortenedUri + "...";
};

const GetTokenUri = () => {
	const [metadataCopied, setMetadataCopied] = useState<boolean>(false);
	const { account } = useEthereum();
	const [tokenId, setTokenId] = useState('');
	//const [address, setAddress] = useState('');

	const erc1155 = useERC1155();

	const { data: instance } = useQuery('checkInstance', () => erc1155.checkInstance!(account!), {
		enabled: !!erc1155.factoryContract,
	});

	const fetchData = () => {
		return new Promise(resolve => {
	    resolve(erc1155.getTokenUri!(tokenId!));
	  });
	};

	const handleClick = () => {
		setHidden((p) => !p);
  	refetch();
	};

	const { data, status, isFetching, error, refetch } = useQuery("fetchData", fetchData, {
  	refetchOnWindowFocus: false,
  	enabled: false,
		staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0
	});

  //const decodedData = atob(data);
	//console.log(data.split(',')[1]);

	//const { data, isLoading } = useQuery('tokenMetadata', () => erc1155.getTokenMetadata!(tokenId!), {
	//	enabled: !!erc1155.proxyContract
	//});

	const [hidden, setHidden] = useState(false);
	//const noMetadata = data === null;
	//const showInfo = !instance ?shortenMetadata(data, 5, 5) : 'You need a token instance';

	return (
		<Box>
			<h4>Get Token Uri</h4>
			<p>Get the Uri of a provided token identifier</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Query Token Uri'}
						</Trigger>
					</TriggerContainer>
					<Parameters>
						<Input
							placeholder="Token Identifier"
							onChange={(e) => setTokenId(e.target.value)}
						/>
						<Content>
							<Button onClick={handleClick}>
								{!account
									? 'Connect Wallet'
									: isFetching
									? 'fetching ...'
									: !hidden
									? 'Get Token Uri'
									: data ? shortenUri(data, 10, 0) : 'No Token Uri Exists'}
							</Button>
							{hidden && (
								<CopyButton
									onClick={() => {
										navigator.clipboard.writeText(data);
										setMetadataCopied(true);
									}}
								>
									{!metadataCopied ? <MdFileCopy /> : ''}
								</CopyButton>
							)}
						</Content>
					</Parameters>
				</Item>
			</Accordion.Root>
		</Box>
	);
};

export default GetTokenUri;

export const Button = styled('button', {
	minWidth: '150px',
	backgroundColor: '$yellow100',
	outline: 'none',
	border: 'none',
	padding: '10px 15px',
	borderRadius: '90px',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.8,
	},
});

export const Input = styled('input', {
	padding: '10px 15px',
	marginTop: '15px',
	marginBottom: '5px',
	width: '150px',
	margin: '15px 1',
	backgroundColor: '$gray200',
	border: 'none',
	color: 'white',
});

const CopyButton = styled('button', {
	backgroundColor: 'transparent',
	marginLeft: '5px',
	outline: 'none',
	border: 'none',
	color: '$yellow100',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.8,
	},
});

const Content = styled('div', {
	margin: '10px auto -5px',
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
	marginTop: '10px',
	justifyContent: 'center',
	alignItems: 'center',
});
