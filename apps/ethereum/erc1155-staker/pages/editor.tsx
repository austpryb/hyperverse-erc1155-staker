import Head from 'next/head';
import Nav from '../components/Nav';
import CasbinEditor from '../components/editor';
import React, { useEffect } from 'react';

export default function Editor() {

	return (
		<>
			<Head>
				<title>Neutrino	</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

				<main>
					<Nav />
					<CasbinEditor />
				</main>
		</>
	);
}
