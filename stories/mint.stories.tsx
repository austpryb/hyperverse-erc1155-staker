import { Mint } from './mint';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/mint.mdx';

export default {
	title: 'Components/Mint',
	component: Mint,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<Mint {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	to: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81',
	tokenId: 0,
	amount: 1
};
