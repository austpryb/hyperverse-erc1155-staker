import { RemoveWhitelistAddress } from './removeWhitelistAddress';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/removeWhitelistAddress.mdx';

export default {
	title: 'Components/RemoveWhitelistAddress',
	component: RemoveWhitelistAddress,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<RemoveWhitelistAddress {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	_address: "0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81"
};
