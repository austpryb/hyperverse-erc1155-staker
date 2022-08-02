import { GetTokenCounter } from './getTokenCounter';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/getTokenCounter.mdx';

export default {
	title: 'Components/GetTokenCounter',
	component: GetTokenCounter,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<GetTokenCounter {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {

};
