import { ApiServer, newApiServer } from '../../server';
import { renderApp } from '../../testutils/renderApp';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

describe('Navbar', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('renders before authentication', () => {
		apiServer.actions.clearDefaultUser();
		renderApp();
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Login')).toBeVisible();
		expect(screen.queryByText('Logout')).not.toBeVisible();
		expect(screen.queryByText('Manage Categories')).not.toBeVisible();
	});

	it('renders after authentication', () => {
		renderApp();
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Login')).not.toBeVisible();
		expect(screen.queryByText('Logout')).toBeVisible();
		expect(screen.queryByText('Manage Categories')).toBeVisible();
	});
});
