import { ApproveAll } from './setApprovalForAll';
import { HyperverseProvider } from './utils/Provider';
import React from 'react';
import Doc from '../docs/setApprovalForAll.mdx';

export default {
	title: 'Components/ApproveAll',
	component: ApproveAll,
	parameters: {
		docs: {
			page: Doc,
		},
	},
};

const Template = (args) => (
	<HyperverseProvider>
		<ApproveAll {...args} />
	</HyperverseProvider>
);

export const Demo = Template.bind({});

Demo.args = {
	to: '0x9649F034fD2Ba3C9E58d556063AA2B7F8777E8F6',
	approved: true,
};
