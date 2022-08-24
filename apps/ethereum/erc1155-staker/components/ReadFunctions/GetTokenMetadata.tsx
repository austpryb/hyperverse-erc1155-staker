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

const shortenMetadata = (tokenMetadata: string = '', charLength: number = 10, postCharLength?: number) => {
	let shortenedMetadata;
	if (postCharLength) {
		shortenedMetadata =
			tokenMetadata.slice(0, charLength) +
			'...' +
			tokenMetadata.slice(tokenMetadata.length - postCharLength, tokenMetadata.length);
	} else {
		shortenedMetadata = tokenMetadata.slice(0, charLength);
	}
	return shortenedMetadata + "...";
};

const decodeMetadata = (encodedData: string) => {
	let decodedMetadata;
	decodedMetadata = encodedData.split(',')[1];
	decodedMetadata = atob(decodedMetadata);
	return decodedMetadata

}

const GetTokenMetadata = () => {
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
	    resolve(erc1155.getTokenMetadata!(tokenId!));
	  });
	};

	const handleClick = () => {
		setHidden((p) => !p);
  	refetch();
	};

	const { data, status, isFetching, error, refetch } = useQuery("fetchMetaData", fetchData, {
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
			<h4>Get Token Metadata</h4>
			<p>Get the metadata of a provided token identifier</p>
			<Accordion.Root type="single" collapsible>
				<Item value="item-1">
					<TriggerContainer>
						<Trigger disabled={!account}>
							{!account ? 'Connect Wallet' : 'Query Token Metadata'}
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
									? 'Get Token Metadata'
									: data ? shortenMetadata(data, 5, 5) : 'Invalid Token Id'}
							</Button>
							{hidden && (
								<CopyButton
									onClick={() => {
										navigator.clipboard.writeText(decodeMetadata(data));
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

export default GetTokenMetadata;

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
