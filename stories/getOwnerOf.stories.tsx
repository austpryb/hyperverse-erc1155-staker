import { GetOwnerOf } from './getOwnerOf';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getOwnerOf.mdx';

export default {
	title: 'Components/GetOwnerOf',
	component: GetOwnerOf,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetOwnerOf {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	tokenId: 1,
	account: "0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81"
};
