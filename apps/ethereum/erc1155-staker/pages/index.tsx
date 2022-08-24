import Head from 'next/head';
import Nav from '../components/Nav';
import Container from '../components/Container';
import loader from "./loader";

export default function Home() {
	return (
		<>
			<Head>
				<title>Neutrino	</title>
				<link rel="icon" href="/favicon.ico" />
				<head>
						<style>
								{loader}
						</style>
				</head>
			</Head>

			<div id={'globalLoader'}>
					 <div className="loader">
							<div/>
							<div/>
					</div>
			</div>

				<main>
					<Nav />
					<Container />
				</main>
		</>
	);
}
