import { GetBalanceOf } from './getBalanceOf';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getBalanceOf.mdx';

export default {
	title: 'Components/GetBalanceOf',
	component: GetBalanceOf,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetBalanceOf {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	account: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81'
};
