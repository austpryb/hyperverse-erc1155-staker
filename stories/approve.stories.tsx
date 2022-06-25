import { Approve } from './approve';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/approve.mdx';

export default {
	title: 'Components/Approve',
	component: Approve,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<Approve {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	to: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81', 
	tokenId: 1
};
