import { IsInPolicyModelWhitelist } from './isInPolicyModelWhitelist';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/isInPolicyModelWhitelist.mdx';

export default {
	title: 'Components/IsInPolicyModelWhitelist',
	component: IsInPolicyModelWhitelist,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<IsInPolicyModelWhitelist {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	address: "0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81"
};
