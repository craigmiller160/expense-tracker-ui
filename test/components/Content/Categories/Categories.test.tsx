import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

describe('Manage Categories', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('displays all categories on sever', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Actions')).toBeVisible();
		expect(screen.queryByText('Add')).toBeVisible();
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(3)
		);
		expect(screen.queryByText('Groceries')).toBeVisible();
		expect(screen.queryByText('Restaurants')).toBeVisible();
		expect(screen.queryByText('Entertainment')).toBeVisible();
	});

	it('adds new category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		throw new Error();
	});

	it('updates category name', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		throw new Error();
	});

	it('deletes category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		throw new Error();
	});
});
