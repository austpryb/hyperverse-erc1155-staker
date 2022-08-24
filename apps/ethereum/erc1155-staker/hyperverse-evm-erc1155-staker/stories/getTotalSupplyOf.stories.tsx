import { GetTotalSupplyOf } from './getTotalSupplyOf';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getTotalSupplyOf.mdx';

export default {
	title: 'Components/GetTotalSupplyOf',
	component: GetTotalSupplyOf,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetTotalSupplyOf {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	id: 1
};
