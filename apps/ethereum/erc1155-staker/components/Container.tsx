import { styled } from '../stitches.config';
//import CreateInstance from './WriteFunctions/CreateInstance';
//import Transfer from './WriteFunctions/Transfer';
//// import GetBalanceOf from './ReadFunctions/GetBalanceOf';
//// import GetTokenMetadata from './ReadFunctions/GetTokenMetadata';
//import GetTotalSupplyOf from './ReadFunctions/GetTotalSupplyOf';
//// import GetTokenCounter from './ReadFunctions/GetTokenCounter';
//import Approve from './WriteFunctions/Approve';
//import BaseURI from './WriteFunctions/SetBaseUri';
//import ApproveForAll from './WriteFunctions/ApproveForAll';
//import TogglePublicMint from './WriteFunctions/TogglePublicMint';
//import TenantMint from './WriteFunctions/TenantMint';
//import Mint from './WriteFunctions/Mint';
//// import GetTenantOwner from './ReadFunctions/GetTenantOwner';
// import GetProxy from './ReadFunctions/GetProxy';
import { useEthereum } from '@decentology/hyperverse-ethereum/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { useERC1155 } from '../hyperverse-evm-erc1155-staker/source/react'
import { useQuery } from 'react-query';
import dynamic from 'next/dynamic'

const GetBalanceOf = dynamic(() => import("./ReadFunctions/GetBalanceOf"), { ssr: false })
const GetTokenMetadata = dynamic(() => import("./ReadFunctions/GetTokenMetadata"), { ssr: false })
const GetTokenCounter = dynamic(() => import("./ReadFunctions/GetTokenCounter"), { ssr: false })
const GetTenantOwner = dynamic(() => import("./ReadFunctions/GetTenantOwner"), { ssr: false })
const GetProxy = dynamic(() => import("./ReadFunctions/GetProxy"), { ssr: false })
const GetTokenUri = dynamic(() => import("./ReadFunctions/GetTokenUri"), { ssr: false })
const GetTotalSupplyOf = dynamic(() => import("./ReadFunctions/GetTotalSupplyOf"), { ssr: false })
const GetPolicyModelWhitelist = dynamic(() => import("./ReadFunctions/GetPolicyModelWhitelist"), { ssr: false })
const GetApprovedForAll = dynamic(() => import("./ReadFunctions/GetApprovedForAll"), { ssr: false })

const CreateInstance = dynamic(() => import("./WriteFunctions/CreateInstance"), { ssr: false })
const ApproveForAll = dynamic(() => import("./WriteFunctions/ApproveForAll"), { ssr: false })
const SetTokenUri = dynamic(() => import("./WriteFunctions/SetTokenUri"), { ssr: false })
const Mint = dynamic(() => import("./WriteFunctions/Mint"), { ssr: false })
const Burn = dynamic(() => import("./WriteFunctions/Burn"), { ssr: false })
const TogglePublicMint = dynamic(() => import("./WriteFunctions/TogglePublicMint"), { ssr: false })
const SafeTransferFrom = dynamic(() => import("./WriteFunctions/SafeTransferFrom"), { ssr: false })
const SetModel = dynamic(() => import("./WriteFunctions/SetModel"), { ssr: false })
const AddWhitelistAddress = dynamic(() => import("./WriteFunctions/AddWhitelistAddress"), { ssr: false })
const RemoveWhitelistAddress = dynamic(() => import("./WriteFunctions/RemoveWhitelistAddress"), { ssr: false })

const Container = () => {
	const { address } = useEthereum();
	const erc1155 = useERC1155();
	const { account } = useEthereum();
	const { data: instance } = useQuery('checkInstance', () => erc1155.checkInstance!(account!), {
		enabled: !!erc1155.factoryContract,
	});

	const toastId = 'instance';

	useEffect(() => {
		if (!instance && !toast.isActive(toastId)) {
			toast.info(
				'Make sure you have an instance. If you already have one change the tenant ID in _app.tsx to test this app',
				{
					position: toast.POSITION.BOTTOM_CENTER,
					toastId: 'instance',
				}
			);
		}
	}, [instance]);

	return (
		<Box>
			<Reminder>
				<BsFillExclamationDiamondFill />
				<p>New instance <b>tenantId</b> is saved to <b>local storage</b> upon creation.</p>
			</Reminder>

			<h3>Token Factory Functions</h3>
			<Section>
				<GetProxy />
				<CreateInstance />
			</Section>

			<h3>Tenant Owner Functions</h3>
			<Section>
				<GetTenantOwner />
				<SetTokenUri />
				<TogglePublicMint />
			</Section>

			<h3>Token Read Functions</h3>
			<Section>
				<GetTokenMetadata />
				<GetTokenUri />
				<GetTokenCounter />
				<GetTotalSupplyOf />
				<GetBalanceOf />
				<GetPolicyModelWhitelist />
				<GetApprovedForAll />
			</Section>

			<h3>Token Write Functions</h3>
			<Section>
				<ApproveForAll />
				<Mint	/>
				<SafeTransferFrom />
				<Burn />
				<SetModel />
				<AddWhitelistAddress />
				<RemoveWhitelistAddress />
			</Section>
		</Box>
	);
};

export default Container;

const Box = styled('div', {
	display: 'flex',
	overflowY: 'scroll',
	overflowX: 'hidden',
	flexDirection: 'column',
	marginTop: '1rem',
	borderRadius: '10px',
	backgroundColor: '$gray100',
	height: '70vh',
	padding: '0 2rem 2rem',
	color: '$blue500',
	'& h3': {
		marginTop: '1rem',
	},
});

const Section = styled('div', {
	marginTop: '1rem',
	display: 'grid',
	gridTemplateColumns: '270px 270px 270px 270px 257px',
	gridGap: '10px',
});

const Reminder = styled('div', {
	display: 'flex',
	alignItems: 'center',
	backgroundColor: 'rgba(243, 225, 107, 0.5)',
	width: '99%',
	padding: '0.5rem',
	marginTop: '1rem',
	color: '$blue500',
	fontSize: '12px',
	borderRadius: '5px',
	'& svg': {
		marginRight: '0.5rem',
		fontSize: '1rem',
	},
});
