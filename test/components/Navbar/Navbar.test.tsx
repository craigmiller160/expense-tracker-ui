import { ApiServer, newApiServer } from '../../server';
import { renderApp } from '../../testutils/renderApp';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';

describe('Navbar', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('renders before authentication', async () => {
		apiServer.actions.clearDefaultUser();
		renderApp();
		await waitFor(() => expect(screen.queryByText('Login')).toBeVisible());
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		expect(screen.queryByText('Manage Categories')).not.toBeInTheDocument();
	});

	it('renders after authentication', async () => {
		renderApp();
		await waitFor(() => expect(screen.queryByText('Logout')).toBeVisible());
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Login')).not.toBeInTheDocument();
		expect(screen.queryByText('Manage Categories')).toBeVisible();
	});
});
