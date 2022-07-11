import { Transfer } from './transfer';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/transfer.mdx';

export default {
	title: 'Components/Transfer',
	component: Transfer,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<Transfer {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	from: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81',
	to: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
	tokenId: 0,
	amount: 1,
	data: '0x'
};
