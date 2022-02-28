export * from '@decentology/web3modal';
import { useEthereum } from './useEthereum';
import Provider from './Provider'
import { blockchains, makeHyperverseBlockchain } from '@decentology/hyperverse';

export const Ethereum = makeHyperverseBlockchain({
	name: blockchains.Ethereum,
	Provider: Provider,
});

export { Provider, useEthereum };
