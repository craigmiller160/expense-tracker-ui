import { renderApp } from '../../testutils/renderApp';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';

describe('Navbar', () => {
	it('renders before authentication', async () => {
		apiServer.actions.clearDefaultUser();
		await renderApp();
		await waitFor(() => expect(screen.queryByText('Login')).toBeVisible());
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		expect(screen.queryByText('Manage Categories')).not.toBeInTheDocument();
	});

	it('renders after authentication', async () => {
		await renderApp();
		await waitFor(() => expect(screen.queryByText('Logout')).toBeVisible());
		expect(screen.queryByText('Expense Tracker')).toBeVisible();
		expect(screen.queryByText('Login')).not.toBeInTheDocument();
		expect(screen.queryByText('Manage Categories')).toBeVisible();
	});
});
