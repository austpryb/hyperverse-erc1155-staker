import { GetTenantOwner } from './getTenantOwner';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getTenantOwner.mdx';

export default {
	title: 'Components/GetTenantOwner',
	component: GetTenantOwner,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetTenantOwner {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
};
