import { initialize, Provider, Network } from '@decentology/hyperverse/react';
import { Ethereum } from '@decentology/hyperverse-ethereum/react';
import { ERC1155 } from '../hyperverse-evm-erc1155-staker/react';
import { globalCss } from '../stitches.config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@decentology/hyperverse-ethereum/styles.css';
import type { AppProps } from 'next/app';
import { useLocalStorage } from 'react-use';
import { createContext, useEffect } from 'react';
// import('../components/editor.css')

const globalStyles = globalCss({
	'*': {
		margin: 0,
		padding: 0,
	},
	html: {
		fontFamily: 'Proxima Nova, sans-serif',
		letterSpacing: '0.9px',
	},
	body: {
		backgroundColor: '$blue500',
		color: '$white100',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		fontSize: 16,
		padding: '0 24px',
		minHeight: 700,
		'@desktop': {
			padding: 0,
			width: '1100px',
		},
	},
	a: {
		cursor: 'pointer',
		textDecoration: 'none',

		'&:hover': {
			opacity: 0.8,
		},
	},
});
const queryClient = new QueryClient();
export const AppContext = createContext({
	tenantId: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81',
	setTenantId: (value: string) => {},
});

function MyApp({ Component, pageProps }: AppProps) {
	const [tenantId, setTenantId, removeTenantId] = useLocalStorage(
		'hyperverse-evm-erc1155-tenantId',
		'0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81'
	);

	const hyperverse = initialize({
		blockchain: Ethereum,
		network: Network.Testnet,
		modules: [
			{
				bundle: ERC1155,
				tenantId: tenantId!,
			},
		],
	});

	useEffect(() => {
			 if (typeof window !== 'undefined') {
							 const loader = document.getElementById('globalLoader');
					 if (loader)
							 loader.style.display = 'none';
			 }
	 }, []);
	//console.log(tenantId);
	globalStyles();
	return (
		<QueryClientProvider client={queryClient}>
			<Provider initialState={hyperverse}>
				<ToastContainer />
				<AppContext.Provider
					value={{
						tenantId: tenantId!,
						setTenantId,
					}}
				>
					<Component {...pageProps} />
				</AppContext.Provider>
			</Provider>
		</QueryClientProvider>
	);
}

export default MyApp;
