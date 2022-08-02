import { GetTokenMetadata } from './getTokenMetadata';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getTokenMetadata.mdx';

export default {
	title: 'Components/GetTokenMetadata',
	component: GetTokenMetadata,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetTokenMetadata {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	tokenId: 1
};
