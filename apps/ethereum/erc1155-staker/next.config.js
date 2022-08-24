const path = require('path');
const withTM = require('next-transpile-modules')([
	'@decentology/unstated-next',
	'@decentology/hyperverse',
	'@decentology/hyperverse-ethereum',
	'@decentology/hyperverse-evm',
	//'./hyperverse-evm-erc1155-staker/source',
]);

module.exports = withTM({
	reactStrictMode: true,
	basePath: process.env.NODE_ENV === 'production' ? '/erc1155-app' : null,
	images: {
		...(process.env.NODE_ENV === 'production'
			? {
					loader: 'imgix',
					path: 'https://samples.hyperverse.dev/erc1155-app/',
			  }
			: {}),
		domains: ['siasky.net', 'fileportal.org'],
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = ['react', 'react-dom', ...config.externals];
		}
		config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');
		config.resolve.alias['react-dom'] = path.resolve(__dirname, '.', 'node_modules', 'react-dom');
		config.resolve.fallback = {
			...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
				// by next.js will be dropped. Doesn't make much sense, but how it is
			fs: false, // the solution
		};
		return config;
	},
});
