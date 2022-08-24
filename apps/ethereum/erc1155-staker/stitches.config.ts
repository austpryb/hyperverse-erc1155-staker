import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
	createStitches({
		theme: {
			colors: {
				gray100: '#BEBEC7',
				gray200: '#5A5A6B',
				gray400: 'gainsboro',
				gray500: 'lightgray',
				blue500: '#1a1110', // 010b13
				blue200: '#77DD77',
				green200: '#2C8D3D',
				yellow100: '#77DD77',
			},
		},
		media: {
			bp1: '(min-width: 480px)',
		},
		utils: {
			marginX: (value: any) => ({ marginLeft: value, marginRight: value }),
		},
	});
