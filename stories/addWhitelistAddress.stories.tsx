import { AddWhitelistAddress } from './addWhitelistAddress';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/addWhitelistAddress.mdx';

export default {
	title: 'Components/AddWhitelistAddress',
	component: AddWhitelistAddress,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<AddWhitelistAddress {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	_address: "0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81"
};
