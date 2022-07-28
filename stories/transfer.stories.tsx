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
	from: String(process.env.NEXT_ADMIN_PUBLIC_KEY),
	to: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
	tokenId: 1,
	amount: 1,
	data: '0x'
};
