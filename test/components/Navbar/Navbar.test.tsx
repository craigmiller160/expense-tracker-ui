import { ApiServer, newApiServer } from '../../server';
import { renderApp } from '../../testutils/renderApp';
import { screen } from 'solid-testing-library';
import '@testing-library/jest-dom';

describe('Navbar', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});
	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('is logged in', () => {
		renderApp();
		expect(screen.findByText('Logout')).toBeInTheDocument();
	});

	it('is not logged in', () => {
		throw new Error();
	});
});
